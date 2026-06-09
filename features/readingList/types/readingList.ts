export type BookSource = "google-books" | "open-library";

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

export type Book = {
	id: string;
	source: BookSource;
	sourceBookId: string;
	isbn10: string | null;
	isbn13: string | null;
	title: string;
	subtitle: string | null;
	author: string;
	pages: number | null;
	language: string | null;
	publishedYear: number | null;
	publishedDate: string | null;
	publisher: string | null;
	averageRating: number | null;
	ratingsCount: number | null;
	description: string;
	cover: string;
	accent: string;
	seriesName: string | null;
	seriesPosition: string | null;
	subjects: string[];
};

export type ReadingListSnapshot = {
	lists: ReadingListSummary[];
	activeListSlug: ReadingListSlug;
	books: Book[];
	pages: number;
};

export function totalPages(books: readonly Book[]) {
	return books.reduce(
		(sum, book) => sum + (typeof book.pages === "number" ? book.pages : 0),
		0,
	);
}
