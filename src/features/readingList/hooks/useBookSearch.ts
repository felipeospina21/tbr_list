"use client";

import { useState } from "react";

import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useBookSearchData } from "../api/useBookSearchData";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;

export function useBookSearch() {
	const [query, setQuery] = useState("");

	const normalizedQuery = query.trim();
	const debouncedQuery = useDebouncedValue(normalizedQuery, SEARCH_DEBOUNCE_MS);
	const searchTerm =
		normalizedQuery.length >= MIN_QUERY_LENGTH ? debouncedQuery : "";
	const searchQuery = useBookSearchData(searchTerm);

	return {
		query,
		setQuery,
		searchTerm,
		searchQuery,
	};
}
