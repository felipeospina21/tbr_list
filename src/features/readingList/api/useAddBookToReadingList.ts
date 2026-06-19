"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
	SchemaBook,
	ReadingListSlug,
	ReadingListSnapshot,
} from "../types/readingList";
import { getReadingListQueryKey } from "./readingListQueryKeys";

export async function addReadingListBook(
	listSlug: ReadingListSlug,
	book: SchemaBook,
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
	const queryKey = getReadingListQueryKey(listSlug);

	return useMutation({
		mutationFn: (book: SchemaBook) => addReadingListBook(listSlug, book),
		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey });

			const previousSnapshot =
				queryClient.getQueryData<ReadingListSnapshot>(queryKey);

			queryClient.setQueryData<ReadingListSnapshot | undefined>(
				queryKey,
				(snapshot) => {
					if (!snapshot) {
						return undefined;
					}

					return { ...snapshot, books: [...snapshot.books, input] };
				},
			);

			return { previousSnapshot };
		},
		onError: (_error, _input, context) => {
			if (context?.previousSnapshot) {
				queryClient.setQueryData(queryKey, context.previousSnapshot);
			}
		},
		onSuccess: (snapshot) => {
			queryClient.setQueryData(queryKey, snapshot);
		},
	});
}
