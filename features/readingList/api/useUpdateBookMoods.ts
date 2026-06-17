"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
	ReadingListSlug,
	ReadingListSnapshot,
} from "../types/readingList";
import { getReadingListQueryKey } from "./readingListQueryKeys";

export interface UpdateBookMoodsInput {
	bookId: string;
	moods: string[];
}

export async function updateReadingListBookMoods(
	listSlug: ReadingListSlug,
	input: UpdateBookMoodsInput,
): Promise<ReadingListSnapshot> {
	const response = await fetch(`/api/reading-list?listSlug=${listSlug}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(input),
	});

	if (!response.ok) {
		throw new Error("Reading list request failed");
	}

	return (await response.json()) as ReadingListSnapshot;
}

export function useUpdateBookMoods(listSlug: ReadingListSlug) {
	const queryClient = useQueryClient();
	const queryKey = getReadingListQueryKey(listSlug);

	return useMutation({
		mutationFn: (input: UpdateBookMoodsInput) =>
			updateReadingListBookMoods(listSlug, input),
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

					return {
						...snapshot,
						books: snapshot.books.map((book) =>
							book.id === input.bookId ? { ...book, moods: input.moods } : book,
						),
					};
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
