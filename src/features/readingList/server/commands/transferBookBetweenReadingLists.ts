import { eq, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import {
	books,
	readingListItems,
	readingLists,
} from "@/db/schema";
import { ReadingListType } from "@/features/readingList/types";
import { ReadingListNotFoundError } from "@/lib/errors/ReadingListNotFoundError";
import { countBookReferences } from "./countBookReferences";
import { upsertUserReadingSession } from "./upsertUserReadingSession";

export interface TransferBookBetweenReadingListsInput {
	userId: string;
	bookId: string;
	sourceListType: ReadingListType;
	targetListType: ReadingListType;
}

export interface TransferBookBetweenReadingListsResult {
	bookId: string;
	sourceListType: ReadingListType;
	targetListType: ReadingListType;
}

function buildSessionUpdate(targetListType: ReadingListType) {
	const now = new Date();

	return {
		status: targetListType,
		addedToTbrAt: targetListType === "to_be_read" ? now : null,
		startedReadingAt: targetListType === "reading" ? now : null,
		finishedAt: targetListType === "finished" ? now : null,
		dnfAt: targetListType === "did_not_finish" ? now : null,
	};
}

export async function transferBookBetweenReadingLists(
	input: TransferBookBetweenReadingListsInput,
): Promise<TransferBookBetweenReadingListsResult> {
	return db.transaction(async (tx) => {
		const [sourceList, targetList] = await Promise.all([
			tx.query.readingLists.findFirst({
				where: (lists, { and, eq }) =>
					and(eq(lists.userId, input.userId), eq(lists.type, input.sourceListType)),
			}),
			tx.query.readingLists.findFirst({
				where: (lists, { and, eq }) =>
					and(eq(lists.userId, input.userId), eq(lists.type, input.targetListType)),
			}),
		]);

		if (!sourceList || !targetList) {
			throw new ReadingListNotFoundError();
		}

		const sourceItem = await tx.query.readingListItems.findFirst({
			where: (items, { and, eq }) =>
				and(eq(items.listId, sourceList.id), eq(items.bookId, input.bookId)),
		});

		if (!sourceItem) {
			throw new Error("Book not found in the source reading list.");
		}

		const targetItem = await tx.query.readingListItems.findFirst({
			where: (items, { and, eq }) =>
				and(eq(items.listId, targetList.id), eq(items.bookId, input.bookId)),
		});

		await tx.delete(readingListItems).where(eq(readingListItems.id, sourceItem.id));

		const [positionResult] = await tx
			.select({
				maxPosition: sql<number>`COALESCE(MAX(${readingListItems.position}), 0)`,
			})
			.from(readingListItems)
			.where(eq(readingListItems.listId, targetList.id));

		const nextPosition = (positionResult?.maxPosition ?? 0) + 1.0;

		if (targetItem) {
			await tx
				.update(readingListItems)
				.set({
					position: nextPosition,
					updatedAt: new Date(),
				})
				.where(eq(readingListItems.id, targetItem.id));
		} else {
			await tx.insert(readingListItems).values({
				id: crypto.randomUUID(),
				listId: targetList.id,
				bookId: input.bookId,
				position: nextPosition,
			});
		}

		const sessionUpdate = buildSessionUpdate(input.targetListType);

		await upsertUserReadingSession(
			{
				userId: input.userId,
				bookId: input.bookId,
				...sessionUpdate,
			},
			tx,
		);

		const references = await countBookReferences(input.bookId, tx);
		const remainingReferences =
			references.readingListItemRefs +
			references.readingSessionRefs +
			references.userBookMoodRefs;

		if (remainingReferences === 0) {
			await tx.delete(books).where(eq(books.id, input.bookId));
		}

		return {
			bookId: input.bookId,
			sourceListType: input.sourceListType,
			targetListType: input.targetListType,
		};
	});
}
