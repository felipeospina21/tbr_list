"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FetchRedingLists } from "@/app/api/reading-list/route";
import type { ReadingListSlug, SchemaBook } from "../types";
import { getReadingListQueryKey } from "./readingListQueryKeys";

interface TransferBookInput {
	book: SchemaBook;
	targetListSlug: ReadingListSlug;
}

interface TransferBookContext {
	previousSourceSnapshot?: FetchRedingLists;
	previousTargetSnapshot?: FetchRedingLists;
	targetQueryKey: ReturnType<typeof getReadingListQueryKey>;
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
	book: SchemaBook,
) {
	if (
		!snapshot ||
		snapshot.items.books.some((existingBook) => existingBook.id === book.id)
	) {
		return snapshot;
	}

	const books = [...snapshot.items.books, book];

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
	sourceListSlug: ReadingListSlug,
	targetListSlug: ReadingListSlug,
	bookId: string,
): Promise<FetchRedingLists> {
	const response = await fetch(`/api/reading-list?listSlug=${sourceListSlug}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ bookId, sourceListSlug, targetListSlug }),
	});

	if (!response.ok) {
		throw new Error("Reading list request failed");
	}

	return (await response.json()) as FetchRedingLists;
}

export function useTransferBookBetweenReadingLists(
	sourceListSlug: ReadingListSlug,
) {
	const queryClient = useQueryClient();
	const sourceQueryKey = getReadingListQueryKey(sourceListSlug);

	return useMutation<
		FetchRedingLists,
		Error,
		TransferBookInput,
		TransferBookContext
	>({
		mutationFn: ({ book, targetListSlug }) =>
			transferReadingListBook(sourceListSlug, targetListSlug, book.id),
		onMutate: async ({ book, targetListSlug }) => {
			const targetQueryKey = getReadingListQueryKey(targetListSlug);

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
		onSuccess: (snapshot, _input, context) => {
			queryClient.setQueryData(sourceQueryKey, snapshot);

			void queryClient.invalidateQueries({ queryKey: context.targetQueryKey });
		},
	});
}
