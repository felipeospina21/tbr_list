"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { SectionBackdrop } from "@/components/SectionBackdrop";
import { debugComponentAttrs } from "@/lib/debug";
import { ReadingListHero } from "./components/ReadingListHero";
import { ReadingQueuePanel } from "./components/ReadingQueuePanel";
import { SearchBooksPanel } from "./components/SearchBooksPanel";
import { useBookSearch } from "./hooks/useBookSearch";
import { useReadingList } from "./hooks/useReadingList";
import styles from "./ReadingList.module.css";
import {
	DEFAULT_READING_LIST_SLUG,
	READING_LIST_DEFINITIONS,
	type ReadingListSlug,
} from "./types/readingList";

type ReadingListProps = {
	accountLabel: string;
};

export function ReadingList({ accountLabel }: ReadingListProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const initialListSlug = getSelectedListSlug(searchParams.get("listSlug"));
	const {
		activeListSlug,
		books,
		addBook,
		lists,
		moveBook,
		pages,
		setSelectedListSlug,
	} = useReadingList(initialListSlug);
	const { query, setQuery, searchQuery } = useBookSearch();
	const existingBookIds = useMemo(
		() => new Set(books.map((book) => book.id)),
		[books],
	);

	useEffect(() => {
		setSelectedListSlug(getSelectedListSlug(searchParams.get("listSlug")));
	}, [searchParams, setSelectedListSlug]);

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
		<main className={styles.main} {...debugComponentAttrs("ReadingListPage")}>
			<section
				className={styles.surface}
				{...debugComponentAttrs("ReadingListSurface")}
			>
				<SectionBackdrop />

				<div className={styles.shell}>
					<ReadingListHero
						booksCount={books.length}
						activeListSlug={activeListSlug}
						pages={pages}
						accountLabel={accountLabel}
						lists={lists}
						onSelectList={handleSelectList}
						onSignOut={() => {
							void signOut({ callbackUrl: "/login" });
						}}
					/>

					<div className={styles.stack}>
						<SearchBooksPanel
							query={query}
							searchQuery={searchQuery}
							onQueryChange={setQuery}
							onAddBook={addBook}
							existingBookIds={existingBookIds}
						/>

						<ReadingQueuePanel books={books} onMoveBook={moveBook} />
					</div>
				</div>
			</section>
		</main>
	);
}

function getSelectedListSlug(value: string | null): ReadingListSlug {
	const matchingDefinition = READING_LIST_DEFINITIONS.find(
		(definition) => definition.slug === value,
	);

	return matchingDefinition?.slug ?? DEFAULT_READING_LIST_SLUG;
}
