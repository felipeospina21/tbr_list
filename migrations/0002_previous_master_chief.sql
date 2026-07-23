ALTER TABLE "books" ALTER COLUMN "series_position" TYPE integer USING NULLIF("series_position", '')::integer;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "series_count" integer;
