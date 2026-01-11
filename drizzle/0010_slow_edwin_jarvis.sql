CREATE TABLE "rate_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text,
	"count" integer,
	"last_request" bigint
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" text NOT NULL;