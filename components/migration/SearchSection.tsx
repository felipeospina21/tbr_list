"use client";
import { CheckCircle, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { T } from "./constants";
import { SearchSuggestions } from "./SearchSuggestions";
import { Book } from "./types";

export const SearchSection = ({
	books,
	// setBooks,
}: {
	books: Book[];
	// setBooks: (b: Book[]) => void;
}) => {
	const [query, setQuery] = useState("");

	return (
		<div className="flex flex-col h-full">
			{/* Search input */}
			<div className="px-4 pt-4">
				<div
					className="flex items-center gap-2 px-3 py-3 rounded-xl"
					style={{
						backgroundColor: T.surfaceRaised,
						border: `1px solid ${T.stone}`,
					}}
				>
					<Search size={16} style={{ color: T.amber }} />
					<input
						type="text"
						placeholder="Search by title or author…"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="flex-1 bg-transparent text-sm font-nunito outline-none placeholder:opacity-40"
						style={{ color: T.paper }}
					/>
					{query && (
						<button
							onClick={() => setQuery("")}
							style={{ color: T.stoneLight }}
						>
							<X size={15} />
						</button>
					)}
				</div>
			</div>

			{/* <SearchSuggestions query={query} books={books} setBooks={setBooks} /> */}
		</div>
	);
};
