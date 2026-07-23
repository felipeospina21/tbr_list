export type HardcoverEdition = {
	id?: string | number;
	book_id: number;
	title?: string;
	subtitle?: string | null;
	isbn_10?: string | null;
	isbn_13?: string | null;
	pages?: number | null;
	release_date?: string | null;
	release_year?: number | null;
	language?: {
		language?: string | null;
	} | null;
	publisher?: {
		name?: string | null;
	} | null;
	image?: {
		url?: string | null;
	} | null;
};

export type HardcoverBookDocument = {
	id?: string | number;
	title?: string;
	subtitle?: string;
	author_names?: string[];
	description?: string;
	pages?: number;
	release_year?: number;
	release_date?: string;
	rating?: number;
	ratings_count?: number;
	image?: {
		url?: string;
	};
	isbns?: string[];
	moods?: string[];
	genres?: string[];
	tags?: string[];
	series_names?: string[];
	featured_series_position?: number;
	featured_series?: {
		position?: number;
		details?: string;
		series?: {
			name?: string;
			primary_books_count?: number;
		};
	};
};

export type HardcoverSearchHighlight = {
	alternative_titles?: Array<{
		matched_tokens?: string[];
		snippet?: string;
	}>;
};

export type HardcoverSearchHighlightMatch = {
	field?: string;
	snippets?: string[];
	matched_tokens: string[];
};
