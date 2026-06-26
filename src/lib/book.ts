export type BookSource = "google-books" | "hardcover" | "open-library";

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
	genres: string[];
};

export function normalizeIsbn(isbn: string) {
	return isbn.replace(/[-\s]/g, "").trim();
}

export function buildIsbnIdentifier(version: "10" | "13", isbn: string) {
	return `isbn:${version}:${normalizeIsbn(isbn)}`;
}

export function buildBookIdentityKey(
	book: Pick<Book, "source" | "sourceBookId" | "isbn10" | "isbn13">,
) {
	if (book.isbn13) {
		return buildIsbnIdentifier("13", book.isbn13);
	}

	if (book.isbn10) {
		return buildIsbnIdentifier("10", book.isbn10);
	}

	return buildSourceIdentifier(book.source, book.sourceBookId);
}

export function buildSourceIdentifier(
	source: Book["source"],
	sourceBookId: string,
) {
	return `source:${source}:${sourceBookId}`;
}

export function normalizeSubjects(subjects: readonly string[] | undefined) {
	return [
		...new Set(
			(subjects ?? []).map((subject) => subject.trim()).filter(Boolean),
		),
	];
}

export function formatSeriesPosition(position: number | undefined) {
	return typeof position === "number" ? String(position) : null;
}
