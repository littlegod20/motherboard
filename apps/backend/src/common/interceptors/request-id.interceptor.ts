import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { requestId?: string }>();
    const res = http.getResponse<Response>();
    const requestId =
      (req.headers['x-request-id'] as string) || randomUUID();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    const started = Date.now();

    return next.handle().pipe(
      tap(() => {
        res.setHeader('x-response-time', `${Date.now() - started}ms`);
      }),
    );
  }
}
