ALTER TABLE "label" RENAME TO "noteLabel";--> statement-breakpoint
ALTER TABLE "note_label" RENAME TO "note_noteLabel";--> statement-breakpoint
ALTER TABLE "noteLabel" DROP CONSTRAINT "label_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "note_noteLabel" DROP CONSTRAINT "note_label_note_id_note_id_fk";
--> statement-breakpoint
ALTER TABLE "note_noteLabel" DROP CONSTRAINT "note_label_label_id_label_id_fk";
--> statement-breakpoint
ALTER TABLE "note_noteLabel" DROP CONSTRAINT "note_label_note_id_label_id_pk";--> statement-breakpoint
ALTER TABLE "note_noteLabel" ADD CONSTRAINT "note_noteLabel_note_id_label_id_pk" PRIMARY KEY("note_id","label_id");--> statement-breakpoint
ALTER TABLE "noteLabel" ADD CONSTRAINT "noteLabel_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_noteLabel" ADD CONSTRAINT "note_noteLabel_note_id_note_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."note"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_noteLabel" ADD CONSTRAINT "note_noteLabel_label_id_noteLabel_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."noteLabel"("id") ON DELETE cascade ON UPDATE no action;