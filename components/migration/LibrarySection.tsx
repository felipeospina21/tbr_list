"use client";
import { useState } from "react";
import { useFetchReadingList } from "@/features/readingList/api/useFetchReadingList";
import { BookListActions } from "./BookListActions";
import { BooksList } from "./BooksList";
import { Shelves } from "./Shelves";
import { Book, ShelfKey } from "./types";

export const LibrarySection = ({ books }: { books: Book[] }) => {
	const [activeShelf, setActiveShelf] = useState<ShelfKey>("reading");
	const [optionsBook, setOptionsBook] = useState<Book | null>(null);

	const toBeReadQuery = useFetchReadingList("to_be_read");

	if (toBeReadQuery.isLoading) {
		return <div>loading</div>;
	}

	return (
		<div className="flex flex-col h-full">
			{/* Shelf selector — minimal pill row */}
			<Shelves
				activeShelf={activeShelf}
				books={toBeReadQuery.data?.books}
				setActiveShelf={setActiveShelf}
			/>

			{/* <BooksList */}
			{/* 	books={toBeReadQuery.data?.books} */}
			{/* 	setBooks={setBooks} */}
			{/* 	activeShelf={activeShelf} */}
			{/* 	setOptionsBook={setOptionsBook} */}
			{/* /> */}
			{/**/}
			{/* <BookListActions */}
			{/* 	books={toBeReadQuery.data?.books} */}
			{/* 	optionsBook={optionsBook} */}
			{/* 	setBooks={setBooks} */}
			{/* 	setOptionsBook={setOptionsBook} */}
			{/* /> */}
		</div>
	);
};
