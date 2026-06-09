import type { BookSource } from "./readingList";

export type SearchBook = {
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
	provider: "Google Books" | "Open Library";
};

export type SearchProvider = "google-books" | "open-library" | "none";

export type SearchDebugInfo = {
	googleApiKeyConfigured: boolean;
	googleStatus: number | null;
	googleError: string | null;
	googleTotalItems: number | null;
	googleResultCount: number;
	openLibraryStatus: number | null;
	openLibraryResultCount: number;
	fallbackUsed: boolean;
	provider: SearchProvider;
};

export type SearchOutcome = {
	results: SearchBook[];
	debug: SearchDebugInfo;
};
