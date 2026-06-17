"use client";

import { useQuery } from "@tanstack/react-query";
import type {
	ReadingListSlug,
	ReadingListSnapshot,
} from "../types/readingList";
import { getReadingListQueryKey } from "./readingListQueryKeys";

export { getReadingListQueryKey } from "./readingListQueryKeys";

export async function fetchReadingList(
	listSlug: ReadingListSlug,
): Promise<ReadingListSnapshot> {
	const response = await fetch(`/api/reading-list?type=to_be_read`);

	if (!response.ok) {
		throw new Error("Reading list request failed");
	}

	return (await response.json()) as ReadingListSnapshot;
}

export function useFetchReadingList(listSlug: ReadingListSlug) {
	return useQuery({
		queryKey: getReadingListQueryKey(listSlug),
		queryFn: () => fetchReadingList(listSlug),
		refetchOnWindowFocus: false,
		throwOnError: true,
	});
}
