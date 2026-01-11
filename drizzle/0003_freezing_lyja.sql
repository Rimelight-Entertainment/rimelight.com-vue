ALTER TABLE "author" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "author" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "author" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "author" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "document" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "document" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "document" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "document" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "document_type" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "document_type" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "document_type" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "document_type" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "blog-post" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "blog-post" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "blog-post" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "blog-post" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "blog_post_type" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "blog_post_type" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "blog_post_type" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "blog_post_type" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project-type" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project-type" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project-type" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "project-type" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "grocery" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "grocery" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "grocery" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "grocery" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "grocery_type" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "grocery_type" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "grocery_type" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "grocery_type" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "grocery-brand" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "grocery-brand" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "grocery-brand" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "grocery-brand" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;