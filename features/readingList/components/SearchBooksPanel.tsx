"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import iconStyles from "@/components/Icon.module.css";
import { debugComponentAttrs } from "@/lib/debug";
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
