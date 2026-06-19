export type ShelfKey = "tbr" | "reading" | "dnf";

export type Book = {
	id: string;
	title: string;
	author: string;
	img_url: string;
	genre: string;
	pages: number;
	pagesRead?: number;
	rating?: number;
	mood?: string[];
	year: number;
	shelf: ShelfKey;
};
