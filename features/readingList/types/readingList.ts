export type BookSource = "google-books" | "open-library";

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
	books: Book[];
	pages: number;
};

export function totalPages(books: readonly Book[]) {
	return books.reduce(
		(sum, book) => sum + (typeof book.pages === "number" ? book.pages : 0),
		0,
	);
}
