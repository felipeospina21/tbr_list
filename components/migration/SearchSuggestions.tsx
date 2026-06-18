import { CheckCircle, Plus } from "lucide-react";
import { FC, useState } from "react";
import { T } from "./constants";
import { Book } from "./types";
import { SearchBook } from "@/f";

interface SearchSuggestionsProps {
	query: string;
	books: SearchBook[] | undefined;
}

export const SearchSuggestions: FC<SearchSuggestionsProps> = ({
	query,
	books,
}) => {
	const [added, setAdded] = useState<Set<string>>(new Set());

	if (!books || !books.length) {
		return <div>no books</div>;
	}

	const addBook = (book: Book) => {
		if (!books.find((b) => b.id === book.id)) {
			setAdded((prev) => new Set([...prev, book.id]));
		}
	};

	return (
		<div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
			{!query && (
				<p
					className="font-nunito text-xs font-semibold mb-3 uppercase tracking-widest"
					style={{ color: T.stoneLight }}
				>
					Suggested Reads
				</p>
			)}
			<div className="flex flex-col gap-2.5">
				{books.map((book) => {
					const inLibrary = !!books.find((b) => b.id === book.id);
					return (
						<div
							key={book.id}
							className="flex items-stretch rounded-xl overflow-hidden"
							style={{
								backgroundColor: T.surfaceRaised,
								border: `1px solid ${T.stone}`,
							}}
						>
							<div
								className="flex-shrink-0"
								style={{ width: 68, minHeight: 104 }}
							>
								<img
									src={book.cover}
									alt={book.title}
									className="w-full h-full object-cover"
									style={{ minHeight: 104 }}
								/>
							</div>
							<div className="flex-1 py-3 px-3 flex flex-col justify-between min-w-0">
								<div>
									<p
										className="font-lora text-sm font-semibold leading-tight line-clamp-2"
										style={{ color: T.paper }}
									>
										{book.title}
									</p>
									<p
										className="font-nunito text-xs mt-0.5"
										style={{ color: T.paperDim }}
									>
										{book.author} · {book.publishedYear}
									</p>
									<span
										className="inline-block font-nunito text-xs px-2 py-0.5 rounded-full mt-1.5"
										style={{ backgroundColor: T.stone, color: T.paperDim }}
									>
										{book.subjects[0]}
									</span>
								</div>
							</div>
							<div className="flex items-center pr-3">
								<button
									className="flex items-center justify-center w-9 h-9 rounded-full transition-all active:scale-90"
									style={{
										backgroundColor: inLibrary ? T.stone : T.amber,
										color: inLibrary ? T.paperDim : T.night,
									}}
									onClick={() => !inLibrary && addBook(book)}
									disabled={inLibrary}
								>
									{inLibrary ? <CheckCircle size={15} /> : <Plus size={15} />}
								</button>
							</div>
						</div>
					);
				})}
				{results.length === 0 && query.length > 1 && (
					<div className="text-center py-12">
						<p className="font-lora text-base" style={{ color: T.paperDim }}>
							No results found
						</p>
						<p
							className="font-nunito text-sm mt-1"
							style={{ color: T.stoneLight }}
						>
							Try a different title or author
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
