"use client";

import { type QueryKey, useQuery } from "@tanstack/react-query";
import type {
	Book,
	ReadingListSlug,
	ReadingListSnapshot,
} from "../types/readingList";

export const READING_LIST_QUERY_KEY: QueryKey = ["reading-list"];

export const EMPTY_READING_LIST = {
	books: [],
	pages: 0,
} satisfies {
	books: Book[];
	pages: number;
};

export function getReadingListQueryKey(listSlug: ReadingListSlug) {
	return [...READING_LIST_QUERY_KEY, listSlug] as const;
}

export async function fetchReadingList(
	listSlug: ReadingListSlug,
): Promise<ReadingListSnapshot> {
	const response = await fetch(`/api/reading-list?listSlug=${listSlug}`);

	if (!response.ok) {
		throw new Error("Reading list request failed");
	}

	return (await response.json()) as ReadingListSnapshot;
}

export function useFetchReadingList(listSlug: ReadingListSlug) {
	return useQuery({
		queryKey: getReadingListQueryKey(listSlug),
		queryFn: () => fetchReadingList(listSlug),
		refetchOnWindowFocus: false,
		throwOnError: true,
	});
}
