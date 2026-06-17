"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
	ReadingListSlug,
	ReadingListSnapshot,
} from "../types/readingList";
import { getReadingListQueryKey } from "./readingListQueryKeys";

type ChangeBookPositionInput = {
	bookId: string;
	targetIndex: number;
};

type ChangeBookPositionContext = {
	previousSnapshot?: ReadingListSnapshot;
};

function reorderSnapshot(
	snapshot: ReadingListSnapshot | undefined,
	{ bookId, targetIndex }: ChangeBookPositionInput,
) {
	if (!snapshot) {
		return snapshot;
	}

	const currentIndex = snapshot.books.findIndex((book) => book.id === bookId);

	if (
		currentIndex < 0 ||
		targetIndex < 0 ||
		targetIndex >= snapshot.books.length
	) {
		return snapshot;
	}

	const books = [...snapshot.books];
	const [book] = books.splice(currentIndex, 1);
	books.splice(targetIndex, 0, book);

	return {
		...snapshot,
		books,
	};
}

export async function moveReadingListBook(
	listSlug: ReadingListSlug,
	bookId: string,
	targetIndex: number,
): Promise<ReadingListSnapshot> {
	const response = await fetch(`/api/reading-list?listSlug=${listSlug}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ bookId, targetIndex }),
	});

	if (!response.ok) {
		throw new Error("Reading list request failed");
	}

	return (await response.json()) as ReadingListSnapshot;
}

export function useChangeBookPosition(listSlug: ReadingListSlug) {
	const queryClient = useQueryClient();
	const queryKey = getReadingListQueryKey(listSlug);

	return useMutation<
		ReadingListSnapshot,
		Error,
		ChangeBookPositionInput,
		ChangeBookPositionContext
	>({
		mutationFn: ({ bookId, targetIndex }: ChangeBookPositionInput) =>
			moveReadingListBook(listSlug, bookId, targetIndex),

		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey });

			const previousSnapshot =
				queryClient.getQueryData<ReadingListSnapshot>(queryKey);

			queryClient.setQueryData<ReadingListSnapshot | undefined>(
				queryKey,
				(snapshot) => reorderSnapshot(snapshot, input),
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
