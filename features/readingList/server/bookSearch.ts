import "server-only";

import type { Book } from "../types/readingList";
import type {
	SearchBook,
	SearchDebugInfo,
	SearchOutcome,
	SearchProvider,
} from "../types/search";
import { buildBookArt } from "./bookArt";

type GoogleBooksResponse = {
	items?: Array<{
		id: string;
		volumeInfo?: {
			title?: string;
			authors?: string[];
			description?: string;
			pageCount?: number;
			imageLinks?: {
				thumbnail?: string;
			};
		};
	}>;
};

type OpenLibraryResponse = {
	numFound?: number;
	docs?: Array<{
		key?: string;
		title?: string;
		author_name?: string[];
		description?: string | { value?: string };
		first_sentence?: string[] | string;
		first_publish_year?: number;
		number_of_pages_median?: number;
		cover_i?: number;
	}>;
};

type OpenLibraryDoc = NonNullable<OpenLibraryResponse["docs"]>[number];

const SEARCH_LIMIT = 8;
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

export async function searchBooks(query: string): Promise<SearchBook[]> {
	const outcome = await searchBooksWithDebug(query);

	return outcome.results;
}

export async function searchBooksWithDebug(
	query: string,
): Promise<SearchOutcome> {
	const normalizedQuery = query.trim();

	if (normalizedQuery.length < 2) {
		return {
			results: [],
			debug: {
				googleApiKeyConfigured: Boolean(GOOGLE_BOOKS_API_KEY),
				googleStatus: null,
				googleError: null,
				googleTotalItems: null,
				googleResultCount: 0,
				openLibraryStatus: null,
				openLibraryResultCount: 0,
				fallbackUsed: false,
				provider: "none",
			},
		};
	}

	let googleDebug = {
		status: null as number | null,
		error: null as string | null,
		totalItems: null as number | null,
		resultCount: 0,
	};

	try {
		const googleBooks = await searchGoogleBooks(normalizedQuery);
		googleDebug = {
			status: googleBooks.status,
			error: googleBooks.error,
			totalItems: googleBooks.totalItems,
			resultCount: googleBooks.results.length,
		};

		if (googleBooks.results.length > 0) {
			return {
				results: googleBooks.results,
				debug: {
					googleApiKeyConfigured: Boolean(GOOGLE_BOOKS_API_KEY),
					googleStatus: googleBooks.status,
					googleError: googleBooks.error,
					googleTotalItems: googleBooks.totalItems,
					googleResultCount: googleBooks.results.length,
					openLibraryStatus: null,
					openLibraryResultCount: 0,
					fallbackUsed: false,
					provider: "google-books",
				},
			};
		}
	} catch (caughtError) {
		googleDebug.error =
			caughtError instanceof Error
				? caughtError.message
				: "Google Books failed";
	}

	const openLibraryBooks = await searchOpenLibrary(normalizedQuery);

	return {
		results: openLibraryBooks.results,
		debug: {
			googleApiKeyConfigured: Boolean(GOOGLE_BOOKS_API_KEY),
			googleStatus: googleDebug.status,
			googleError: googleDebug.error,
			googleTotalItems: googleDebug.totalItems,
			googleResultCount: googleDebug.resultCount,
			openLibraryStatus: openLibraryBooks.status,
			openLibraryResultCount: openLibraryBooks.results.length,
			fallbackUsed: true,
			provider: openLibraryBooks.results.length > 0 ? "open-library" : "none",
		},
	};
}

async function searchGoogleBooks(query: string): Promise<{
	results: SearchBook[];
	status: number;
	error: string | null;
	totalItems: number | null;
}> {
	const searchUrl = new URL("https://www.googleapis.com/books/v1/volumes");
	searchUrl.searchParams.set("q", query);
	searchUrl.searchParams.set("maxResults", SEARCH_LIMIT.toString());
	searchUrl.searchParams.set("projection", "full");

	if (GOOGLE_BOOKS_API_KEY) {
		searchUrl.searchParams.set("key", GOOGLE_BOOKS_API_KEY);
	}

	const response = await fetch(searchUrl, {
		headers: {
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		return {
			results: [],
			status: response.status,
			error: `Google Books returned HTTP ${response.status}`,
			totalItems: null,
		};
	}

	const data = (await response.json()) as GoogleBooksResponse & {
		totalItems?: number;
	};
	const totalItems =
		typeof data.totalItems === "number" ? data.totalItems : null;
	const results = (data.items ?? []).map((item) => {
		const volumeInfo = item.volumeInfo ?? {};
		const title = volumeInfo.title?.trim() || "Untitled";
		const author = volumeInfo.authors?.[0] ?? "Unknown author";
		const description =
			volumeInfo.description?.trim() || "No description available.";
		const pages =
			typeof volumeInfo.pageCount === "number" ? volumeInfo.pageCount : null;
		const art = buildBookArt(title);
		const cover =
			volumeInfo.imageLinks?.thumbnail?.replace(/^http:\/\//, "https://") ??
			art.cover;

		return {
			id: `google:${item.id}`,
			title,
			author,
			pages,
			description,
			cover,
			accent: art.accent,
			provider: "Google Books" as const,
		};
	});

	return {
		results,
		status: response.status,
		error: null,
		totalItems,
	};
}

async function searchOpenLibrary(query: string): Promise<{
	results: SearchBook[];
	status: number;
}> {
	const response = await fetch(
		`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${SEARCH_LIMIT}&fields=key,title,author_name,description,first_sentence,first_publish_year,number_of_pages_median,cover_i`,
		{
			headers: {
				Accept: "application/json",
			},
		},
	);

	if (!response.ok) {
		throw new Error("Open Library search failed");
	}

	const data = (await response.json()) as OpenLibraryResponse;

	const results = (data.docs ?? []).map((doc) => {
		const title = doc.title?.trim() || "Untitled";
		const author = doc.author_name?.[0] ?? "Unknown author";
		const description = resolveOpenLibraryDescription(doc);
		const pages =
			typeof doc.number_of_pages_median === "number"
				? doc.number_of_pages_median
				: null;
		const art = buildBookArt(title);
		const cover =
			typeof doc.cover_i === "number"
				? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
				: art.cover;

		return {
			id: `openLibrary:${doc.key ?? title}`,
			title,
			author,
			pages,
			description,
			cover,
			accent: art.accent,
			provider: "Open Library" as const,
		};
	});

	return {
		results,
		status: response.status,
	};
}

function resolveOpenLibraryDescription(doc: OpenLibraryDoc) {
	if (typeof doc.description === "string" && doc.description.trim()) {
		return doc.description.trim();
	}

	if (
		doc.description &&
		typeof doc.description === "object" &&
		typeof doc.description.value === "string" &&
		doc.description.value.trim()
	) {
		return doc.description.value.trim();
	}

	if (Array.isArray(doc.first_sentence) && doc.first_sentence[0]) {
		return doc.first_sentence[0];
	}

	if (typeof doc.first_sentence === "string" && doc.first_sentence.trim()) {
		return doc.first_sentence.trim();
	}

	if (typeof doc.first_publish_year === "number") {
		return `First published in ${doc.first_publish_year}.`;
	}

	return "Open Library result.";
}

export async function readJson<T>(response: Response): Promise<T> {
	if (!response.ok) {
		throw new Error("Reading list request failed");
	}

	return (await response.json()) as T;
}
