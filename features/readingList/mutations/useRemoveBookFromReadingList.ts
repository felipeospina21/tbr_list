"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getReadingListQueryKey } from "../queries/readingListQueryKeys";
import type {
	ReadingListSlug,
	ReadingListSnapshot,
} from "../types/readingList";
import { totalPages } from "../types/readingList";

interface RemoveBookInput {
	bookId: string;
}

interface RemoveBookContext {
	previousSnapshot?: ReadingListSnapshot;
}

function removeBookFromSnapshot(
	snapshot: ReadingListSnapshot | undefined,
	bookId: string,
) {
	if (!snapshot) {
		return snapshot;
	}

	const books = snapshot.books.filter((book) => book.id !== bookId);

	return {
		...snapshot,
		books,
		pages: totalPages(books),
	};
}

export async function removeReadingListBook(
	listSlug: ReadingListSlug,
	bookId: string,
): Promise<ReadingListSnapshot> {
	const response = await fetch(`/api/reading-list?listSlug=${listSlug}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ bookId }),
	});

	if (!response.ok) {
		throw new Error("Reading list request failed");
	}

	return (await response.json()) as ReadingListSnapshot;
}

export function useRemoveBookFromReadingList(listSlug: ReadingListSlug) {
	const queryClient = useQueryClient();
	const queryKey = getReadingListQueryKey(listSlug);

	return useMutation<
		ReadingListSnapshot,
		Error,
		RemoveBookInput,
		RemoveBookContext
	>({
		mutationFn: ({ bookId }) => removeReadingListBook(listSlug, bookId),
		onMutate: async ({ bookId }) => {
			await queryClient.cancelQueries({ queryKey });

			const previousSnapshot =
				queryClient.getQueryData<ReadingListSnapshot>(queryKey);

			queryClient.setQueryData<ReadingListSnapshot | undefined>(
				queryKey,
				(snapshot) => removeBookFromSnapshot(snapshot, bookId),
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
