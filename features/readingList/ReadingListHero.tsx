"use client";

import { Sparkles } from "lucide-react";

import { Badge } from "@/components/Badge";
import { Card, CardContent } from "@/components/Card";

type ReadingListHeroProps = {
	booksCount: number;
	pages: number;
};

export function ReadingListHero({ booksCount, pages }: ReadingListHeroProps) {
	return (
		<div className="max-w-2xl">
			<div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.34em] text-white/55">
				<Sparkles className="size-4 text-amber-200/90" />
				<Badge
					className="border-white/10 bg-white/6 text-white/82"
					variant="secondary"
				>
					Reading List
				</Badge>
			</div>

			<h1 className="mt-6 max-w-[11ch] text-5xl leading-[0.9] tracking-[-0.04em] text-balance sm:text-6xl lg:text-[5.25rem]">
				Your reading queue, staged for action.
			</h1>

			<p className="mt-5 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
				Search, add, and reorder your books in a focused workspace. The reading
				list stays real and interactive, but the surface feels quiet and
				intentional.
			</p>

			<div className="mt-8 grid gap-3 sm:grid-cols-3">
				{[
					{ label: "Books", value: booksCount.toString() },
					{ label: "Pages", value: pages.toString() },
				].map((stat) => (
					<Card
						key={stat.label}
						className="border-white/10 bg-white/[0.04] text-white shadow-none"
					>
						<CardContent className="p-4">
							<p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/48">
								{stat.label}
							</p>
							<p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
								{stat.value}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
