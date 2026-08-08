-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('FREE', 'PRO');

-- CreateEnum
CREATE TYPE "FeedbackRating" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "TriageSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TriageCheckStatus" AS ENUM ('PASS', 'FAIL', 'PENDING', 'SKIPPED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "tier" "Tier" NOT NULL DEFAULT 'FREE',
    "scans_used_this_month" INTEGER NOT NULL DEFAULT 0,
    "scan_quota_reset_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "family_id" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scans" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "image_hash" TEXT NOT NULL,
    "tap_x" DOUBLE PRECISION NOT NULL,
    "tap_y" DOUBLE PRECISION NOT NULL,
    "component_name" TEXT NOT NULL,
    "ai_response" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "thumbnail_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_feedback" (
    "id" UUID NOT NULL,
    "scan_id" UUID NOT NULL,
    "rating" "FeedbackRating" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triage_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "TriageSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "primary_suspect" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ,

    CONSTRAINT "triage_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triage_check_results" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "check_key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "status" "TriageCheckStatus" NOT NULL DEFAULT 'PENDING',
    "confidence" DOUBLE PRECISION,
    "result_text" TEXT,
    "ai_response" JSONB,
    "image_hash" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "triage_check_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripe_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stripe_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_subscription_id_key" ON "users"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_hash_idx" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "scans_user_id_created_at_idx" ON "scans"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "scans_image_hash_idx" ON "scans"("image_hash");

-- CreateIndex
CREATE UNIQUE INDEX "scan_feedback_scan_id_key" ON "scan_feedback"("scan_id");

-- CreateIndex
CREATE INDEX "triage_sessions_user_id_created_at_idx" ON "triage_sessions"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "triage_check_results_session_id_idx" ON "triage_check_results"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "triage_check_results_session_id_check_key_key" ON "triage_check_results"("session_id", "check_key");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scans" ADD CONSTRAINT "scans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_feedback" ADD CONSTRAINT "scan_feedback_scan_id_fkey" FOREIGN KEY ("scan_id") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triage_sessions" ADD CONSTRAINT "triage_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "triage_check_results" ADD CONSTRAINT "triage_check_results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "triage_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
