"use client";

import { useMemo } from "react";
import { SectionBackdrop } from "@/components/SectionBackdrop";
import { debugComponentAttrs } from "@/lib/debug";
import { ReadingListHero } from "./components/ReadingListHero";
import { ReadingQueuePanel } from "./components/ReadingQueuePanel";
import { SearchBooksPanel } from "./components/SearchBooksPanel";
import { useBookSearch } from "./hooks/useBookSearch";
import { useReadingList } from "./hooks/useReadingList";
import styles from "./ReadingList.module.css";

export function ReadingList() {
	const { books, addBook, moveBook, pages } = useReadingList();
	const { query, setQuery, searchTerm, searchQuery } = useBookSearch();
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
					<ReadingListHero booksCount={books.length} pages={pages} />

					<div className={styles.stack}>
						<SearchBooksPanel
							query={query}
							searchTerm={searchTerm}
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
