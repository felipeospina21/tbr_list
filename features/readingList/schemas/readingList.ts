import { z } from "zod";

export const bookSchema = z.object({
	id: z.string(),
	title: z.string(),
	author: z.string(),
	pages: z.number().int().nullable(),
	description: z.string(),
	cover: z.string(),
	accent: z.string(),
});

export const moveBookSchema = z.object({
	bookId: z.string(),
	direction: z.union([z.literal(-1), z.literal(1)]),
});
