import { eq } from "drizzle-orm";

import { DbClient, db } from "@/db/drizzle";
import { userReadingSessions } from "@/db/schema";
import { ReadingListType } from "@/features/readingList/types";

export interface UpsertUserReadingSessionInput {
	userId: string;
	bookId: string;
	status: ReadingListType;
	addedToTbrAt?: Date | null;
	startedReadingAt?: Date | null;
	finishedAt?: Date | null;
	dnfAt?: Date | null;
}

export async function upsertUserReadingSession(
	input: UpsertUserReadingSessionInput,
	tx: DbClient = db,
) {
	const existingSession = await tx.query.userReadingSessions.findFirst({
		where: (sessions, { and, eq }) =>
			and(eq(sessions.userId, input.userId), eq(sessions.bookId, input.bookId)),
	});

	const values = {
		userId: input.userId,
		bookId: input.bookId,
		status: input.status,
		...(input.addedToTbrAt !== undefined && {
			addedToTbrAt: input.addedToTbrAt,
		}),
		...(input.startedReadingAt !== undefined && {
			startedReadingAt: input.startedReadingAt,
		}),
		...(input.finishedAt !== undefined && {
			finishedAt: input.finishedAt,
		}),
		...(input.dnfAt !== undefined && {
			dnfAt: input.dnfAt,
		}),
	};

	if (existingSession) {
		await tx
			.update(userReadingSessions)
			.set(values)
			.where(eq(userReadingSessions.id, existingSession.id));
		return;
	}

	await tx.insert(userReadingSessions).values(values);
}
