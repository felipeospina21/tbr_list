"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/Card";
import type { BookSearchQueryData } from "../queries/useBookSearchData";
import type { SearchBook } from "../types/search";
import { BookCard } from "./BookCard";
import { SearchBooksCardActions } from "./SearchBooksCardActions";
import styles from "./SearchBooksPanel.module.css";
import { SearchBooksToolbar } from "./SearchBooksToolbar";

type SearchBooksPanelProps = {
	activeListSlug: "to_be_read" | "finished" | "did_not_finish";
	query: string;
	searchQuery: UseQueryResult<BookSearchQueryData, Error>;
	onQueryChange: (query: string) => void;
	existingBookIds: ReadonlySet<string>;
};

export function SearchBooksPanel({
	activeListSlug,
	query,
	searchQuery,
	onQueryChange,
	existingBookIds,
}: SearchBooksPanelProps) {
	const results = searchQuery.data?.results ?? [];
	const hasResults = results.length > 0;

	return (
		<Card className={styles.panel}>
			<CardContent className={styles.content}>
				<div className={styles.stack}>
					<SearchBooksToolbar query={query} onQueryChange={onQueryChange} />

					{hasResults ? (
						<div className={styles.results}>
							{results.map((book: SearchBook, index) => {
								const isAdded = existingBookIds.has(book.id);

								return (
									<BookCard
										key={book.id}
										book={book}
										index={index}
										provider={book.provider}
										action={
											<SearchBooksCardActions
												isAdded={isAdded}
												book={book}
												activeListSlug={activeListSlug}
											/>
										}
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
