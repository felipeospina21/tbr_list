"use client";

import { BookOpenText, LibraryBig } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/Card";

import { ReadingListCard } from "./ReadingListCard";
import { useReadingList } from "./useReadingList";

export function ReadingList() {
	const { books, moveBook, pages } = useReadingList();

	return (
		<main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff9ef_0%,_#f3efe8_44%,_#ebe5dc_100%)] px-4 py-5 text-stone-950 sm:px-6 sm:py-8">
			<section className="mx-auto flex w-full max-w-3xl flex-col gap-5">
				<Card className="overflow-hidden bg-white/85 backdrop-blur">
					<CardHeader className="gap-4 p-5 sm:p-6">
						<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
							<LibraryBig className="size-4" />
							Reading list
						</div>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
							<div className="space-y-2">
								<CardTitle className="text-3xl sm:text-4xl">
									Books to read next
								</CardTitle>
								<CardDescription className="max-w-xl text-sm sm:text-base">
									Reorder the list to match your current mood. The cards are
									mobile-first and expand cleanly on larger screens.
								</CardDescription>
							</div>
							<div className="grid grid-cols-2 gap-3 sm:min-w-56">
								<Card className="border-stone-200 bg-stone-950 text-white shadow-none">
									<CardContent className="p-4">
										<div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/65">
											<BookOpenText className="size-3.5" />
											Books
										</div>
										<p className="mt-2 text-2xl font-semibold">
											{books.length}
										</p>
									</CardContent>
								</Card>
								<Card className="border-stone-200 shadow-none">
									<CardContent className="p-4">
										<p className="text-xs uppercase tracking-[0.2em] text-stone-500">
											Pages
										</p>
										<p className="mt-2 text-2xl font-semibold">{pages}</p>
									</CardContent>
								</Card>
							</div>
						</div>
					</CardHeader>
				</Card>

				<div className="flex flex-col gap-4">
					{books.map((book, index) => (
						<ReadingListCard
							key={book.id}
							book={book}
							index={index}
							isFirst={index === 0}
							isLast={index === books.length - 1}
							onMove={moveBook}
						/>
					))}
				</div>
			</section>
		</main>
	);
}
