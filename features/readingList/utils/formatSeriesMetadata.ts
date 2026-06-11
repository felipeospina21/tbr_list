import type { Book } from "../types/readingList";

export function formatSeriesMetadata(book: Book) {
	const seriesName = book.seriesName?.trim();
	const seriesPosition = book.seriesPosition?.trim();

	if (seriesName && seriesPosition) {
		return `${seriesName} (${seriesPosition})`;
	}

	if (seriesName) {
		return seriesName;
	}

	if (seriesPosition) {
		return `Series #${seriesPosition}`;
	}

	return null;
}
