"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

type SearchBooksToolbarProps = {
	query: string;
	onQueryChange: (query: string) => void;
};

export function SearchBooksToolbar({
	query,
	onQueryChange,
}: SearchBooksToolbarProps) {
	const canClear = query.trim().length > 0;

	return (
		<div className="flex flex-col gap-3 sm:flex-row">
			<div className="relative flex-1">
				<Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/35" />
				<Input
					value={query}
					onChange={(event) => onQueryChange(event.target.value)}
					placeholder="Search by title or author"
					className="border-white/10 bg-white/[0.05] pl-11 text-white placeholder:text-white/38 focus:border-amber-200 focus:ring-amber-200/20"
				/>
			</div>
			<Button
				type="button"
				variant="outline"
				onClick={() => onQueryChange("")}
				disabled={!canClear}
				className="border-white/10 bg-white/6 text-white hover:bg-white/10"
			>
				<X className="size-4" />
				Clear
			</Button>
		</div>
	);
}
