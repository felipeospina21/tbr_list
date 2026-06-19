import { buildBookArt } from "./features/readingList/server/bookArt";

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
export type SearchBook = Book & {
	bookId: number;
	moods: string[];
	provider: "Google Books" | "Hardcover" | "Open Library";
};

const HARDCOVER_API_KEY =
	process.env.HARDCOVER_API_KEY ?? process.env.HADCOVER_API_KEY;

function normalizeHardcoverAuthorization(apiKey: string | undefined) {
	const normalizedApiKey = apiKey?.trim();

	if (!normalizedApiKey) {
		return "";
	}

	return normalizedApiKey.toLowerCase().startsWith("bearer ")
		? normalizedApiKey
		: `Bearer ${normalizedApiKey}`;
}

const SEARCH_LIMIT = 5;

type HardcoverSearchResponse = {
	data?: {
		search?: {
			results?: {
				hits?: Array<{
					document?: HardcoverBookDocument;
					highlight?: HardcoverSearchHighlight;
					highlights: HardcoverSearchHighlightMatch[];
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
	matched_tokens: string[];
};

type HardcoverEdition = {
	id?: string | number;
	book_id: number;
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
export async function searchHardcover(query: string): Promise<{
	results: SearchBook[] | undefined;
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
	let results;
	try {
		const unresolvedPromises = hits
			.filter((hit): hit is typeof hit & { document: HardcoverBookDocument } =>
				Boolean(hit.document),
			)
			.map(async (hit) => {
				const edition = await findMatchingHardcoverEdition(hit);
				if (!edition) return null; // Return null if it doesn't exist

				return mapHardcoverBook(hit.document, edition);
			});

		const resolvedResults = await Promise.all(unresolvedPromises);
		results = resolvedResults.filter(
			(book): book is SearchBook => book !== null,
		);
	} catch (e) {
		console.error(e);
	}

	return {
		results,
		status: response.status,
		error: null,
	};
}
function mapHardcoverBook(
	document: HardcoverBookDocument,
	edition: HardcoverEdition,
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
	const genres = normalizeSubjects(document.genres);
	const bookId = edition?.book_id;

	return {
		id: buildBookIdentityKey({
			source: "hardcover",
			sourceBookId,
			isbn10,
			isbn13,
		}),
		source: "hardcover" as const,
		sourceBookId,
		bookId,
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
		genres,
		provider: "Hardcover" as const,
	};
}

async function findMatchingHardcoverEdition(hit: {
	document: HardcoverBookDocument;
	highlight?: HardcoverSearchHighlight;
	highlights: HardcoverSearchHighlightMatch[];
}) {
	const matchedTitle = resolveMatchedAlternativeTitle(hit);

	if (!matchedTitle) {
		return null;
	}

	return fetchHardcoverEditionByTitle(matchedTitle);
}

async function fetchHardcoverEditionByTitle(title: string) {
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
							title: { _eq: $title }
						},
						limit: 1,
						order_by: { users_count: desc }
					) {
						id
						book_id
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

function normalizeIsbn(isbn: string) {
	return isbn.replace(/[-\s]/g, "").trim();
}

function resolveMatchedAlternativeTitle(hit: {
	highlight?: HardcoverSearchHighlight;
	highlights: HardcoverSearchHighlightMatch[];
}) {
	return hit.highlights[0].matched_tokens[0];
}

function formatSeriesPosition(position: number | undefined) {
	return typeof position === "number" ? String(position) : null;
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

function normalizeSubjects(subjects: readonly string[] | undefined) {
	return [
		...new Set(
			(subjects ?? []).map((subject) => subject.trim()).filter(Boolean),
		),
	];
}

function buildIsbnIdentifier(version: "10" | "13", isbn: string) {
	return `isbn:${version}:${normalizeIsbn(isbn)}`;
}

function buildSourceIdentifier(source: Book["source"], sourceBookId: string) {
	return `source:${source}:${sourceBookId}`;
}
