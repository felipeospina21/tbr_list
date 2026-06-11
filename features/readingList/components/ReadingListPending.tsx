"use client";

import { ReadingList } from "../ReadingList";
import type { ReadingListSlug } from "../types/readingList";

interface ReadingListPendingProps {
	initialListSlug: ReadingListSlug;
}

export function ReadingListPending({
	initialListSlug,
}: ReadingListPendingProps) {
	return <ReadingList initialListSlug={initialListSlug} />;
}
