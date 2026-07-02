import { buildBookArt } from "@/features/readingList/server/bookArt";
import { fetchHardcoverEditionByTitle } from "@/features/search/api/fetchHardcoverEdition";
import {
	HardcoverBookDocument,
	HardcoverEdition,
	HardcoverSearchHighlight,
	HardcoverSearchHighlightMatch,
} from "@/features/search/types/hardcover.types";
import { SearchBook } from "@/features/search/types/search.types";
import {
	buildBookIdentityKey,
	formatSeriesPosition,
	normalizeIsbn,
	normalizeSubjects,
} from "./book";

export function normalizeHardcoverAuthorization(apiKey: string | undefined) {
	const normalizedApiKey = apiKey?.trim();

	if (!normalizedApiKey) {
		return "";
	}

	return normalizedApiKey.toLowerCase().startsWith("bearer ")
		? normalizedApiKey
		: `Bearer ${normalizedApiKey}`;
}

export function resolveMatchedAlternativeTitle(hit: {
	highlight?: HardcoverSearchHighlight;
	highlights: HardcoverSearchHighlightMatch[];
}) {
	return hit.highlight?.alternative_titles
		?.find((title) => title.matched_tokens?.length)
		?.matched_tokens?.join(" ");
}

export async function findMatchingHardcoverEdition(hit: {
	document: HardcoverBookDocument;
	highlight?: HardcoverSearchHighlight;
	highlights: HardcoverSearchHighlightMatch[];
}) {
	const matchedTitle = resolveMatchedAlternativeTitle(hit);

	if (!matchedTitle) {
		return null;
	}

	const id = hit.document.id;
	const bookId = typeof id === "string" ? Number(id) : id;

	return fetchHardcoverEditionByTitle(matchedTitle, bookId);
}

export function mapHardcoverBook(
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
	const cover = edition?.image?.url?.trim() || art.cover;
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
