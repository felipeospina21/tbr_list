"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import iconStyles from "@/components/Icon.module.css";
import { debugComponentAttrs } from "@/lib/debug";
import type { BookSearchQueryData } from "../queries/useBookSearchData";
import type { Book } from "../types/readingList";
import type { SearchBook } from "../types/search";
import { SearchBookCard } from "./BookCard";
import styles from "./SearchBooksPanel.module.css";
import { SearchBooksToolbar } from "./SearchBooksToolbar";

type SearchBooksPanelProps = {
	query: string;
	searchQuery: UseQueryResult<BookSearchQueryData, Error>;
	onQueryChange: (query: string) => void;
	onAddBook: (book: Book) => void;
	existingBookIds: ReadonlySet<string>;
};

export function SearchBooksPanel({
	query,
	searchQuery,
	onQueryChange,
	onAddBook,
	existingBookIds,
}: SearchBooksPanelProps) {
	const results = searchQuery.data?.results ?? [];
	const hasResults = results.length > 0;

	return (
		<Card className={styles.panel} {...debugComponentAttrs("SearchBooksPanel")}>
			<CardHeader className={styles.header}>
				<div className={styles.headerIcon}>
					<Search className={iconStyles.size4} />
				</div>
				<CardTitle className={styles.headerTitle}>Search books</CardTitle>
			</CardHeader>

			<CardContent className={styles.content}>
				<div className={styles.results}>
					<SearchBooksToolbar query={query} onQueryChange={onQueryChange} />

					{hasResults ? (
						<div className={styles.results}>
							{results.map((book: SearchBook) => {
								const isAdded = existingBookIds.has(book.id);

								return (
									<SearchBookCard
										key={book.id}
										book={book}
										isAdded={isAdded}
										onAddBook={onAddBook}
									/>
								);
							})}
						</div>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
}
