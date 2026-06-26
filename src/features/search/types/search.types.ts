import { Book } from "@/lib/book";

export type SearchBook = Book & {
	bookId: number;
	moods: string[];
	provider: "Google Books" | "Hardcover" | "Open Library";
};
