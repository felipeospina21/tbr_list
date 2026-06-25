import { eq, sql } from "drizzle-orm";
import { readingLists, readingListItems } from "@/db/schema"; // Adjust paths to your schema
import { db } from "@/db/drizzle";
import { ReadingListType } from "../../types";

export type GetReadingListCounts = Record<ReadingListType, number>;

export async function getReadingListCounts(userId: string) {
	// 1. Run the group-by query
	const results = await db
		.select({
			type: readingLists.type,
			count: sql<number>`count(${readingListItems.id})`.mapWith(Number),
		})
		.from(readingLists)
		.leftJoin(readingListItems, eq(readingLists.id, readingListItems.listId))
		.where(eq(readingLists.userId, userId))
		.groupBy(readingLists.type);

	// 2. Transform the array [{ type: 'to_be_read', count: 6 }] into an object
	const counts = results.reduce((acc, row) => {
		if (row.type) {
			acc[row.type] = row.count;
		}
		return acc;
	}, {} as GetReadingListCounts);

	return counts;
}
