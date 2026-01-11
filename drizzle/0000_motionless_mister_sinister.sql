CREATE TABLE "author" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"avatar" jsonb NOT NULL,
	"name" text NOT NULL,
	"username" text,
	"url" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "document" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"slug" text NOT NULL,
	"document_type_id" uuid NOT NULL,
	"title" text DEFAULT 'New Project' NOT NULL,
	"links" jsonb,
	"content" jsonb NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "document_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "document_type" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"index" integer NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "document_type_index_unique" UNIQUE("index"),
	CONSTRAINT "document_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "blog-post" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"slug" text NOT NULL,
	"blog_post_type_id" uuid NOT NULL,
	"image" jsonb,
	"title" text DEFAULT 'Blog Post' NOT NULL,
	"description" text DEFAULT 'A blog post.' NOT NULL,
	"links" jsonb,
	"content" jsonb NOT NULL,
	"posted_at" timestamp,
	"test_field" text DEFAULT 'default value' NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "blog-post_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_post_type" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"index" integer NOT NULL,
	"name" text NOT NULL,
	"locazlization_key" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "blog_post_type_index_unique" UNIQUE("index"),
	CONSTRAINT "blog_post_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "blog-post_author" (
	"blog_post_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	CONSTRAINT "blog-post_author_blog_post_id_author_id_pk" PRIMARY KEY("blog_post_id","author_id")
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"index" integer DEFAULT 0 NOT NULL,
	"slug" text NOT NULL,
	"project_type_id" uuid NOT NULL,
	"image" jsonb,
	"title" text DEFAULT 'New Project' NOT NULL,
	"description" text DEFAULT 'A project.' NOT NULL,
	"links" jsonb,
	"content" jsonb NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "project_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "project-type" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"index" integer NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "project-type_index_unique" UNIQUE("index"),
	CONSTRAINT "project-type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "project_author" (
	"project_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	CONSTRAINT "project_author_project_id_author_id_pk" PRIMARY KEY("project_id","author_id")
);
--> statement-breakpoint
CREATE TABLE "grocery" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"grocery_type_id" uuid NOT NULL,
	"image_src" varchar(512),
	"name" varchar(255) NOT NULL,
	"package_size" varchar(50),
	"notes" varchar(256),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "grocery_type" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"index" integer NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "grocery_type_index_unique" UNIQUE("index"),
	CONSTRAINT "grocery_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "grocery-brand" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "grocery-brand_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "grocery_grocery-brand" (
	"project_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	CONSTRAINT "grocery_grocery-brand_project_id_author_id_pk" PRIMARY KEY("project_id","author_id")
);
--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_document_type_id_document_type_id_fk" FOREIGN KEY ("document_type_id") REFERENCES "public"."document_type"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "blog-post" ADD CONSTRAINT "blog-post_blog_post_type_id_blog_post_type_id_fk" FOREIGN KEY ("blog_post_type_id") REFERENCES "public"."blog_post_type"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "blog-post_author" ADD CONSTRAINT "blog-post_author_blog_post_id_blog-post_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog-post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog-post_author" ADD CONSTRAINT "blog-post_author_author_id_author_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."author"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_project_type_id_project-type_id_fk" FOREIGN KEY ("project_type_id") REFERENCES "public"."project-type"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "project_author" ADD CONSTRAINT "project_author_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_author" ADD CONSTRAINT "project_author_author_id_author_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."author"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grocery" ADD CONSTRAINT "grocery_grocery_type_id_grocery_type_id_fk" FOREIGN KEY ("grocery_type_id") REFERENCES "public"."grocery_type"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "grocery_grocery-brand" ADD CONSTRAINT "grocery_grocery-brand_project_id_grocery_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."grocery"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grocery_grocery-brand" ADD CONSTRAINT "grocery_grocery-brand_author_id_grocery-brand_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."grocery-brand"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."document_view" AS (select "id", "slug", "document_type_id", "title", "links", "content", "updated_at", "created_at", "deleted_at" from "document");