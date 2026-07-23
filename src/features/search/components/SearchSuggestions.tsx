import { CheckCircle, Plus } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { useAddBookToReadingList } from "@/features/readingList/api/useAddBookToReadingList";
import { useFetchReadingList } from "@/features/readingList/api/useFetchReadingList";
import { cn } from "@/lib/utils";
import { T } from "@/tokens";
import { SearchBook } from "../types/search.types";

interface SearchSuggestionsProps {
	query: string;
	books: SearchBook[] | undefined;
	isPending: boolean;
}

export const SearchSuggestions: FC<SearchSuggestionsProps> = ({
	query,
	books,
	isPending,
}) => {
	const readingListQuery = useFetchReadingList("to_be_read");
	const addBookMutation = useAddBookToReadingList();

	const isEmpty = !query && (!books || !books.length);
	const isFetching = addBookMutation.isPending || readingListQuery.isFetching;

	const addedBooks = readingListQuery.data?.items.books.map((book) => ({
		id: book.canonicalId,
		isbn10: book.isbn10,
		isbn13: book.isbn13,
	}));

	const addBook = (book: SearchBook) => {
		addBookMutation.mutate({ book, type: "to_be_read" });
	};

	const isBookAdded = (book: SearchBook) => {
		return addedBooks?.some((addedBook) => {
			return (
				addedBook.id === Number(book.sourceBookId) ||
				addedBook.isbn10 === book.isbn10 ||
				addedBook.isbn13 === book.isbn13
			);
		});
	};

	return (
		<div
			className={cn(
				"flex-1 overflow-y-auto px-4 pt-4 pb-2",
				isPending ? "opacity-50 transition-opacity" : "",
			)}
		>
			{isEmpty && (
				<p
					className="font-nunito text-xs font-semibold mb-3 uppercase tracking-widest"
					style={{ color: T.stoneLight }}
				>
					Suggested Reads
				</p>
			)}
			<div className="flex flex-col gap-2.5">
				{books?.map((book) => {
					const variables = addBookMutation.variables;
					const isBookBeingAdded =
						variables?.book.sourceBookId === book.sourceBookId;
					const ButtonIcon = isBookAdded(book) ? (
						<CheckCircle size={15} />
					) : (
						<Plus size={15} />
					);

					return (
						<div
							key={book.sourceBookId}
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
								<Image
									src={book.cover}
									alt={book.title}
									className="w-full h-full object-cover"
									width={100}
									height={150}
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
										{book.genres[0]}
									</span>
								</div>
							</div>
							<div className="flex items-center pr-3">
								<button
									className="flex items-center justify-center w-9 h-9 rounded-full transition-all active:scale-90"
									style={{
										backgroundColor: T.amber,
										color: T.night,
									}}
									onClick={() => addBook(book)}
								>
									{isFetching && isBookBeingAdded ? <Spinner /> : ButtonIcon}
								</button>
							</div>
						</div>
					);
				})}
				{books?.length === 0 && query.length > 1 && (
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
