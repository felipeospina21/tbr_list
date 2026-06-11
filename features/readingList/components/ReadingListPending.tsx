"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { useBookSearch } from "../hooks/useBookSearch";
import styles from "../ReadingList.module.css";
import {
	DEFAULT_READING_LIST_SLUG,
	type ReadingListSlug,
} from "../types/readingList";
import { ReadingListHero } from "./ReadingListHero";
import { ReadingQueuePanel } from "./ReadingQueuePanel";
import { SearchBooksPanel } from "./SearchBooksPanel";

interface ReadingListPendingProps {
	initialListSlug: ReadingListSlug;
}

export function ReadingListPending({
	initialListSlug,
}: ReadingListPendingProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { query, setQuery, searchQuery } = useBookSearch();
	const existingBookIds = useMemo(() => new Set<string>(), []);

	function handleSelectList(slug: ReadingListSlug) {
		const nextParams = new URLSearchParams(searchParams.toString());

		if (slug === DEFAULT_READING_LIST_SLUG) {
			nextParams.delete("listSlug");
		} else {
			nextParams.set("listSlug", slug);
		}

		const nextQuery = nextParams.toString();
		const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

		router.replace(nextUrl, { scroll: false });
	}

	return (
		<>
			<ReadingListHero
				activeListSlug={initialListSlug}
				booksCount={undefined}
				pages={undefined}
				onSelectList={handleSelectList}
			/>

			<div className={styles.stack}>
				<SearchBooksPanel
					activeListSlug={initialListSlug}
					query={query}
					searchQuery={searchQuery}
					onQueryChange={setQuery}
					existingBookIds={existingBookIds}
				/>

				<ReadingQueuePanel
					activeListSlug={initialListSlug}
					books={undefined}
					isLoading
				/>
			</div>
		</>
	);
}
