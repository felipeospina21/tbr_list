import { readingLists, users } from "@/db/schema";
import { db } from "./drizzle";

export async function initializeUserAccount(userId: string) {
	try {
		await db.transaction(async (tx) => {
			await tx
				.insert(users)
				.values({ id: userId, createdAt: new Date() })
				.onConflictDoNothing();

			await tx
				.insert(readingLists)
				.values([
					{ userId, type: "to_be_read", name: "To Be Read" },
					{ userId, type: "reading", name: "Currently Reading" },
					{ userId, type: "finished", name: "Finished" },
					{ userId, type: "did_not_finish", name: "Did Not Finish" },
				])
				.onConflictDoNothing();
		});

		console.log(
			`Successfully initialized profile and lists for user: ${userId}`,
		);
	} catch (error) {
		console.error(`Failed to initialize user ${userId}:`, error);
		throw error;
	}
}
