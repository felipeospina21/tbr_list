"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { READING_LIST_QUERY_KEY } from "../queries/useFetchReadingList";
import { readJson } from "../server/bookSearch";
import { ReadingListSnapshot } from "../types/readingList";

type ChangeBookPositionInput = {
	bookId: string;
	direction: -1 | 1;
};

export async function moveReadingListBook(
	bookId: string,
	direction: -1 | 1,
): Promise<ReadingListSnapshot> {
	const response = await fetch("/api/reading-list", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ bookId, direction }),
	});

	return readJson<ReadingListSnapshot>(response);
}

export function useChangeBookPosition() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ bookId, direction }: ChangeBookPositionInput) =>
			moveReadingListBook(bookId, direction),
		onSuccess: (snapshot) => {
			queryClient.setQueryData(READING_LIST_QUERY_KEY, snapshot);
		},
	});
}
