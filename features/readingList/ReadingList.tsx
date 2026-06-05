"use client";

import { useMemo } from "react";

import { SearchBooksPanel } from "./SearchBooksPanel";
import { ReadingListHero } from "./ReadingListHero";
import { ReadingQueuePanel } from "./ReadingQueuePanel";
import { useBookSearch } from "./useBookSearch";
import { useReadingList } from "./useReadingList";
import { SectionBackdrop } from "@/components/SectionBackdrop";

export function ReadingList() {
	const { books, addBook, moveBook, pages } = useReadingList();
	const { query, setQuery, searchTerm, searchQuery } = useBookSearch();
	const existingBookIds = useMemo(
		() => new Set(books.map((book) => book.id)),
		[books],
	);

	return (
		<main className="min-h-screen bg-[#0d1110] text-stone-50">
			<section className="relative isolate overflow-hidden border-b border-white/8">
				<SectionBackdrop />

				<div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-12 lg:px-8 lg:pb-16 lg:pt-10">
					<ReadingListHero booksCount={books.length} pages={pages} />

					<div className="grid gap-4">
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
