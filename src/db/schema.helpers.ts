import { timestamp } from "drizzle-orm/pg-core";

export const timeStamps = {
	createdAt: timestamp({ withTimezone: true, mode: "date" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp({ withTimezone: true, mode: "date" })
		.notNull()
		.defaultNow(),
} as const;
