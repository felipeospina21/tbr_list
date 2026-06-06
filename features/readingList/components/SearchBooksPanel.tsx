"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { Search } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/Card";
import type { BookSearchQueryData } from "../queries/useBookSearchData";
import type { Book } from "../types/readingList";
import type { SearchBook } from "../types/search";
import { SearchBookResultCard } from "./SearchBookResultCard";
import { SearchBooksStateMessage } from "./SearchBooksStateMessage";
import { SearchBooksToolbar } from "./SearchBooksToolbar";

type SearchBooksPanelProps = {
	query: string;
	searchTerm: string;
	searchQuery: UseQueryResult<BookSearchQueryData, Error>;
	onQueryChange: (query: string) => void;
	onAddBook: (book: Book) => void;
	existingBookIds: ReadonlySet<string>;
};

export function SearchBooksPanel({
	query,
	searchTerm,
	searchQuery,
	onQueryChange,
	onAddBook,
	existingBookIds,
}: SearchBooksPanelProps) {
	const results = searchQuery.data?.results ?? [];
	const isIdle = searchTerm.length === 0;
	const isLoading =
		!isIdle && (searchQuery.isPending || searchQuery.isFetching);
	const hasResults = results.length > 0;
	const error =
		searchQuery.isError && searchQuery.error instanceof Error
			? searchQuery.error.message
			: searchQuery.isError
				? "Unable to search books."
				: null;

	const subtitle = isLoading
		? "Searching Google Books first, then Open Library if needed."
		: error
			? "The search request failed. Try again in a moment."
			: !isIdle && !hasResults
				? "No books matched that search."
				: "Search Google Books first. Open Library fills in when Google has no matches.";

	return (
		<Card className="border-white/10 bg-white/[0.04] text-white shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
			<CardHeader className="gap-4 p-5">
				<div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6">
					<Search className="size-4" />
				</div>
				<CardTitle className="text-lg font-semibold tracking-[-0.02em]">
					Search books
				</CardTitle>
				<CardDescription className="text-sm leading-6 text-white/66">
					{subtitle}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4 px-5 pb-5">
				<SearchBooksToolbar query={query} onQueryChange={onQueryChange} />

				{isIdle ? (
					<SearchBooksStateMessage
						variant="idle"
						message="Type at least two characters to search the catalog."
					/>
				) : null}

				{isLoading ? (
					<SearchBooksStateMessage
						variant="loading"
						message="Searching books..."
					/>
				) : null}

				{error ? (
					<SearchBooksStateMessage variant="error" message={error} />
				) : null}

				{!isIdle && !isLoading && !error && !hasResults ? (
					<SearchBooksStateMessage
						variant="empty"
						message="No results found."
					/>
				) : null}

				{hasResults ? (
					<div className="flex flex-col gap-4">
						{results.map((book: SearchBook) => {
							const isAdded = existingBookIds.has(book.id);

							return (
								<SearchBookResultCard
									key={book.id}
									book={book}
									isAdded={isAdded}
									onAddBook={onAddBook}
								/>
							);
						})}
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}
