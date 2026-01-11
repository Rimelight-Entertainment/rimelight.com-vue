CREATE TABLE "music" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" text NOT NULL,
	"data" jsonb DEFAULT '{"piano":{"routine":[],"exercises":[],"repertoire":[],"repertoireStates":["New","In Progress","Done"]},"guitar":{"routine":[],"exercises":[],"repertoire":[],"repertoireStates":["New","In Progress","Done"]},"dj":{"routine":[],"exercises":[],"mixes":[]}}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "music" ADD CONSTRAINT "music_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;