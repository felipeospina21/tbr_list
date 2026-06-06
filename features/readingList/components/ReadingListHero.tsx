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
