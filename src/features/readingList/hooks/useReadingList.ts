"use client";

import { useState } from "react";

import { useFetchReadingList } from "../api/useFetchReadingList";
import {
	DEFAULT_READING_LIST_SLUG,
	type ReadingListSlug,
} from "../types/readingList";

export function useReadingList(
	initialListSlug: ReadingListSlug = DEFAULT_READING_LIST_SLUG,
) {
	const [selectedListSlug, setSelectedListSlug] =
		useState<ReadingListSlug>(initialListSlug);
	const readingListQuery = useFetchReadingList(selectedListSlug);

	const activeListSlug =
		readingListQuery.data?.activeListSlug ?? selectedListSlug;

	return {
		activeListSlug,
		setSelectedListSlug,
		readingListQuery,
	};
}
