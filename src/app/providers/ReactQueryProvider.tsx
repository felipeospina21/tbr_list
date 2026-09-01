"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { fetchReadingList, getReadingListQueryKey } from "@/features/readingList/api/useFetchReadingList";
import { ReadingListType } from "@/features/readingList/types";
import { del, get, set } from "idb-keyval";
import { type ReactNode, useState } from "react";

const LIST_TYPES: ReadingListType[] = ["to_be_read", "reading", "finished", "did_not_finish"];

export function ReactQueryProvider({ children }: { children: ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: false,
						refetchOnWindowFocus: false,
						staleTime: 5 * 60 * 1000,
						gcTime: 1000 * 60 * 60 * 24 * 7, // Keep cached data for 7 days
					},
				},
			}),
	);

	const [persister] = useState(() =>
		createAsyncStoragePersister({
			storage: {
				getItem: async (key) => await get(key),
				setItem: async (key, value) => await set(key, value),
				removeItem: async (key) => await del(key),
			},
		}),
	);

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister }}
			onSuccess={() => {
				queryClient.resumePausedMutations();

				// Prefetch all lists in the background on startup (if online)
				if (typeof window !== "undefined" && navigator.onLine) {
					for (const listType of LIST_TYPES) {
						queryClient.prefetchQuery({
							queryKey: getReadingListQueryKey(listType),
							queryFn: () => fetchReadingList(listType),
							staleTime: 5 * 60 * 1000,
						});
					}
				}
			}}
		>
			{children}
		</PersistQueryClientProvider>
	);
}


