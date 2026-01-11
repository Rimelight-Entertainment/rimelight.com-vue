CREATE TABLE "note" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" text NOT NULL,
	"title" text,
	"content" text,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "label" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "note_label" (
	"note_id" uuid NOT NULL,
	"label_id" uuid NOT NULL,
	CONSTRAINT "note_label_note_id_label_id_pk" PRIMARY KEY("note_id","label_id")
);
--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "label" ADD CONSTRAINT "label_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_label" ADD CONSTRAINT "note_label_note_id_note_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."note"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_label" ADD CONSTRAINT "note_label_label_id_label_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."label"("id") ON DELETE cascade ON UPDATE no action;