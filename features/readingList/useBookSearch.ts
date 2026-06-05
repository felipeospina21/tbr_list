"use client";

import { useEffect, useState } from "react";

import type { SearchBook, SearchDebugInfo } from "./bookSearch";

type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;

export function useBookSearch() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchBook[]>([]);
	const [status, setStatus] = useState<SearchStatus>("idle");
	const [error, setError] = useState<string | null>(null);
	const [debug, setDebug] = useState<SearchDebugInfo | null>(null);

	useEffect(() => {
		const normalizedQuery = query.trim();

		if (normalizedQuery.length < MIN_QUERY_LENGTH) {
			setResults([]);
			setStatus("idle");
			setError(null);
			setDebug(null);
			return undefined;
		}

		const controller = new AbortController();
		const timeoutId = window.setTimeout(async () => {
			setStatus("loading");
			setError(null);

			try {
				const response = await fetch(
					`/api/bookSearch?q=${encodeURIComponent(normalizedQuery)}`,
					{
						signal: controller.signal,
					},
				);

				if (!response.ok) {
					throw new Error("Search request failed");
				}

				const data = (await response.json()) as {
					results?: SearchBook[];
					debug?: SearchDebugInfo;
				};

				const nextResults = data.results ?? [];
				setResults(nextResults);
				setStatus(nextResults.length > 0 ? "success" : "empty");
				setDebug(
					data.debug ?? {
						googleApiKeyConfigured: false,
						googleStatus: null,
						googleError: null,
						googleTotalItems: null,
						googleResultCount: 0,
						openLibraryStatus: null,
						openLibraryResultCount: 0,
						fallbackUsed: false,
						provider: "none",
					},
				);
			} catch (caughtError) {
				if (controller.signal.aborted) {
					return;
				}

				setResults([]);
				setStatus("error");
				setDebug(null);
				setError(
					caughtError instanceof Error
						? caughtError.message
						: "Unable to search books.",
				);
			}
		}, SEARCH_DEBOUNCE_MS);

		return () => {
			controller.abort();
			window.clearTimeout(timeoutId);
		};
	}, [query]);

	return {
		query,
		setQuery,
		results,
		status,
		error,
		debug,
	};
}
