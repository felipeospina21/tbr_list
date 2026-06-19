import { db } from "./drizzle";
import { users, readingLists } from "@/db/schema";

export async function initializeUserAccount(userId: string) {
	try {
		await db
			.insert(users)
			.values({ id: userId, createdAt: new Date() })
			.onConflictDoNothing();

		await db
			.insert(readingLists)
			.values([
				{ userId, type: "to_be_read", name: "To Be Read" },
				{ userId, type: "reading", name: "Currently Reading" },
				{ userId, type: "finished", name: "Finished" },
				{ userId, type: "did_not_finish", name: "Did Not Finish" },
			])
			.onConflictDoNothing();

		console.log(
			`Successfully initialized profile and lists for user: ${userId}`,
		);
	} catch (error) {
		console.error(`Failed to initialize user ${userId}:`, error);
		throw error;
	}
}
