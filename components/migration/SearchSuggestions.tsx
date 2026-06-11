import { CheckCircle, Plus } from "lucide-react";
import { FC, useState } from "react";
import { T } from "./constants";
import { Book } from "./types";

const SEARCH_SUGGESTIONS: Book[] = [
	{
		id: "s1",
		title: "Tomorrow, and Tomorrow, and Tomorrow",
		author: "Gabrielle Zevin",
		img_url:
			"https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_eff539b6eb_44a70fdcecbb0e24.png",
		genre: "Literary Fiction",
		pages: 480,
		mood: ["hopeful", "contemplative"],
		year: 2022,
		shelf: "tbr",
	},
	{
		id: "s2",
		title: "Intermezzo",
		author: "Sally Rooney",
		img_url:
			"https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_bc1f433cc6_8df5dac29d4c10e6.png",
		genre: "Literary Fiction",
		pages: 448,
		mood: ["melancholic", "contemplative"],
		year: 2024,
		shelf: "tbr",
	},
	{
		id: "s3",
		title: "The Women",
		author: "Kristin Hannah",
		img_url:
			"https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_3d0646b6b5_ed493411703f703e.png",
		genre: "Historical Fiction",
		pages: 480,
		mood: ["tense", "hopeful"],
		year: 2024,
		shelf: "tbr",
	},
];

interface SearchSuggestionsProps {
	query: string;
	books: Book[];
	setBooks: (b: Book[]) => void;
}

export const SearchSuggestions: FC<SearchSuggestionsProps> = ({
	query,
	books,
	setBooks,
}) => {
	const [added, setAdded] = useState<Set<string>>(new Set());

	const addBook = (book: Book) => {
		if (!books.find((b) => b.id === book.id)) {
			setBooks([...books, { ...book, shelf: "tbr" }]);
			setAdded((prev) => new Set([...prev, book.id]));
		}
	};

	const allBooks = [...books, ...SEARCH_SUGGESTIONS];

	const results =
		query.length > 1
			? allBooks.filter(
					(b) =>
						b.title.toLowerCase().includes(query.toLowerCase()) ||
						b.author.toLowerCase().includes(query.toLowerCase()),
				)
			: SEARCH_SUGGESTIONS.filter((s) => !books.find((b) => b.id === s.id));
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
				{results.map((book) => {
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
									src={book.img_url}
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
										{book.author} · {book.year}
									</p>
									<span
										className="inline-block font-nunito text-xs px-2 py-0.5 rounded-full mt-1.5"
										style={{ backgroundColor: T.stone, color: T.paperDim }}
									>
										{book.genre}
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
