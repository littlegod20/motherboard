import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tier } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private readonly stripe: Stripe | null;
  private readonly priceId: string;
  private readonly webhookSecret: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const key = config.get<string>('STRIPE_SECRET_KEY', '');
    this.stripe = key
      ? new Stripe(key, { apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion })
      : null;
    this.priceId = config.get<string>('STRIPE_PRO_PRICE_ID', '');
    this.webhookSecret = config.get<string>('STRIPE_WEBHOOK_SECRET', '');
  }

  private requireStripe(): Stripe {
    if (!this.stripe || !this.priceId) {
      throw new ServiceUnavailableException({
        code: 'BILLING_UNAVAILABLE',
        message: 'Stripe billing is not configured',
      });
    }
    return this.stripe;
  }

  async createCheckoutSession(userId: string) {
    const stripe = this.requireStripe();
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: this.priceId, quantity: 1 }],
      success_url: this.config.getOrThrow<string>('STRIPE_SUCCESS_URL'),
      cancel_url: this.config.getOrThrow<string>('STRIPE_CANCEL_URL'),
      client_reference_id: userId,
      metadata: { userId },
      subscription_data: { metadata: { userId } },
    });

    return { url: session.url, sessionId: session.id };
  }

  async createPortalSession(userId: string) {
    const stripe = this.requireStripe();
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (!user.stripeCustomerId) {
      throw new BadRequestException({
        code: 'NO_CUSTOMER',
        message: 'No Stripe customer for this user',
      });
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: this.config.getOrThrow<string>('STRIPE_SUCCESS_URL'),
    });

    return { url: portal.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string | undefined) {
    const stripe = this.requireStripe();
    if (!this.webhookSecret) {
      throw new ServiceUnavailableException({
        code: 'BILLING_UNAVAILABLE',
        message: 'Stripe webhook secret not configured',
      });
    }
    if (!signature) {
      throw new BadRequestException({
        code: 'MISSING_SIGNATURE',
        message: 'Missing Stripe-Signature header',
      });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret,
      );
    } catch (err) {
      this.logger.warn(
        `Webhook signature verification failed: ${err instanceof Error ? err.message : err}`,
      );
      throw new BadRequestException({
        code: 'INVALID_SIGNATURE',
        message: 'Invalid Stripe webhook signature',
      });
    }

    const existing = await this.prisma.stripeEvent.findUnique({
      where: { id: event.id },
    });
    if (existing) {
      return { received: true, duplicate: true };
    }

    await this.prisma.stripeEvent.create({
      data: { id: event.id, type: event.type },
    });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.activateFromCheckout(session);
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await this.syncSubscription(sub);
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await this.handleInvoicePaid(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await this.handleInvoiceFailed(invoice);
        break;
      }
      default:
        this.logger.debug(`Unhandled Stripe event: ${event.type}`);
    }

    return { received: true };
  }

  private async activateFromCheckout(session: Stripe.Checkout.Session) {
    const userId =
      session.client_reference_id ||
      session.metadata?.userId ||
      undefined;
    if (!userId) {
      this.logger.warn('checkout.session.completed without userId');
      return;
    }

    const subId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tier: Tier.PRO,
        stripeCustomerId:
          typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id,
        stripeSubscriptionId: subId ?? undefined,
      },
    });
  }

  private async syncSubscription(sub: Stripe.Subscription) {
    const userId = sub.metadata?.userId;
    const customerId =
      typeof sub.customer === 'string' ? sub.customer : sub.customer.id;

    const user = userId
      ? await this.prisma.user.findUnique({ where: { id: userId } })
      : await this.prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

    if (!user) {
      this.logger.warn(`No user for subscription ${sub.id}`);
      return;
    }

    const active = ['active', 'trialing'].includes(sub.status);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        tier: active ? Tier.PRO : Tier.FREE,
        stripeSubscriptionId: active ? sub.id : null,
        stripeCustomerId: customerId,
      },
    });
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    const customerId =
      typeof invoice.customer === 'string'
        ? invoice.customer
        : invoice.customer?.id;
    if (!customerId) return;

    await this.prisma.user.updateMany({
      where: { stripeCustomerId: customerId },
      data: { tier: Tier.PRO },
    });
  }

  private async handleInvoiceFailed(invoice: Stripe.Invoice) {
    const customerId =
      typeof invoice.customer === 'string'
        ? invoice.customer
        : invoice.customer?.id;
    if (!customerId) return;

    // Keep PRO until subscription.deleted/updated demotes — log only
    this.logger.warn(`Payment failed for customer ${customerId}`);
  }
}
