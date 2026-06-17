CREATE TYPE "public"."reading_list_type" AS ENUM('to_be_read', 'reading', 'finished', 'did_not_finish');--> statement-breakpoint
CREATE TABLE "book_identifiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"identifier" text NOT NULL,
	"identifier_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "book_identifiers_identifier_key" UNIQUE("identifier")
);
--> statement-breakpoint
CREATE TABLE "book_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"source" text NOT NULL,
	"metric_key" text NOT NULL,
	"metric_value_number" real,
	"metric_value_text" text,
	"metric_value_json" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "book_metrics_book_id_source_metric_key_key" UNIQUE("book_id","source","metric_key")
);
--> statement-breakpoint
CREATE TABLE "book_subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"subject" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "book_subjects_book_id_subject_key" UNIQUE("book_id","subject")
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"canonical_key" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"author" text NOT NULL,
	"pages" integer,
	"language" text,
	"published_year" integer,
	"published_date" text,
	"publisher" text,
	"description" text NOT NULL,
	"cover" text NOT NULL,
	"primary_source" text NOT NULL,
	"primary_source_book_id" text NOT NULL,
	"isbn10" text,
	"isbn13" text,
	"series_name" text,
	"series_position" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "books_canonical_key_key" UNIQUE("canonical_key"),
	CONSTRAINT "books_source_book_key" UNIQUE("primary_source","primary_source_book_id")
);
--> statement-breakpoint
CREATE TABLE "reading_list_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"list_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"position" real NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reading_list_items_list_id_book_id_key" UNIQUE("list_id","book_id"),
	CONSTRAINT "reading_list_items_list_id_position_key" UNIQUE("list_id","position")
);
--> statement-breakpoint
CREATE TABLE "reading_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "reading_list_type" NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reading_lists_userId_type_unique" UNIQUE("user_id","type")
);
--> statement-breakpoint
CREATE TABLE "user_book_moods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"book_id" uuid NOT NULL,
	"mood" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_book_moods_user_id_book_id_mood_key" UNIQUE("user_id","book_id","mood")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "book_identifiers" ADD CONSTRAINT "book_identifiers_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_metrics" ADD CONSTRAINT "book_metrics_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_subjects" ADD CONSTRAINT "book_subjects_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_list_items" ADD CONSTRAINT "reading_list_items_list_id_reading_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."reading_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_list_items" ADD CONSTRAINT "reading_list_items_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_lists" ADD CONSTRAINT "reading_lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_book_moods" ADD CONSTRAINT "user_book_moods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_book_moods" ADD CONSTRAINT "user_book_moods_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_book_identifiers_book_id" ON "book_identifiers" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "idx_book_metrics_book_id" ON "book_metrics" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "idx_book_metrics_key" ON "book_metrics" USING btree ("metric_key");--> statement-breakpoint
CREATE INDEX "idx_book_subjects_book_id" ON "book_subjects" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "idx_book_subjects_subject" ON "book_subjects" USING btree ("subject");--> statement-breakpoint
CREATE INDEX "idx_books_isbn10" ON "books" USING btree ("isbn10");--> statement-breakpoint
CREATE INDEX "idx_books_isbn13" ON "books" USING btree ("isbn13");--> statement-breakpoint
CREATE INDEX "idx_books_source" ON "books" USING btree ("primary_source","primary_source_book_id");--> statement-breakpoint
CREATE INDEX "idx_list_items_list_position" ON "reading_list_items" USING btree ("list_id","position");--> statement-breakpoint
CREATE INDEX "idx_user_book_moods_user_book" ON "user_book_moods" USING btree ("user_id","book_id");