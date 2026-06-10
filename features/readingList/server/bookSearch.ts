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
		series_key?: string[];
		series_name?: string[];
		series_position?: string[];
		subject?: string[];
	}>;
};

type HardcoverSearchResponse = {
	data?: {
		search?: {
			results?: {
				hits?: Array<{
					document?: HardcoverBookDocument;
					highlight?: HardcoverSearchHighlight;
					highlights?: HardcoverSearchHighlightMatch[];
				}>;
			};
		};
	};
	errors?: Array<{
		message?: string;
	}>;
};

type HardcoverEditionResponse = {
	data?: {
		editions?: HardcoverEdition[];
	};
	errors?: Array<{
		message?: string;
	}>;
};

type HardcoverBookDocument = {
	id?: string | number;
	title?: string;
	subtitle?: string;
	author_names?: string[];
	description?: string;
	pages?: number;
	release_year?: number;
	release_date?: string;
	rating?: number;
	ratings_count?: number;
	image?: {
		url?: string;
	};
	isbns?: string[];
	moods?: string[];
	genres?: string[];
	tags?: string[];
	series_names?: string[];
	featured_series_position?: number;
	featured_series?: {
		position?: number;
		details?: string;
		series?: {
			name?: string;
		};
	};
};

type HardcoverSearchHighlight = {
	alternative_titles?: Array<{
		matched_tokens?: string[];
		snippet?: string;
	}>;
};

type HardcoverSearchHighlightMatch = {
	field?: string;
	snippets?: string[];
};

type HardcoverEdition = {
	id?: string | number;
	title?: string;
	subtitle?: string | null;
	isbn_10?: string | null;
	isbn_13?: string | null;
	pages?: number | null;
	release_date?: string | null;
	release_year?: number | null;
	language?: {
		language?: string | null;
	} | null;
	publisher?: {
		name?: string | null;
	} | null;
	image?: {
		url?: string | null;
	} | null;
};

type OpenLibraryDoc = NonNullable<OpenLibraryResponse["docs"]>[number];

const SEARCH_LIMIT = 8;
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const HARDCOVER_API_KEY =
	process.env.HARDCOVER_API_KEY ?? process.env.HADCOVER_API_KEY;

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
				hardcoverApiKeyConfigured: Boolean(HARDCOVER_API_KEY),
				hardcoverStatus: null,
				hardcoverError: null,
				hardcoverResultCount: 0,
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

	let hardcoverDebug = {
		status: null as number | null,
		error: null as string | null,
		resultCount: 0,
	};

	let openLibraryDebug = {
		status: null as number | null,
		resultCount: 0,
	};

	let googleDebug = {
		status: null as number | null,
		error: null as string | null,
		totalItems: null as number | null,
		resultCount: 0,
	};

	if (HARDCOVER_API_KEY) {
		try {
			const hardcoverBooks = await searchHardcover(normalizedQuery);
			hardcoverDebug = {
				status: hardcoverBooks.status,
				error: hardcoverBooks.error,
				resultCount: hardcoverBooks.results.length,
			};

			if (hardcoverBooks.results.length > 0) {
				return {
					results: hardcoverBooks.results,
					debug: buildSearchDebug({
						hardcoverDebug,
						openLibraryDebug,
						googleDebug,
						fallbackUsed: false,
						provider: "hardcover",
					}),
				};
			}
		} catch (caughtError) {
			hardcoverDebug.error = toErrorMessage(caughtError, "Hardcover failed");
		}
	}

	try {
		const openLibraryBooks = await searchOpenLibrary(normalizedQuery);
		openLibraryDebug = {
			status: openLibraryBooks.status,
			resultCount: openLibraryBooks.results.length,
		};

		if (openLibraryBooks.results.length > 0) {
			return {
				results: openLibraryBooks.results,
				debug: buildSearchDebug({
					hardcoverDebug,
					openLibraryDebug,
					googleDebug,
					fallbackUsed: Boolean(HARDCOVER_API_KEY),
					provider: "open-library",
				}),
			};
		}
	} catch {
		openLibraryDebug = {
			status: null,
			resultCount: 0,
		};
	}

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
				debug: buildSearchDebug({
					hardcoverDebug,
					openLibraryDebug,
					googleDebug,
					fallbackUsed: true,
					provider: "google-books",
				}),
			};
		}
	} catch (caughtError) {
		googleDebug.error = toErrorMessage(caughtError, "Google Books failed");
	}

	return {
		results: [],
		debug: buildSearchDebug({
			hardcoverDebug,
			openLibraryDebug,
			googleDebug,
			fallbackUsed: Boolean(HARDCOVER_API_KEY),
			provider: "none",
		}),
	};
}

