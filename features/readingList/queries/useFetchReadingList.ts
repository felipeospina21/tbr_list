"use client";

import { QueryKey, useQuery } from "@tanstack/react-query";
import { readJson } from "../server/bookSearch";
import type { Book, ReadingListSnapshot } from "../types/readingList";

export const READING_LIST_QUERY_KEY: QueryKey = ["reading-list"];

export const EMPTY_READING_LIST = {
	books: [],
	pages: 0,
} satisfies {
	books: Book[];
	pages: number;
};

export async function fetchReadingList(): Promise<ReadingListSnapshot> {
	const response = await fetch("/api/reading-list");
	return readJson<ReadingListSnapshot>(response);
}

export function useFetchReadingList() {
	return useQuery({
		queryKey: READING_LIST_QUERY_KEY,
		queryFn: fetchReadingList,
		refetchOnWindowFocus: false,
	});
}
