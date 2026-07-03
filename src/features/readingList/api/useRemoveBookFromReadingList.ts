"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FetchRedingLists } from "@/app/api/reading-list/route";
import { apiFetch } from "@/lib/api/apiFetch";
import type { ReadingListType } from "../types";
import {
	getReadingListQueryKey,
	READING_LIST_QUERY_KEY,
} from "./readingListQueryKeys";

interface RemoveBookInput {
	bookId: string;
}

interface RemoveBookContext {
	previousSnapshot?: FetchRedingLists;
}

export interface DeleteReadingListBookResponse {
	bookId: string;
}

function removeBookFromSnapshot(
	snapshot: FetchRedingLists | undefined,
	bookId: string,
) {
	if (!snapshot) {
		return snapshot;
	}

	const books = snapshot.items.books.filter((book) => book.id !== bookId);

	return {
		...snapshot,
		items: {
			...snapshot.items,
			books,
			pages: books.reduce(
				(sum, book) => sum + (typeof book.pages === "number" ? book.pages : 0),
				0,
			),
		},
	};
}

export async function removeReadingListBook(bookId: string) {
	return apiFetch<DeleteReadingListBookResponse>(`/api/reading-list`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ bookId }),
	});
}

export function useRemoveBookFromReadingList(listType: ReadingListType) {
	const queryClient = useQueryClient();
	const queryKey = getReadingListQueryKey(listType);

	return useMutation<
		DeleteReadingListBookResponse,
		Error,
		RemoveBookInput,
		RemoveBookContext
	>({
		mutationFn: ({ bookId }) => removeReadingListBook(bookId),
		onMutate: async ({ bookId }) => {
			await queryClient.cancelQueries({ queryKey });

			const previousSnapshot =
				queryClient.getQueryData<FetchRedingLists>(queryKey);

			queryClient.setQueryData<FetchRedingLists | undefined>(
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
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: READING_LIST_QUERY_KEY,
			});
		},
	});
}
