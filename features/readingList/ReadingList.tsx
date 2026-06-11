"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { ReadingListHero } from "./components/ReadingListHero";
import { ReadingQueuePanel } from "./components/ReadingQueuePanel";
import { SearchBooksPanel } from "./components/SearchBooksPanel";
import { useBookSearch } from "./hooks/useBookSearch";
import { useReadingList } from "./hooks/useReadingList";
import styles from "./ReadingList.module.css";
import {
	DEFAULT_READING_LIST_SLUG,
	type ReadingListSlug,
} from "./types/readingList";

type ReadingListProps = {
	initialListSlug: ReadingListSlug;
};

export function ReadingList({ initialListSlug }: ReadingListProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { activeListSlug, setSelectedListSlug, readingListQuery } =
		useReadingList(initialListSlug);

	const books = readingListQuery.data?.books;
	const pages = readingListQuery.data?.pages;

	const { query, setQuery, searchQuery } = useBookSearch();
	const existingBookIds = useMemo(
		() => new Set(books?.map((book) => book.id)),
		[books],
	);

	function handleSelectList(slug: ReadingListSlug) {
		setSelectedListSlug(slug);

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
				activeListSlug={activeListSlug}
				booksCount={books?.length}
				pages={pages}
				onSelectList={handleSelectList}
			/>

			<div className={styles.stack}>
				<SearchBooksPanel
					activeListSlug={activeListSlug}
					query={query}
					searchQuery={searchQuery}
					onQueryChange={setQuery}
					existingBookIds={existingBookIds}
				/>

				<ReadingQueuePanel
					activeListSlug={activeListSlug}
					books={books}
					isLoading={readingListQuery.isPending}
				/>
			</div>
		</>
	);
}
