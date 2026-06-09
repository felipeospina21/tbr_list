import { z } from "zod";

import { READING_LIST_DEFINITIONS } from "../types/readingList";

const bookSourceSchema = z.enum(["google-books", "open-library"]);
const readingListSlugSchema = z.enum(
	READING_LIST_DEFINITIONS.map((definition) => definition.slug) as [
		string,
		...string[],
	],
);

export const bookSchema = z.object({
	id: z.string(),
	source: bookSourceSchema,
	sourceBookId: z.string(),
	isbn10: z.string().nullable(),
	isbn13: z.string().nullable(),
	title: z.string(),
	subtitle: z.string().nullable(),
	author: z.string(),
	pages: z.number().int().nullable(),
	language: z.string().nullable(),
	publishedYear: z.number().int().nullable(),
	publishedDate: z.string().nullable(),
	publisher: z.string().nullable(),
	averageRating: z.number().nullable(),
	ratingsCount: z.number().nullable(),
	description: z.string(),
	cover: z.string(),
	accent: z.string(),
	seriesName: z.string().nullable(),
	seriesPosition: z.string().nullable(),
	subjects: z.array(z.string()),
});

export const userBookRowSchema = bookSchema.extend({
	userId: z.string(),
	position: z.number().int(),
});

export const moveBookSchema = z.object({
	bookId: z.string(),
	direction: z.union([z.literal(-1), z.literal(1)]),
});

export { readingListSlugSchema };
