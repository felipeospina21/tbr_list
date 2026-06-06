"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { READING_LIST_QUERY_KEY } from "../queries/useFetchReadingList";
import { readJson } from "../server/bookSearch";
import { Book, ReadingListSnapshot } from "../types/readingList";

export async function addReadingListBook(
	book: Book,
): Promise<ReadingListSnapshot> {
	const response = await fetch("/api/reading-list", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ book }),
	});

	return readJson<ReadingListSnapshot>(response);
}

export function useAddBookToReadingList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addReadingListBook,
		onSuccess: (snapshot) => {
			queryClient.setQueryData(READING_LIST_QUERY_KEY, snapshot);
		},
	});
}
