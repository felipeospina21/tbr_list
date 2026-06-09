import "server-only";

import type {
	SearchBook,
	SearchDebugInfo,
	SearchOutcome,
	SearchProvider,
} from "../types/search";
import { buildBookIdentityKey } from "../utils/bookIdentity";
import { buildBookArt } from "./bookArt";

type GoogleBooksResponse = {
	items?: Array<{
		id: string;
		volumeInfo?: {
			title?: string;
			subtitle?: string;
			authors?: string[];
			description?: string;
			pageCount?: number;
			language?: string;
			publishedDate?: string;
			publisher?: string;
			averageRating?: number;
			ratingsCount?: number;
			imageLinks?: {
				thumbnail?: string;
			};
			industryIdentifiers?: Array<{
				type?: string;
				identifier?: string;
			}>;
			categories?: string[];
		};
	}>;
};

type OpenLibraryResponse = {
	numFound?: number;
	docs?: Array<{
		key?: string;
		title?: string;
		subtitle?: string;
		author_name?: string[];
		description?: string | { value?: string };
		first_sentence?: string[] | string;
		first_publish_year?: number;
		number_of_pages_median?: number;
		cover_i?: number;
		isbn?: string[];
		language?: string[];
		publisher?: string[];
		subject?: string[];
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
		const subtitle = volumeInfo.subtitle?.trim() ?? null;
		const author = volumeInfo.authors?.[0] ?? "Unknown author";
		const description =
			volumeInfo.description?.trim() || "No description available.";
		const pages =
			typeof volumeInfo.pageCount === "number" ? volumeInfo.pageCount : null;
		const language = volumeInfo.language?.trim() ?? null;
		const publishedDate = volumeInfo.publishedDate?.trim() ?? null;
		const publishedYear = extractPublishedYear(publishedDate);
		const publisher = volumeInfo.publisher?.trim() ?? null;
		const averageRating =
			typeof volumeInfo.averageRating === "number"
				? volumeInfo.averageRating
				: null;
		const ratingsCount =
			typeof volumeInfo.ratingsCount === "number"
				? volumeInfo.ratingsCount
				: null;
		const art = buildBookArt(title);
		const cover =
			volumeInfo.imageLinks?.thumbnail?.replace(/^http:\/\//, "https://") ??
			art.cover;
		const isbn13 =
			volumeInfo.industryIdentifiers
				?.find(
					(identifier) =>
						identifier.type === "ISBN_13" && identifier.identifier,
				)
				?.identifier?.trim() ?? null;
		const isbn10 =
			volumeInfo.industryIdentifiers
				?.find(
					(identifier) =>
						identifier.type === "ISBN_10" && identifier.identifier,
				)
				?.identifier?.trim() ?? null;
		const sourceBookId = item.id;
		const subjects = normalizeSubjects(volumeInfo.categories);

		return {
			id: buildBookIdentityKey({
				source: "google-books",
				sourceBookId,
				isbn10,
				isbn13,
			}),
			source: "google-books" as const,
			sourceBookId,
			isbn10,
			isbn13,
			title,
			subtitle,
			author,
			pages,
			language,
			publishedYear,
			publishedDate,
			publisher,
			averageRating,
			ratingsCount,
			description,
			cover,
			accent: art.accent,
			seriesName: null,
			seriesPosition: null,
			subjects,
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
		`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${SEARCH_LIMIT}&fields=key,title,subtitle,author_name,description,first_sentence,first_publish_year,number_of_pages_median,cover_i,isbn,language,publisher,subject`,
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
		const subtitle = doc.subtitle?.trim() ?? null;
		const author = doc.author_name?.[0] ?? "Unknown author";
		const description = resolveOpenLibraryDescription(doc);
		const pages =
			typeof doc.number_of_pages_median === "number"
				? doc.number_of_pages_median
				: null;
		const language = doc.language?.[0]?.trim() ?? null;
		const publisher = doc.publisher?.[0]?.trim() ?? null;
		const publishedYear =
			typeof doc.first_publish_year === "number"
				? doc.first_publish_year
				: null;
		const publishedDate =
			typeof doc.first_publish_year === "number"
				? String(doc.first_publish_year)
				: null;
		const averageRating = null;
		const ratingsCount = null;
		const art = buildBookArt(title);
		const cover =
			typeof doc.cover_i === "number"
				? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
				: art.cover;
		const sourceBookId = doc.key ?? title;
		const isbn13 =
			doc.isbn?.find((identifier) => identifier.length === 13) ?? null;
		const isbn10 =
			doc.isbn?.find((identifier) => identifier.length === 10) ?? null;
		const subjects = normalizeSubjects(doc.subject);

		return {
			id: buildBookIdentityKey({
				source: "open-library",
				sourceBookId,
				isbn10,
				isbn13,
			}),
			source: "open-library" as const,
			sourceBookId,
			isbn10,
			isbn13,
			title,
			subtitle,
			author,
			pages,
			language,
			publishedYear,
			publishedDate,
			publisher,
			averageRating,
			ratingsCount,
			description,
			cover,
			accent: art.accent,
			seriesName: null,
			seriesPosition: null,
			subjects,
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

function normalizeSubjects(subjects: readonly string[] | undefined) {
	return [
		...new Set(
			(subjects ?? []).map((subject) => subject.trim()).filter(Boolean),
		),
	];
}

function extractPublishedYear(publishedDate: string | null) {
	if (!publishedDate) {
		return null;
	}

	const yearMatch = publishedDate.match(/^(\d{4})/);

	if (!yearMatch) {
		return null;
	}

	return Number(yearMatch[1]);
}

export async function readJson<T>(response: Response): Promise<T> {
	if (!response.ok) {
		throw new Error("Reading list request failed");
	}

	return (await response.json()) as T;
}
