import { z } from "zod";

import { READING_LIST_DEFINITIONS } from "../types/readingList";

const bookSourceSchema = z.enum(["google-books", "hardcover", "open-library"]);
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
	moods: z.array(z.string()),
	subjects: z.array(z.string()),
});

export const userBookRowSchema = bookSchema.extend({
	userId: z.string(),
	position: z.number().int(),
});

export const moveBookSchema = z.object({
	bookId: z.string(),
	targetIndex: z.number().int().nonnegative(),
});

export const removeBookSchema = z.object({
	bookId: z.string(),
});

export const transferBookSchema = z.object({
	bookId: z.string(),
	sourceListSlug: readingListSlugSchema,
	targetListSlug: readingListSlugSchema,
});

export const updateBookMoodsSchema = z.object({
	bookId: z.string(),
	moods: z.array(z.string().trim().min(1)).max(12),
});

export { readingListSlugSchema };
