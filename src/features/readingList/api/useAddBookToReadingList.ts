"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import { AddBookToReadingListInput } from "../server/commands/addBookToReadingList";
import { getReadingListQueryKey } from "./readingListQueryKeys";

export type AddReadingListBookPayload = Omit<
	AddBookToReadingListInput,
	"userId"
>;

export async function addReadingListBook(payload: AddReadingListBookPayload) {
	return apiFetch(`/api/reading-list`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

export function useAddBookToReadingList() {
	const queryClient = useQueryClient();
	const queryKey = getReadingListQueryKey("to_be_read");

	return useMutation<unknown, Error, AddReadingListBookPayload>({
		mutationFn: (input) => addReadingListBook(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});
}
