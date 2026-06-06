export type SearchBook = {
	id: string;
	title: string;
	author: string;
	pages: number | null;
	description: string;
	cover: string;
	accent: string;
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
