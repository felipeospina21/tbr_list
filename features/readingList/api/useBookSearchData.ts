"use client";

import { SearchBook } from "@/f";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const MIN_QUERY_LENGTH = 2;
const SEARCH_QUERY_KEY = "book-search";

export type BookSearchQueryData = {
	results: SearchBook[];
};

export function useBookSearchData(searchTerm: string, isSearching: boolean) {
	return useQuery({
		queryKey: [SEARCH_QUERY_KEY, searchTerm] as const,
		enabled: isSearching && searchTerm.length >= MIN_QUERY_LENGTH,
		placeholderData: keepPreviousData,
		retry: false,
		queryFn: async ({ signal, queryKey }) => {
			const [, query] = queryKey;
			const response = await fetch(
				`/api/book-search?q=${encodeURIComponent(query)}`,
				{
					signal,
				},
			);

			if (!response.ok) {
				throw new Error("Search request failed");
			}

			return (await response.json()) as {
				results?: [];
			};
		},
		select: (data): BookSearchQueryData => ({
			results: data.results ?? [],
		}),
	});
}
