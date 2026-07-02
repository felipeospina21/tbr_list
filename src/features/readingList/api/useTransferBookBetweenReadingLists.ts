"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
	ReadingListSlug,
	ReadingListSnapshot,
	SchemaBook,
} from "../types";
import { totalPages } from "../types";
import { getReadingListQueryKey } from "./readingListQueryKeys";

interface TransferBookInput {
	book: SchemaBook;
	targetListSlug: ReadingListSlug;
}

interface TransferBookContext {
	previousSourceSnapshot?: ReadingListSnapshot;
	previousTargetSnapshot?: ReadingListSnapshot;
	targetQueryKey: ReturnType<typeof getReadingListQueryKey>;
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

function appendBookToSnapshot(
	snapshot: ReadingListSnapshot | undefined,
	book: SchemaBook,
) {
	if (
		!snapshot ||
		snapshot.books.some((existingBook) => existingBook.id === book.id)
	) {
		return snapshot;
	}

	const books = [...snapshot.books, book];

	return {
		...snapshot,
		books,
		pages: totalPages(books),
	};
}

export async function transferReadingListBook(
	sourceListSlug: ReadingListSlug,
	targetListSlug: ReadingListSlug,
	bookId: string,
): Promise<ReadingListSnapshot> {
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

	return (await response.json()) as ReadingListSnapshot;
}

export function useTransferBookBetweenReadingLists(
	sourceListSlug: ReadingListSlug,
) {
	const queryClient = useQueryClient();
	const sourceQueryKey = getReadingListQueryKey(sourceListSlug);

	return useMutation<
		ReadingListSnapshot,
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
				queryClient.getQueryData<ReadingListSnapshot>(sourceQueryKey);
			const previousTargetSnapshot =
				queryClient.getQueryData<ReadingListSnapshot>(targetQueryKey);

			queryClient.setQueryData<ReadingListSnapshot | undefined>(
				sourceQueryKey,
				(snapshot) => removeBookFromSnapshot(snapshot, book.id),
			);
			queryClient.setQueryData<ReadingListSnapshot | undefined>(
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
