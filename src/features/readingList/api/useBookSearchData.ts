"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SearchBook } from "@/features/search/types/search.types";
import { apiFetch } from "@/lib/api/apiFetch";
import { SafeQueryOptions } from "@/types";

const SEARCH_QUERY_KEY = "book-search";

export type BookSearchQueryData = {
	results: SearchBook[];
};

export async function searchBooks(query: string) {
	return apiFetch<BookSearchQueryData>(
		`/api/book-search?q=${encodeURIComponent(query)}`,
	);
}

export function useBookSearchData(
	searchTerm: string,
	options: SafeQueryOptions<BookSearchQueryData>,
) {
	return useQuery({
		queryKey: [SEARCH_QUERY_KEY, searchTerm] as const,
		placeholderData: keepPreviousData,
		retry: false,
		queryFn: async () => {
			return searchBooks(searchTerm);
		},
		select: (data) => ({
			results: data.results ?? [],
		}),
		...options,
	});
}
