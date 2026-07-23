import { apiFetch } from "@/lib/api/apiFetch";
import { normalizeHardcoverAuthorization } from "@/lib/hardcover";
import { HARDCOVER_API_KEY } from "../constants";
import { HardcoverEdition } from "../types/hardcover.types";

type HardcoverEditionResponse = {
	editions?: HardcoverEdition[];
};

export async function fetchHardcoverEditionByTitle(
	title: string,
	bookId: number | undefined,
) {
	const response = await apiFetch<HardcoverEditionResponse>(
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
				query MatchingEdition($title: String!, $bookId:Int!) {
					editions(
						where: {
							title: { _eq: $title }
							book_id: { _eq: $bookId }
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
					bookId,
				},
			}),
		},
	);

	return response.editions?.[0] ?? null;
}
