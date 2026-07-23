import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { readingListItems, readingLists } from "@/db/schema";
import { ReadingListType } from "../../types";

export interface ReorderSingleItemInput {
	userId: string;
	listType: ReadingListType;
	bookId: string;
	abovePosition: number | null;
	belowPosition: number | null;
}

export async function reorderSingleItem(input: ReorderSingleItemInput) {
	let newPosition: number;

	// Case 1: Moved to the absolute top
	if (input.abovePosition === null && input.belowPosition !== null) {
		newPosition = input.belowPosition / 2;
	}
	// Case 2: Moved to the absolute bottom
	else if (input.abovePosition !== null && input.belowPosition === null) {
		newPosition = input.abovePosition + 1.0;
	}
	// Case 3: Placed between two existing items
	else if (input.abovePosition !== null && input.belowPosition !== null) {
		newPosition = (input.abovePosition + input.belowPosition) / 2;
	}
	// Case 4: Fallback case (e.g., list was empty or something went wrong)
	else {
		newPosition = 1.0;
	}

	// ONLY ONE UPDATE NEEDED: Using the subquery to discover the listId dynamically
	await db
		.update(readingListItems)
		.set({
			position: newPosition,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(readingListItems.bookId, input.bookId),
				// Subquery: dynamically looks up the single listId matching this user and list type
				inArray(
					readingListItems.listId,
					db
						.select({ id: readingLists.id })
						.from(readingLists)
						.where(
							and(
								eq(readingLists.userId, input.userId),
								eq(readingLists.type, input.listType),
							),
						),
				),
			),
		);

	return { success: true, position: newPosition };
}
