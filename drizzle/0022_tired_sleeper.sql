CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"slug" text NOT NULL,
	"type" text NOT NULL,
	"title" jsonb NOT NULL,
	"description" jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"author_ids" jsonb DEFAULT '[]'::jsonb,
	"content" jsonb NOT NULL,
	"posted_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" text NOT NULL,
	"data" jsonb DEFAULT '{"years":[]}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
DROP TABLE "author" CASCADE;--> statement-breakpoint
DROP TABLE "document" CASCADE;--> statement-breakpoint
DROP TABLE "document_type" CASCADE;--> statement-breakpoint
DROP TABLE "blog-post" CASCADE;--> statement-breakpoint
DROP TABLE "blog_post_type" CASCADE;--> statement-breakpoint
DROP TABLE "blog-post_author" CASCADE;--> statement-breakpoint
DROP TABLE "project" CASCADE;--> statement-breakpoint
DROP TABLE "project-type" CASCADE;--> statement-breakpoint
DROP TABLE "project_author" CASCADE;--> statement-breakpoint
DROP TABLE "grocery" CASCADE;--> statement-breakpoint
DROP TABLE "grocery_type" CASCADE;--> statement-breakpoint
DROP TABLE "grocery-brand" CASCADE;--> statement-breakpoint
DROP TABLE "grocery_grocery-brand" CASCADE;--> statement-breakpoint
DROP TABLE "fast" CASCADE;--> statement-breakpoint
ALTER TABLE "habits" ADD CONSTRAINT "habits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;