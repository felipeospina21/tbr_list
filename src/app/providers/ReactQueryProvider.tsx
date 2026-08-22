"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";
import { type ReactNode, useState } from "react";

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
		>
			{children}
		</PersistQueryClientProvider>
	);
}

