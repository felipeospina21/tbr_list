"use client";

import { BookMarked } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { MoodMatchPanel } from "./components/MoodMatchPanel";
import { ReadingListInsights } from "./components/ReadingListInsights";
import { ReadingListSwitcher } from "./components/ReadingListSwitcher";
import {
	type ReadingListSection,
	ReadingListWorkspaceNav,
} from "./components/ReadingListWorkspaceNav";
import { ReadingQueuePanel } from "./components/ReadingQueuePanel";
import { SearchBooksPanel } from "./components/SearchBooksPanel";
import { useBookSearch } from "./hooks/useBookSearch";
import { useFetchReadingList } from "./queries/useFetchReadingList";
import styles from "./ReadingList.module.css";
import {
	DEFAULT_READING_LIST_SLUG,
	READING_LIST_DEFINITIONS,
	type ReadingListSlug,
} from "./types/readingList";

type ReadingListProps = {
	initialListSlug: ReadingListSlug;
};

export function ReadingList({ initialListSlug }: ReadingListProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [activeSection, setActiveSection] =
		useState<ReadingListSection>("library");
	const [activeListSlug, setActiveListSlug] =
		useState<ReadingListSlug>(initialListSlug);
	const toBeReadQuery = useFetchReadingList("to_be_read");
	const finishedQuery = useFetchReadingList("finished");
	const didNotFinishQuery = useFetchReadingList("did_not_finish");
	const { query, setQuery, searchQuery } = useBookSearch();
	const booksByList = useMemo(
		() => ({
			to_be_read: toBeReadQuery.data?.books ?? [],
			finished: finishedQuery.data?.books ?? [],
			did_not_finish: didNotFinishQuery.data?.books ?? [],
		}),
		[
			toBeReadQuery.data?.books,
			finishedQuery.data?.books,
			didNotFinishQuery.data?.books,
		],
	);
	const activeBooks = booksByList[activeListSlug];
	const allBooks = useMemo(
		() =>
			READING_LIST_DEFINITIONS.flatMap(
				(definition) => booksByList[definition.slug],
			),
		[booksByList],
	);
	const moodBooks = useMemo(
		() => [...booksByList.to_be_read, ...booksByList.finished],
		[booksByList.to_be_read, booksByList.finished],
	);
	const existingBookIds = useMemo(
		() => new Set(allBooks.map((book) => book.id)),
		[allBooks],
	);
	const booksCountByList = useMemo(
		() => ({
			to_be_read: booksByList.to_be_read.length,
			finished: booksByList.finished.length,
			did_not_finish: booksByList.did_not_finish.length,
		}),
		[booksByList],
	);
	const activeQuery = {
		to_be_read: toBeReadQuery,
		finished: finishedQuery,
		did_not_finish: didNotFinishQuery,
	}[activeListSlug];

	function handleSelectList(slug: ReadingListSlug) {
		setActiveListSlug(slug);

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
		<div className={styles.workspace}>
			<ReadingListWorkspaceNav
				activeSection={activeSection}
				onSelectSection={setActiveSection}
			/>

			<section className={styles.content}>
				<div className={styles.header}>
					<div>
						<p className={styles.eyebrow}>Reading room</p>
						<h1 className={styles.title}>{getSectionTitle(activeSection)}</h1>
					</div>
					<div className={styles.mark} aria-hidden="true">
						<BookMarked />
					</div>
				</div>

				{activeSection === "library" ? (
					<div className={styles.sectionStack}>
						<ReadingListSwitcher
							activeListSlug={activeListSlug}
							booksCountByList={booksCountByList}
							onSelectList={handleSelectList}
						/>
						<ReadingQueuePanel
							activeListSlug={activeListSlug}
							books={activeBooks}
							isLoading={activeQuery.isPending}
						/>
					</div>
				) : null}

				{activeSection === "search" ? (
					<SearchBooksPanel
						activeListSlug={activeListSlug}
						query={query}
						searchQuery={searchQuery}
						onQueryChange={setQuery}
						existingBookIds={existingBookIds}
					/>
				) : null}

				{activeSection === "mood" ? <MoodMatchPanel books={moodBooks} /> : null}

				{activeSection === "stats" ? (
					<ReadingListInsights booksByList={booksByList} />
				) : null}
			</section>
		</div>
	);
}

function getSectionTitle(section: ReadingListSection) {
	const titles: Record<ReadingListSection, string> = {
		library: "NextRead",
		search: "Discover",
		mood: "Mood Match",
		stats: "My Stats",
	};

	return titles[section];
}
