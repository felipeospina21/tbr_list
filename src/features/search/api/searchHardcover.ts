import { apiFetch } from "@/lib/api/apiFetch";
import { HARDCOVER_API_KEY, SEARCH_LIMIT } from "../constants";
import {
	findMatchingHardcoverEdition,
	mapHardcoverBook,
	normalizeHardcoverAuthorization,
} from "@/lib/hardcover";
import {
	HardcoverBookDocument,
	HardcoverSearchHighlight,
	HardcoverSearchHighlightMatch,
} from "../types/hardcover.types";
import { SearchBook } from "../types/search.types";

type HardcoverSearchResponse = {
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

export async function searchHardcover(query: string): Promise<{
	results: SearchBook[] | undefined;
}> {
	const response = await apiFetch<HardcoverSearchResponse>(
		"https://api.hardcover.app/v1/graphql",
		{
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
		},
	);
	const hits = response.search?.results?.hits ?? [];
	const unresolvedPromises = hits
		.filter(
			(hit): hit is typeof hit & { document: HardcoverBookDocument } =>
				!!hit.document?.author_names && hit.document.author_names.length > 0,
		)
		.map(async (hit) => {
			const edition = await findMatchingHardcoverEdition(hit);
			if (!edition) return null; // Return null if it doesn't exist

			return mapHardcoverBook(hit.document, edition);
		});

	const resolvedResults = await Promise.all(unresolvedPromises);

	return {
		results: resolvedResults.filter(
			(book): book is SearchBook => book !== null,
		),
	};
}