async function searchHardcover(query: string): Promise<{
	results: SearchBook[];
	status: number;
	error: string | null;
}> {
	const response = await fetch("https://api.hardcover.app/v1/graphql", {
		method: "POST",
		headers: {
			Accept: "application/json",
			Authorization: normalizeHardcoverAuthorization(HARDCOVER_API_KEY),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
				query SearchBooks($query: String!, $perPage: Int!) {
					search(
						query: $query,
						query_type: "Book",
						per_page: $perPage,
						page: 1
					) {
						results
					}
				}
			`,
			variables: {
				query,
				perPage: SEARCH_LIMIT,
			},
		}),
	});

	if (!response.ok) {
		return {
			results: [],
			status: response.status,
			error: `Hardcover returned HTTP ${response.status}`,
		};
	}

	const data = (await response.json()) as HardcoverSearchResponse;
	const graphqlError = data.errors?.[0]?.message ?? null;

	if (graphqlError) {
		return {
			results: [],
			status: response.status,
			error: graphqlError,
		};
	}

	const hits = data.data?.search?.results?.hits ?? [];
	const results = await Promise.all(
		hits
			.filter((hit): hit is typeof hit & { document: HardcoverBookDocument } =>
				Boolean(hit.document),
			)
			.map(async (hit) =>
				mapHardcoverBook(hit.document, await findMatchingHardcoverEdition(hit)),
			),
	);

	return {
		results,
		status: response.status,
		error: null,
	};
}

async function findMatchingHardcoverEdition(hit: {
	document: HardcoverBookDocument;
	highlight?: HardcoverSearchHighlight;
	highlights?: HardcoverSearchHighlightMatch[];
}) {
	const matchedTitle = resolveMatchedAlternativeTitle(hit);
	const bookId = toHardcoverIntegerId(hit.document.id);

	if (!matchedTitle || bookId === null) {
		return null;
	}

	return fetchHardcoverEditionByTitle(bookId, matchedTitle);
}

function mapHardcoverBook(
	document: HardcoverBookDocument,
	edition: HardcoverEdition | null,
): SearchBook {
	const title = edition?.title?.trim() || document.title?.trim() || "Untitled";
	const subtitle =
		edition?.subtitle?.trim() ?? document.subtitle?.trim() ?? null;
	const author = document.author_names?.[0]?.trim() || "Unknown author";
	const description =
		document.description?.trim() || "No description available.";
	const pages =
		typeof edition?.pages === "number"
			? edition.pages
			: typeof document.pages === "number"
				? document.pages
				: null;
	const publishedYear =
		typeof edition?.release_year === "number"
			? edition.release_year
			: typeof document.release_year === "number"
				? document.release_year
				: null;
	const publishedDate =
		edition?.release_date?.trim() ?? document.release_date?.trim() ?? null;
	const language = edition?.language?.language?.trim() ?? null;
	const publisher = edition?.publisher?.name?.trim() ?? null;
	const averageRating =
		typeof document.rating === "number" && document.rating > 0
			? document.rating
			: null;
	const ratingsCount =
		typeof document.ratings_count === "number" && document.ratings_count > 0
			? document.ratings_count
			: null;
	const art = buildBookArt(title);
	const cover =
		edition?.image?.url?.trim() || document.image?.url?.trim() || art.cover;
	const isbn13 =
		edition?.isbn_13?.trim() ??
		document.isbns?.find((identifier) => {
			const normalizedIdentifier = normalizeIsbn(identifier);
			return normalizedIdentifier.length === 13;
		}) ??
		null;
	const isbn10 =
		edition?.isbn_10?.trim() ??
		document.isbns?.find((identifier) => {
			const normalizedIdentifier = normalizeIsbn(identifier);
			return normalizedIdentifier.length === 10;
		}) ??
		null;
	const sourceBookId = String(document.id ?? title);
	const seriesName =
		document.featured_series?.series?.name?.trim() ??
		document.series_names?.[0]?.trim() ??
		null;
	const seriesPosition =
		formatSeriesPosition(document.featured_series_position) ??
		formatSeriesPosition(document.featured_series?.position) ??
		document.featured_series?.details?.trim() ??
		null;
	const moods = normalizeSubjects(document.moods);
	const subjects = normalizeSubjects([
		...(document.moods ?? []),
		...(document.genres ?? []),
		...(document.tags ?? []),
	]);

	return {
		id: buildBookIdentityKey({
			source: "hardcover",
			sourceBookId,
			isbn10,
			isbn13,
		}),
		source: "hardcover" as const,
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
		seriesName,
		seriesPosition,
		moods,
		subjects,
		provider: "Hardcover" as const,
	};
}

async function fetchHardcoverEditionByTitle(bookId: number, title: string) {
	const response = await fetch("https://api.hardcover.app/v1/graphql", {
		method: "POST",
		headers: {
			Accept: "application/json",
			Authorization: normalizeHardcoverAuthorization(HARDCOVER_API_KEY),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
				query MatchingEdition($bookId: Int!, $title: String!) {
					editions(
						where: {
							book_id: { _eq: $bookId },
							title: { _eq: $title }
						},
						limit: 1,
						order_by: { users_count: desc }
					) {
						id
						title
						subtitle
						isbn_10
						isbn_13
						pages
						release_date
						release_year
						language {
							language
						}
						publisher {
							name
						}
						image {
							url
						}
					}
				}
			`,
			variables: {
				bookId,
				title,
			},
		}),
	});

	if (!response.ok) {
		return null;
	}

	const data = (await response.json()) as HardcoverEditionResponse;

	if (data.errors?.length) {
		return null;
	}

	return data.data?.editions?.[0] ?? null;
}

