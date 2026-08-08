import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  REDIS_URL: Joi.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_TTL: Joi.string().default('15m'),
  JWT_REFRESH_TTL: Joi.string().default('7d'),
  CORS_ORIGINS: Joi.string().default('http://localhost:8081'),
  ANTHROPIC_API_KEY: Joi.string().allow('').default(''),
  OPENAI_API_KEY: Joi.string().allow('').default(''),
  AI_TIMEOUT_MS: Joi.number().default(7000),
  STRIPE_SECRET_KEY: Joi.string().allow('').default(''),
  STRIPE_WEBHOOK_SECRET: Joi.string().allow('').default(''),
  STRIPE_PRO_PRICE_ID: Joi.string().allow('').default(''),
  STRIPE_SUCCESS_URL: Joi.string().default(
    'boardscan://billing/success',
  ),
  STRIPE_CANCEL_URL: Joi.string().default('boardscan://billing/cancel'),
  FREE_MONTHLY_SCAN_LIMIT: Joi.number().default(10),
  PRO_MONTHLY_SCAN_LIMIT: Joi.number().default(300),
  BURST_RATE_LIMIT: Joi.number().default(5),
  BURST_RATE_WINDOW_SEC: Joi.number().default(60),
  SCAN_CACHE_TTL_SEC: Joi.number().default(86400),
  CLOUDINARY_CLOUD_NAME: Joi.string().allow('').default(''),
  CLOUDINARY_API_KEY: Joi.string().allow('').default(''),
  CLOUDINARY_API_SECRET: Joi.string().allow('').default(''),
  CLOUDINARY_FOLDER: Joi.string().default('boardscan'),
});
