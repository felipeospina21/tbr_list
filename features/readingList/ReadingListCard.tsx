import { ArrowDown, ArrowUp } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/Card";

import type { Book } from "./readingList";

type ReadingListCardProps = {
	book: Book;
	index: number;
	isFirst: boolean;
	isLast: boolean;
	onMove: (index: number, direction: -1 | 1) => void;
};

export function ReadingListCard({
	book,
	index,
	isFirst,
	isLast,
	onMove,
}: ReadingListCardProps) {
	return (
		<Card className="overflow-hidden">
			<div className="grid gap-0 md:grid-cols-[190px_minmax(0,1fr)]">
				<div className={`bg-gradient-to-br ${book.accent} p-4 sm:p-5`}>
					<div className="relative mx-auto aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-[1.25rem] shadow-lg ring-1 ring-white/50">
						<Image
							src={book.cover}
							alt={`${book.title} front cover`}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 190px"
							unoptimized
							priority={index === 0}
						/>
					</div>
				</div>

				<div className="flex flex-col">
					<CardHeader className="gap-3">
						<div className="flex items-start justify-between gap-3">
							<div className="space-y-2">
								<div className="flex flex-wrap items-center gap-2">
									<Badge variant="secondary">#{index + 1}</Badge>
									<span className="text-xs uppercase tracking-[0.22em] text-stone-400">
										TBR
									</span>
								</div>
								<CardTitle className="text-2xl">{book.title}</CardTitle>
								<p className="text-sm text-stone-600">{book.author}</p>
							</div>
							<Badge className="bg-stone-950 px-3 text-white">
								{book.pages} pages
							</Badge>
						</div>
					</CardHeader>

					<CardContent className="pt-0">
						<CardDescription className="text-sm leading-6 text-stone-700 sm:text-[15px]">
							{book.description}
						</CardDescription>
					</CardContent>

					<CardFooter className="flex-col gap-2 sm:flex-row">
						<Button
							type="button"
							variant="default"
							onClick={() => onMove(index, -1)}
							disabled={isFirst}
							className="w-full sm:flex-1"
						>
							<ArrowUp className="size-4" />
							Move up
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => onMove(index, 1)}
							disabled={isLast}
							className="w-full sm:flex-1"
						>
							<ArrowDown className="size-4" />
							Move down
						</Button>
					</CardFooter>
				</div>
			</div>
		</Card>
	);
}
