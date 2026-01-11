ALTER TABLE "project-type" RENAME COLUMN "display_name" TO "localization_key";--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "index" DROP DEFAULT;