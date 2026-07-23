import {
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	real,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { timeStamps as timestamps } from "./schema.helpers";

export const readingListTypeEnum = pgEnum("reading_list_type", [
	"to_be_read",
	"reading",
	"finished",
	"did_not_finish",
]);

/* USERS */
export const users = pgTable("users", {
	id: text().primaryKey(),
	createdAt: timestamps.createdAt,
});

/* USER BOOK MOODS */
export const userBookMoods = pgTable(
	"user_book_moods",
	{
		userId: text()
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
			}),
		bookId: uuid()
			.notNull()
			.references(() => books.id, {
				onDelete: "cascade",
			}),
		mood: text().notNull(),
		createdAt: timestamps.createdAt,
	},
	(table) => [
		primaryKey({
			columns: [table.userId, table.bookId, table.mood],
		}),
		index("idx_user_book_moods_user_book").on(table.userId, table.bookId),
	],
);

/* USER READING SESSIONS */
export const userReadingSessions = pgTable(
	"user_reading_sessions",
	{
		id: uuid().primaryKey().defaultRandom(),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		bookId: uuid()
			.notNull()
			.references(() => books.id, { onDelete: "cascade" }),
		status: readingListTypeEnum().notNull(),

		// Nullable because they might not have started or finished yet
		addedToTbrAt: timestamp({ withTimezone: true, mode: "date" }),
		startedReadingAt: timestamp({ withTimezone: true, mode: "date" }),
		finishedAt: timestamp({ withTimezone: true, mode: "date" }),
		dnfAt: timestamp({ withTimezone: true, mode: "date" }),
	},
	(table) => [
		index("idx_reading_sessions_user_book").on(table.userId, table.bookId),
	],
);

/* BOOKS */
export const books = pgTable(
	"books",
	{
		id: uuid().primaryKey().defaultRandom(),
		canonicalId: integer().notNull(),
		title: text().notNull(),
		subtitle: text(),
		author: text().notNull(),
		pages: integer(),
		language: text(),
		publishedYear: integer(),
		publishedDate: text(),
		publisher: text(),
		description: text().notNull(),
		cover: text().notNull(),
		primarySource: text().notNull(),
		primarySourceBookId: text().notNull(),
		isbn10: text(),
		isbn13: text(),
		seriesName: text(),
		seriesPosition: integer(),
		seriesCount: integer(),
		...timestamps,
	},
	(table) => [
		unique("books_canonical_id_id").on(table.canonicalId),
		unique("books_source_book_key").on(
			table.primarySource,
			table.primarySourceBookId,
		),
		index("idx_books_isbn10").on(table.isbn10),
		index("idx_books_isbn13").on(table.isbn13),
		index("idx_books_source").on(
			table.primarySource,
			table.primarySourceBookId,
		),
	],
);

/* BOOK METRICS */
export const bookMetrics = pgTable(
	"book_metrics",
	{
		id: uuid().primaryKey().defaultRandom(),
		bookId: uuid()
			.notNull()
			.references(() => books.id, {
				onDelete: "cascade",
			}),
		source: text().notNull(),
		metricKey: text().notNull(),
		metricValueNumber: real(),
		metricValueText: text(),
		metricValueJson: jsonb(),
		...timestamps,
	},
	(table) => [
		unique("book_metrics_book_id_source_metric_key_key").on(
			table.bookId,
			table.source,
			table.metricKey,
		),
		index("idx_book_metrics_book_id").on(table.bookId),
		index("idx_book_metrics_key").on(table.metricKey),
	],
);

/* BOOK GENRES */
export const bookGenres = pgTable(
	"book_genres",
	{
		bookId: uuid()
			.notNull()
			.references(() => books.id, {
				onDelete: "cascade",
			}),
		genre: text().notNull(),
		createdAt: timestamps.createdAt,
	},
	(table) => [
		primaryKey({
			columns: [table.bookId, table.genre],
		}),
		index("idx_book_genres_genre").on(table.genre),
	],
);

/* BOOK MOODS */
export const bookMoods = pgTable(
	"book_moods",
	{
		bookId: uuid()
			.notNull()
			.references(() => books.id, {
				onDelete: "cascade",
			}),
		mood: text().notNull(),
		createdAt: timestamps.createdAt,
	},
	(table) => [
		primaryKey({
			columns: [table.bookId, table.mood],
		}),
		index("idx_book_moods_mood").on(table.mood),
	],
);

/* READING LISTS */
export const readingLists = pgTable(
	"reading_lists",
	{
		id: uuid().primaryKey().defaultRandom(),
		type: readingListTypeEnum().notNull(),
		name: text().notNull(),
		userId: text()
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
			}),
		...timestamps,
	},
	(table) => [unique().on(table.userId, table.type)],
);

/* READING LIST ITEMS */
export const readingListItems = pgTable(
	"reading_list_items",
	{
		id: uuid().primaryKey().defaultRandom(),
		listId: uuid()
			.notNull()
			.references(() => readingLists.id, {
				onDelete: "cascade",
			}),
		bookId: uuid()
			.notNull()
			.references(() => books.id, {
				onDelete: "restrict",
			}),
		position: real().notNull(),
		...timestamps,
	},
	(table) => [
		unique("reading_list_items_list_id_book_id_key").on(
			table.listId,
			table.bookId,
		),
		unique("reading_list_items_list_id_position_key").on(
			table.listId,
			table.position,
		),
		index("idx_list_items_list_position").on(table.listId, table.position),
	],
);

// /* AUTH ACCOUNTS */
// leaving commented for later implementation
//
// export const authAccounts = pgTable(
// 	"auth_accounts",
// 	{
// 		id: uuid().primaryKey().defaultRandom(),
// 		userId: uuid()
// 			.notNull()
// 			.references(() => users.id, { onDelete: "cascade" }),
// 		provider: text().notNull(),
// 		providerAccountId: text().notNull(),
// 		createdAt: timestamps.createdAt,
// 	},
// 	(table) => [
// 		unique("auth_accounts_provider_provider_account_id_key").on(
// 			table.provider,
// 			table.providerAccountId,
// 		),
// 		index("idx_auth_accounts_user_id").on(table.userId),
// 	],
// );
