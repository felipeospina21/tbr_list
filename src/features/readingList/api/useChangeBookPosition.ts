"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import { ReorderSingleItemInput } from "../server/commands/reorderSingleItem";
import { ReadingListBook } from "../server/queries/getReadingListWithBooks";
import type { ReadingListType } from "../types";
import { getReadingListQueryKey } from "./readingListQueryKeys";

export type UpdateServerOrderPayload = Omit<ReorderSingleItemInput, "userId">;

export async function updateServerOrder(payload: UpdateServerOrderPayload) {
	return apiFetch(`/api/reading-list`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}
type ReorderSingleInputContext = {
	previousBooks: R;
};

type R = unknown;

interface ReadingListCacheData {
	items: {
		books: ReadingListBook[];
	};
}

export function useUpdateBookOrderMutation(readingListType: ReadingListType) {
	const queryClient = useQueryClient();
	const queryKey = getReadingListQueryKey(readingListType);

	return useMutation<
		R,
		Error,
		UpdateServerOrderPayload,
		ReorderSingleInputContext
	>({
		mutationFn: async (input) => {
			return updateServerOrder(input);
		},

		onMutate: async (payload) => {
			// 1. Cancel outgoing queries so they don't overwrite us
			await queryClient.cancelQueries({ queryKey });

			// 2. Snapshot the current cache state for rollback purposes
			const previousBooks = queryClient.getQueryData(queryKey);

			// 3. OPTIMISTIC UPDATE: Calculate the new float location immediately in cache
			let calculatedPosition: number;
			if (payload.abovePosition === null && payload.belowPosition !== null) {
				calculatedPosition = payload.belowPosition / 2;
			} else if (
				payload.abovePosition !== null &&
				payload.belowPosition === null
			) {
				calculatedPosition = payload.abovePosition + 1.0;
			} else if (
				payload.abovePosition !== null &&
				payload.belowPosition !== null
			) {
				calculatedPosition =
					(payload.abovePosition + payload.belowPosition) / 2;
			} else {
				calculatedPosition = 1.0;
			}

			// 4. Safely update ONLY the target book's position property inside the array
			queryClient.setQueryData<ReadingListCacheData>(queryKey, (oldData) => {
				// Make sure this matches your exact cached structure (e.g., oldData.items.books)
				if (!oldData?.items?.books) return oldData;

				const updatedBooks = oldData.items.books.map((book: ReadingListBook) =>
					book.id === payload.bookId
						? { ...book, position: calculatedPosition }
						: book,
				);

				// Return the intact structural wrapper with our single modified book item
				return {
					...oldData,
					items: {
						...oldData.items,
						books: updatedBooks,
					},
				};
			});

			return { previousBooks };
		},

		onSuccess: (responseData, payload) => {
			// Ensure the cache matches the definitive precision float returned by Postgres
			queryClient.setQueryData<ReadingListCacheData>(queryKey, (oldData) => {
				if (!oldData?.items?.books) return oldData;

				return {
					...oldData,
					items: {
						...oldData.items,
						books: oldData.items.books.map((book: ReadingListBook) =>
							book.id === payload.bookId
								? { ...book, position: responseData.position }
								: book,
						),
					},
				};
			});
		},

		onError: (_err, _variables, context) => {
			// Roll back completely if server rejects the transaction operation
			if (context?.previousBooks) {
				queryClient.setQueryData(queryKey, context.previousBooks);
			}
		},
	});
}
