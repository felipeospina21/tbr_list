import { books, readingLists } from "@/db/schema";

export type BookSource = "google-books" | "hardcover" | "open-library";

export const READING_LIST_DEFINITIONS = [
	{
		slug: "to_be_read",
		name: "To Be Read",
		isDefault: true,
	},
	{
		slug: "finished",
		name: "Finished",
		isDefault: false,
	},
	{
		slug: "did_not_finish",
		name: "Did Not Finish",
		isDefault: false,
	},
] as const;

export type ReadingListSlug = (typeof READING_LIST_DEFINITIONS)[number]["slug"];

export const DEFAULT_READING_LIST_SLUG: ReadingListSlug = "to_be_read";

export type ReadingListSummary = {
	slug: ReadingListSlug;
	name: string;
	isDefault: boolean;
	booksCount: number;
};

export type SchemaBook = typeof books.$inferSelect;

export function totalPages(books: readonly SchemaBook[]) {
	return books.reduce(
		(sum, book) => sum + (typeof book.pages === "number" ? book.pages : 0),
		0,
	);
}

export type ReadingListType = typeof readingLists.$inferSelect.type;
