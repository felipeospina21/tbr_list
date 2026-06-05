"use client";

import { BookPlus, LibraryBig } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

import type { SearchBook } from "./bookSearch";
import type { Book } from "./readingList";

type SearchBookResultCardProps = {
	book: SearchBook;
	isAdded: boolean;
	onAddBook: (book: Book) => void;
};

export function SearchBookResultCard({
	book,
	isAdded,
	onAddBook,
}: SearchBookResultCardProps) {
	return (
		<div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#111715]/90">
			<div className="grid gap-0 md:grid-cols-[120px_minmax(0,1fr)]">
				<div className="relative min-h-44 bg-black/20">
					<Image
						src={book.cover}
						alt={`${book.title} front cover`}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 120px"
						unoptimized
					/>
				</div>
				<div className="flex flex-col p-4 sm:p-5">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div>
							<Badge className="border-white/10 bg-white/6 text-white/78">
								<LibraryBig className="mr-1.5 size-3" />
								{book.provider}
							</Badge>
							<h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
								{book.title}
							</h3>
							<p className="mt-1 text-sm text-white/60">{book.author}</p>
						</div>
						<Badge className="border-white/10 bg-white/6 text-white/78">
							{typeof book.pages === "number" ? `${book.pages} pages` : "Pages n/a"}
						</Badge>
					</div>

					<p className="mt-4 line-clamp-4 text-sm leading-6 text-white/72">
						{book.description}
					</p>

					<div className="mt-5">
						<Button
							type="button"
							variant={isAdded ? "secondary" : "default"}
							onClick={() => onAddBook(book)}
							disabled={isAdded}
							className={cn(
								"w-full",
								isAdded
									? "border-white/10 bg-white/10 text-white hover:bg-white/10"
									: "bg-amber-200 text-stone-950 hover:bg-amber-100",
							)}
						>
							<BookPlus className="size-4" />
							{isAdded ? "Added to list" : "Add to list"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
