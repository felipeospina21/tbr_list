"use client";

import { signOut } from "next-auth/react";
import { useMemo } from "react";
import { SectionBackdrop } from "@/components/SectionBackdrop";
import { debugComponentAttrs } from "@/lib/debug";
import { ReadingListHero } from "./components/ReadingListHero";
import { ReadingQueuePanel } from "./components/ReadingQueuePanel";
import { SearchBooksPanel } from "./components/SearchBooksPanel";
import { useBookSearch } from "./hooks/useBookSearch";
import { useReadingList } from "./hooks/useReadingList";
import styles from "./ReadingList.module.css";

type ReadingListProps = {
	accountLabel: string;
};

export function ReadingList({ accountLabel }: ReadingListProps) {
	const { books, addBook, moveBook, pages } = useReadingList();
	const { query, setQuery, searchQuery } = useBookSearch();
	const existingBookIds = useMemo(
		() => new Set(books.map((book) => book.id)),
		[books],
	);

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
						pages={pages}
						accountLabel={accountLabel}
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
