"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getReadingListQueryKey } from "../queries/readingListQueryKeys";
import type {
	ReadingListSlug,
	ReadingListSnapshot,
} from "../types/readingList";

type ChangeBookPositionInput = {
	bookId: string;
	direction: -1 | 1;
};

type ChangeBookPositionContext = {
	previousSnapshot?: ReadingListSnapshot;
};

function reorderSnapshot(
	snapshot: ReadingListSnapshot | undefined,
	{ bookId, direction }: ChangeBookPositionInput,
) {
	if (!snapshot) {
		return snapshot;
	}

	const currentIndex = snapshot.books.findIndex((book) => book.id === bookId);
	const nextIndex = currentIndex + direction;

	if (currentIndex < 0 || nextIndex < 0 || nextIndex >= snapshot.books.length) {
		return snapshot;
	}

	const books = [...snapshot.books];
	const [book] = books.splice(currentIndex, 1);
	books.splice(nextIndex, 0, book);

	return {
		...snapshot,
		books,
	};
}

export async function moveReadingListBook(
	listSlug: ReadingListSlug,
	bookId: string,
	direction: -1 | 1,
): Promise<ReadingListSnapshot> {
	const response = await fetch(`/api/reading-list?listSlug=${listSlug}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ bookId, direction }),
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
		mutationFn: ({ bookId, direction }: ChangeBookPositionInput) =>
			moveReadingListBook(listSlug, bookId, direction),

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
