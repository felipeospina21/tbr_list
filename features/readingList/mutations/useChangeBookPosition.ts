"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getReadingListQueryKey } from "../queries/useFetchReadingList";
import type {
	ReadingListSlug,
	ReadingListSnapshot,
} from "../types/readingList";

type ChangeBookPositionInput = {
	bookId: string;
	direction: -1 | 1;
};

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

	return useMutation({
		mutationFn: ({ bookId, direction }: ChangeBookPositionInput) =>
			moveReadingListBook(listSlug, bookId, direction),
		onSuccess: (snapshot) => {
			queryClient.setQueryData(getReadingListQueryKey(listSlug), snapshot);
		},
	});
}
