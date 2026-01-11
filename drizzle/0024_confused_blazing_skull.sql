CREATE TABLE "workout" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" text NOT NULL,
	"data" jsonb DEFAULT '{"exercises":[],"stretches":[]}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "music" ALTER COLUMN "data" SET DEFAULT '{"piano":{"routine":[],"exercises":[],"repertoire":[],"repertoireStates":[],"repertoireComposers":[]},"guitar":{"routine":[],"exercises":[],"repertoire":[],"repertoireStates":[],"repertoireComposers":[]},"dj":{"routine":[],"exercises":[],"mixes":[],"djGenres":[]}}'::jsonb;--> statement-breakpoint
ALTER TABLE "workout" ADD CONSTRAINT "workout_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;