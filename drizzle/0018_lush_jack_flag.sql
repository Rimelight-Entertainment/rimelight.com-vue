ALTER TABLE "fast" ADD COLUMN "start_time" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "fast" ADD COLUMN "duration_hours" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "fast" ADD COLUMN "target_time" timestamp with time zone NOT NULL;