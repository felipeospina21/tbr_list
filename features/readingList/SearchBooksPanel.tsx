"use client";

import { BookPlus, LibraryBig, Search, Sparkles, X } from "lucide-react";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/Card";
import { Input } from "@/components/Input";

import { BookCard } from "./BookCard/BookCard";
import type { Book } from "./readingList";
import { useBookSearch } from "./useBookSearch";

type SearchBooksPanelProps = {
	existingBookIds: ReadonlySet<string>;
	onAddBook: (book: Book) => void;
};

export function SearchBooksPanel({
	existingBookIds,
	onAddBook,
}: SearchBooksPanelProps) {
	const { query, setQuery, results, status, error } = useBookSearch();

	const hasResults = results.length > 0;
	const canClear = query.trim().length > 0;
	const subtitle =
		status === "loading"
			? "Searching Google Books first, then Open Library if needed."
			: status === "error"
				? "The search request failed. Try again in a moment."
				: status === "empty"
					? "No books matched that search."
					: "Search Google Books first. Open Library fills in when Google has no matches.";

	return (
		<Card className="overflow-hidden bg-white/85 backdrop-blur">
			<CardHeader className="gap-4 p-5 sm:p-6">
				<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
					<Sparkles className="size-4" />
					Search books
				</div>

				<div className="space-y-2">
					<CardTitle className="text-2xl sm:text-3xl">
						Add something new
					</CardTitle>
					<CardDescription className="max-w-2xl text-sm sm:text-base">
						{subtitle}
					</CardDescription>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row">
					<div className="relative flex-1">
						<Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
						<Input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search by title or author"
							className="pl-11"
						/>
					</div>
					<Button
						type="button"
						variant="outline"
						onClick={() => setQuery("")}
						disabled={!canClear}
						className="sm:w-auto"
					>
						<X className="size-4" />
						Clear
					</Button>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{error ? (
					<div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
						{error}
					</div>
				) : null}

				{status === "idle" ? (
					<div className="rounded-2xl border border-dashed border-stone-200 bg-white px-4 py-6 text-sm text-stone-500">
						Type at least two characters to search the catalog.
					</div>
				) : null}

				{status === "loading" ? (
					<div className="rounded-2xl border border-stone-200 bg-white px-4 py-6 text-sm text-stone-500">
						Searching books...
					</div>
				) : null}

				{status === "empty" ? (
					<div className="rounded-2xl border border-dashed border-stone-200 bg-white px-4 py-6 text-sm text-stone-500">
						No results found.
					</div>
				) : null}

				{hasResults ? (
					<div className="flex flex-col gap-4">
						{results.map((book) => (
							<BookCard
								key={book.id}
								book={book}
								topBadge={
									<Badge variant="secondary">
										<LibraryBig className="mr-1.5 size-3" />
										{book.provider}
									</Badge>
								}
								footer={
									<Button
										type="button"
										variant={
											existingBookIds.has(book.id) ? "secondary" : "default"
										}
										onClick={() => onAddBook(book)}
										disabled={existingBookIds.has(book.id)}
										className="w-full"
									>
										<BookPlus className="size-4" />
										{existingBookIds.has(book.id)
											? "Added to list"
											: "Add to list"}
									</Button>
								}
								titleClassName="text-xl"
								descriptionClassName="text-sm leading-6 text-stone-700 sm:text-[15px]"
								imageSizes="(max-width: 768px) 100vw, 150px"
								imageAltSuffix="front cover"
							/>
						))}
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}
