"use client";

import { ArrowDown, ArrowUp, BookOpenText } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

import type { Book } from "../types/readingList";

type ReadingQueueItemProps = {
	book: Book;
	index: number;
	total: number;
	onMove: (bookId: string, direction: -1 | 1) => void;
};

export function ReadingQueueItem({
	book,
	index,
	total,
	onMove,
}: ReadingQueueItemProps) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-[1.35rem] border",
				index === 0
					? "border-white/14 bg-white/8"
					: "border-white/8 bg-white/[0.04]",
			)}
		>
			<div className="grid gap-0 md:grid-cols-[120px_minmax(0,1fr)]">
				<div className="relative min-h-40 bg-black/20">
					<Image
						src={book.cover}
						alt={`${book.title} cover`}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 120px"
						unoptimized
						priority={index === 0}
					/>
				</div>
				<div className="flex flex-col p-4 sm:p-5">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div>
							<Badge className="border-white/10 bg-white/6 text-white/78">
								#{index + 1}
							</Badge>
							<h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
								{book.title}
							</h3>
							<p className="mt-1 text-sm text-white/60">{book.author}</p>
						</div>
						<Badge className="border-white/10 bg-white/6 text-white/78">
							<BookOpenText className="mr-1.5 size-3" />
							{typeof book.pages === "number"
								? `${book.pages} pages`
								: "Pages n/a"}
						</Badge>
					</div>

					<p className="mt-4 line-clamp-4 text-sm leading-6 text-white/72">
						{book.description}
					</p>

					<div className="mt-5 flex flex-col gap-3 sm:flex-row">
						<Button
							type="button"
							variant="outline"
							onClick={() => onMove(book.id, -1)}
							disabled={index === 0}
							className="border-white/10 bg-white/6 text-white hover:bg-white/10"
						>
							<ArrowUp className="size-4" />
							Move up
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => onMove(book.id, 1)}
							disabled={index === total - 1}
							className="border-white/10 bg-white/6 text-white hover:bg-white/10"
						>
							<ArrowDown className="size-4" />
							Move down
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