function resolveMatchedAlternativeTitle(hit: {
	highlight?: HardcoverSearchHighlight;
	highlights?: HardcoverSearchHighlightMatch[];
}) {
	const highlightedSnippet = hit.highlights?.find(
		(highlight) => highlight.field === "alternative_titles",
	)?.snippets?.[0];

	if (highlightedSnippet) {
		return stripHighlightMarkup(highlightedSnippet);
	}

	const highlightedAlternative = hit.highlight?.alternative_titles?.find(
		(alternativeTitle) => (alternativeTitle.matched_tokens?.length ?? 0) > 0,
	);

	return highlightedAlternative?.snippet
		? stripHighlightMarkup(highlightedAlternative.snippet)
		: null;
}

function stripHighlightMarkup(value: string) {
	return value.replace(/<\/?mark>/g, "").trim() || null;
}

function toHardcoverIntegerId(value: string | number | undefined) {
	if (typeof value === "number") {
		return Number.isInteger(value) ? value : null;
	}

	if (!value) {
		return null;
	}

	const parsedValue = Number(value);

	return Number.isInteger(parsedValue) ? parsedValue : null;
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
			moods: [],
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
		`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${SEARCH_LIMIT}&fields=key,title,subtitle,author_name,description,first_sentence,first_publish_year,number_of_pages_median,cover_i,isbn,language,publisher,series_key,series_name,series_position,subject`,
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
		const seriesName = doc.series_name?.[0]?.trim() ?? null;
		const seriesPosition = doc.series_position?.[0]?.trim() ?? null;

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
			seriesName,
			seriesPosition,
			moods: [],
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

function normalizeIsbn(isbn: string) {
	return isbn.replace(/[-\s]/g, "").trim();
}

function normalizeHardcoverAuthorization(apiKey: string | undefined) {
	const normalizedApiKey = apiKey?.trim();

	if (!normalizedApiKey) {
		return "";
	}

	return normalizedApiKey.toLowerCase().startsWith("bearer ")
		? normalizedApiKey
		: `Bearer ${normalizedApiKey}`;
}

function formatSeriesPosition(position: number | undefined) {
	return typeof position === "number" ? String(position) : null;
}

function toErrorMessage(error: unknown, fallback: string) {
	return error instanceof Error && error.message ? error.message : fallback;
}

function buildSearchDebug({
	hardcoverDebug,
	openLibraryDebug,
	googleDebug,
	fallbackUsed,
	provider,
}: {
	hardcoverDebug: {
		status: number | null;
		error: string | null;
		resultCount: number;
	};
	openLibraryDebug: {
		status: number | null;
		resultCount: number;
	};
	googleDebug: {
		status: number | null;
		error: string | null;
		totalItems: number | null;
		resultCount: number;
	};
	fallbackUsed: boolean;
	provider: SearchProvider;
}): SearchDebugInfo {
	return {
		hardcoverApiKeyConfigured: Boolean(HARDCOVER_API_KEY),
		hardcoverStatus: hardcoverDebug.status,
		hardcoverError: hardcoverDebug.error,
		hardcoverResultCount: hardcoverDebug.resultCount,
		googleApiKeyConfigured: Boolean(GOOGLE_BOOKS_API_KEY),
		googleStatus: googleDebug.status,
		googleError: googleDebug.error,
		googleTotalItems: googleDebug.totalItems,
		googleResultCount: googleDebug.resultCount,
		openLibraryStatus: openLibraryDebug.status,
		openLibraryResultCount: openLibraryDebug.resultCount,
		fallbackUsed,
		provider,
	};
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
