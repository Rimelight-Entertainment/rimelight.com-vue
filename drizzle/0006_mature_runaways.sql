ALTER TABLE "invitation" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invitation" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "deleted_at" timestamp with time zone;