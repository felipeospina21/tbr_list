"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getReadingListQueryKey } from "../queries/useFetchReadingList";
import type {
	Book,
	ReadingListSlug,
	ReadingListSnapshot,
} from "../types/readingList";

export async function addReadingListBook(
	listSlug: ReadingListSlug,
	book: Book,
): Promise<ReadingListSnapshot> {
	const response = await fetch(`/api/reading-list?listSlug=${listSlug}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ book }),
	});

	if (!response.ok) {
		throw new Error("Reading list request failed");
	}

	return (await response.json()) as ReadingListSnapshot;
}

export function useAddBookToReadingList(listSlug: ReadingListSlug) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (book: Book) => addReadingListBook(listSlug, book),
		onSuccess: (snapshot) => {
			queryClient.setQueryData(getReadingListQueryKey(listSlug), snapshot);
		},
	});
}
