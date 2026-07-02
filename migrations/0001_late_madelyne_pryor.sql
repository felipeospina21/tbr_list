CREATE TABLE "user_reading_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"book_id" uuid NOT NULL,
	"status" "reading_list_type" NOT NULL,
	"added_to_tbr_at" timestamp with time zone,
	"started_reading_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"dnf_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_reading_sessions" ADD CONSTRAINT "user_reading_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_reading_sessions" ADD CONSTRAINT "user_reading_sessions_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_reading_sessions_user_book" ON "user_reading_sessions" USING btree ("user_id","book_id");