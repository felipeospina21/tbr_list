export type Book = {
	id: string;
	title: string;
	author: string;
	pages: number | null;
	description: string;
	cover: string;
	accent: string;
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
