"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getReadingListQueryKey } from "../queries/readingListQueryKeys";
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
	const queryKey = getReadingListQueryKey(listSlug);

	return useMutation({
		mutationFn: (book: Book) => addReadingListBook(listSlug, book),
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
