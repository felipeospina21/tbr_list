"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { SearchBook, SearchDebugInfo } from "../types/search";

const MIN_QUERY_LENGTH = 2;
const SEARCH_QUERY_KEY = "book-search";

export type BookSearchQueryData = {
	results: SearchBook[];
	debug: SearchDebugInfo | null;
};

export function useBookSearchData(searchTerm: string) {
	return useQuery({
		queryKey: [SEARCH_QUERY_KEY, searchTerm] as const,
		enabled: searchTerm.length >= MIN_QUERY_LENGTH,
		placeholderData: keepPreviousData,
		retry: false,
		queryFn: async ({ signal, queryKey }) => {
			const [, query] = queryKey;
			const response = await fetch(
				`/api/bookSearch?q=${encodeURIComponent(query)}`,
				{
					signal,
				},
			);

			if (!response.ok) {
				throw new Error("Search request failed");
			}

			return (await response.json()) as {
				results?: SearchBook[];
				debug?: SearchDebugInfo;
			};
		},
		select: (data): BookSearchQueryData => ({
			results: data.results ?? [],
			debug: data.debug ?? null,
		}),
	});
}
