import type { SchemaBook } from "../types/readingList";

function normalizeIsbn(isbn: string) {
	return isbn.replace(/[-\s]/g, "").trim();
}

function buildSourceIdentifier(
	source: SchemaBook["source"],
	sourceBookId: string,
) {
	return `source:${source}:${sourceBookId}`;
}

function buildIsbnIdentifier(version: "10" | "13", isbn: string) {
	return `isbn:${version}:${normalizeIsbn(isbn)}`;
}

export function buildBookIdentityKey(
	book: Pick<SchemaBook, "source" | "sourceBookId" | "isbn10" | "isbn13">,
) {
	if (book.isbn13) {
		return buildIsbnIdentifier("13", book.isbn13);
	}

	if (book.isbn10) {
		return buildIsbnIdentifier("10", book.isbn10);
	}

	return buildSourceIdentifier(book.source, book.sourceBookId);
}

export function getBookIdentifierKeys(
	book: Pick<SchemaBook, "source" | "sourceBookId" | "isbn10" | "isbn13">,
) {
	const keys = new Set<string>();

	keys.add(buildBookIdentityKey(book));
	keys.add(buildSourceIdentifier(book.source, book.sourceBookId));

	if (book.isbn13) {
		keys.add(buildIsbnIdentifier("13", book.isbn13));
	}

	if (book.isbn10) {
		keys.add(buildIsbnIdentifier("10", book.isbn10));
	}

	return [...keys];
}
