"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";

import type { Book } from "./readingList";
import { ReadingQueueItem } from "./ReadingQueueItem";

type ReadingQueuePanelProps = {
	books: Book[];
	onMoveBook: (index: number, direction: -1 | 1) => void;
};

export function ReadingQueuePanel({ books, onMoveBook }: ReadingQueuePanelProps) {
	return (
		<Card className="border-white/10 bg-[#121817]/90 text-white shadow-[0_36px_100px_rgba(0,0,0,0.4)] backdrop-blur-md">
			<CardHeader className="gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
							Current session
						</p>
						<CardTitle className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
							Ready to read next
						</CardTitle>
					</div>
					<div className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
						Now
					</div>
				</div>
				<CardDescription className="max-w-md text-sm leading-6 text-white/66">
					{books.length > 0
						? "The top of the list is the next decision. Move anything up or down without losing the rest."
						: "Start by searching for a book. This workspace stays empty until you add something to the queue."}
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-3 px-4 py-4 sm:px-5 sm:py-5">
				{books.length === 0 ? (
					<div className="rounded-[1.35rem] border border-dashed border-white/12 bg-white/[0.03] px-4 py-8 text-sm text-white/60">
						No books yet. Use the search panel below to add your first title.
					</div>
				) : (
					books.map((book, index) => (
						<ReadingQueueItem
							key={book.id}
							book={book}
							index={index}
							total={books.length}
							onMove={onMoveBook}
						/>
					))
				)}
			</CardContent>
		</Card>
	);
}
