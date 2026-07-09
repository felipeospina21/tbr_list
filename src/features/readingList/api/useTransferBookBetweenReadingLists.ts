"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FetchRedingLists } from "@/app/api/reading-list/route";
import type { ReadingListBook } from "@/features/readingList/server/queries/getReadingListWithBooks";
import { apiFetch } from "@/lib/api/apiFetch";
import type { ReadingListType } from "../types";
import { getReadingListQueryKey } from "./readingListQueryKeys";

interface TransferBookInput {
	book: ReadingListBook;
	targetListType: ReadingListType;
}

interface TransferBookContext {
	previousSourceSnapshot?: FetchRedingLists;
	previousTargetSnapshot?: FetchRedingLists;
	targetQueryKey: ReturnType<typeof getReadingListQueryKey>;
}

interface TransferReadingListBookResponse {
	bookId: string;
	sourceListType: ReadingListType;
	targetListType: ReadingListType;
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

function appendBookToSnapshot(
	snapshot: FetchRedingLists | undefined,
	book: ReadingListBook,
) {
	if (!snapshot) {
		return snapshot;
	}

	const books = [
		...snapshot.items.books.filter(
			(existingBook) => existingBook.id !== book.id,
		),
		book,
	];

	return {
		...snapshot,
		items: {
			...snapshot.items,
			books,
			pages: books.reduce(
				(sum, currentBook) =>
					sum + (typeof currentBook.pages === "number" ? currentBook.pages : 0),
				0,
			),
		},
	};
}

export async function transferReadingListBook(
	sourceListType: ReadingListType,
	targetListType: ReadingListType,
	bookId: string,
): Promise<TransferReadingListBookResponse> {
	return apiFetch<TransferReadingListBookResponse>(`/api/reading-list`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ bookId, sourceListType, targetListType }),
	});
}

export function useTransferBookBetweenReadingLists(
	sourceListType: ReadingListType,
) {
	const queryClient = useQueryClient();
	const sourceQueryKey = getReadingListQueryKey(sourceListType);

	return useMutation<
		TransferReadingListBookResponse,
		Error,
		TransferBookInput,
		TransferBookContext
	>({
		mutationFn: ({ book, targetListType }) =>
			transferReadingListBook(sourceListType, targetListType, book.id),
		onMutate: async ({ book, targetListType }) => {
			const targetQueryKey = getReadingListQueryKey(targetListType);

			await Promise.all([
				queryClient.cancelQueries({ queryKey: sourceQueryKey }),
				queryClient.cancelQueries({ queryKey: targetQueryKey }),
			]);

			const previousSourceSnapshot =
				queryClient.getQueryData<FetchRedingLists>(sourceQueryKey);
			const previousTargetSnapshot =
				queryClient.getQueryData<FetchRedingLists>(targetQueryKey);

			queryClient.setQueryData<FetchRedingLists | undefined>(
				sourceQueryKey,
				(snapshot) => removeBookFromSnapshot(snapshot, book.id),
			);
			queryClient.setQueryData<FetchRedingLists | undefined>(
				targetQueryKey,
				(snapshot) => appendBookToSnapshot(snapshot, book),
			);

			return {
				previousSourceSnapshot,
				previousTargetSnapshot,
				targetQueryKey,
			};
		},
		onError: (_error, _input, context) => {
			if (!context) {
				return;
			}

			if (context.previousSourceSnapshot) {
				queryClient.setQueryData(
					sourceQueryKey,
					context.previousSourceSnapshot,
				);
			}

			if (context.previousTargetSnapshot) {
				queryClient.setQueryData(
					context.targetQueryKey,
					context.previousTargetSnapshot,
				);
			}
		},
		onSuccess: (_snapshot, _input, context) => {
			if (!context) {
				return;
			}

			void queryClient.invalidateQueries({ queryKey: sourceQueryKey });
			void queryClient.invalidateQueries({ queryKey: context.targetQueryKey });
		},
	});
}
