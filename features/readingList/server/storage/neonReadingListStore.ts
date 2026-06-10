import "server-only";

import { randomUUID } from "node:crypto";

import { neon } from "@neondatabase/serverless";

import {
	type Book,
	DEFAULT_READING_LIST_SLUG,
	READING_LIST_DEFINITIONS,
	type ReadingListSlug,
	type ReadingListSnapshot,
	type ReadingListSummary,
	totalPages,
} from "../../types/readingList";
import {
	buildBookIdentityKey,
	getBookIdentifierKeys,
} from "../../utils/bookIdentity";
import { buildBookArt } from "../bookArt";
import type { ReadingListStore } from "./readingListStore";

const DATABASE_URL =
	process.env.DATABASE_URL ??
	process.env.POSTGRES_URL_NON_POOLING ??
	process.env.POSTGRES_URL ??
	process.env.NEON_DATABASE_URL;

const TABLES = {
	users: "users",
	authAccounts: "auth_accounts",
	readingLists: "reading_lists",
	books: "books",
	bookIdentifiers: "book_identifiers",
	bookSubjects: "book_subjects",
	bookMetrics: "book_metrics",
	listItems: "reading_list_items",
} as const;

let storePromise: Promise<ReadingListStore> | null = null;
let sqlClient: ReturnType<typeof neon> | null = null;

type AuthAccountRow = {
	userId: string;
};

type ReadingListRow = {
	id: string;
	slug: string;
	name: string;
	isDefault: number;
};

type ReadingListCatalogRow = ReadingListRow & {
	booksCount: number;
};

type StoredBookRow = {
	id: string;
	canonicalKey: string;
	source: Book["source"];
	sourceBookId: string;
	isbn10: string | null;
	isbn13: string | null;
	title: string;
	subtitle: string | null;
	author: string;
	pages: number | null;
	language: string | null;
	publishedYear: number | null;
	publishedDate: string | null;
	publisher: string | null;
	description: string;
	cover: string;
	seriesName: string | null;
	seriesPosition: string | null;
};

type ListBookRow = Omit<StoredBookRow, "id"> & {
	bookId: string;
	position: number;
};

type BookSubjectRow = {
	bookId: string;
	subject: string;
};

type BookMetricRow = {
	bookId: string;
	source: string;
	metricKey: string;
	metricValueNumber: number | null;
};

type BookMetrics = {
	averageRating: number | null;
	ratingsCount: number | null;
};

export function getReadingListStore() {
	storePromise ??= createNeonReadingListStore();

	return storePromise;
}

async function createNeonReadingListStore(): Promise<ReadingListStore> {
	const store = new NeonReadingListStore(getSqlClient());

	await store.initialize();

	return store;
}

function getSqlClient() {
	if (!DATABASE_URL) {
		throw new Error(
			"Missing database connection string. Set DATABASE_URL for Neon.",
		);
	}

	sqlClient ??= neon(DATABASE_URL);

	return sqlClient;
}

function parseAuthSubject(authSubject: string) {
	const separatorIndex = authSubject.indexOf(":");

	if (separatorIndex < 0) {
		return {
			provider: "unknown",
			providerAccountId: authSubject,
		};
	}

	return {
		provider: authSubject.slice(0, separatorIndex),
		providerAccountId: authSubject.slice(separatorIndex + 1),
	};
}

function normalizeSubjects(subjects: readonly string[]) {
	return [
		...new Set(subjects.map((subject) => subject.trim()).filter(Boolean)),
	];
}

function toBookFromRow(
	row: ListBookRow,
	subjects: string[],
	metrics: BookMetrics,
): Book {
	const art = buildBookArt(row.title);

	return {
		id: row.canonicalKey,
		source: row.source,
		sourceBookId: row.sourceBookId,
		isbn10: row.isbn10,
		isbn13: row.isbn13,
		title: row.title,
		subtitle: row.subtitle,
		author: row.author,
		pages: row.pages,
		language: row.language,
		publishedYear: row.publishedYear,
		publishedDate: row.publishedDate,
		publisher: row.publisher,
		averageRating: metrics.averageRating,
		ratingsCount: metrics.ratingsCount,
		description: row.description,
		cover: row.cover,
		accent: art.accent,
		seriesName: row.seriesName,
		seriesPosition: row.seriesPosition,
		subjects,
	};
}

function toReadingListSummary(row: ReadingListCatalogRow): ReadingListSummary {
	const slug = normalizeReadingListSlug(row.slug);

	return {
		slug,
		name: row.name,
		isDefault: row.isDefault === 1,
		booksCount: row.booksCount,
	};
}

function normalizeReadingListSlug(slug: string): ReadingListSlug {
	if (slug === "default") {
		return DEFAULT_READING_LIST_SLUG;
	}

	const matchingDefinition = READING_LIST_DEFINITIONS.find(
		(definition) => definition.slug === slug,
	);

	return matchingDefinition?.slug ?? DEFAULT_READING_LIST_SLUG;
}

function getReadingListDefinition(slug: ReadingListSlug) {
	return (
		READING_LIST_DEFINITIONS.find((definition) => definition.slug === slug) ??
		READING_LIST_DEFINITIONS[0]
	);
}

class NeonReadingListStore implements ReadingListStore {
	constructor(private readonly sql: ReturnType<typeof neon>) {}

	async initialize() {
		await this.sql`
			CREATE TABLE IF NOT EXISTS ${this.sql.unsafe(TABLES.users)} (
				id TEXT PRIMARY KEY,
				created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
			);
		`;

		await this.sql`
			CREATE TABLE IF NOT EXISTS ${this.sql.unsafe(TABLES.authAccounts)} (
				id TEXT PRIMARY KEY,
				user_id TEXT NOT NULL REFERENCES ${this.sql.unsafe(TABLES.users)}(id) ON DELETE CASCADE,
				provider TEXT NOT NULL,
				provider_account_id TEXT NOT NULL,
				created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
				UNIQUE (provider, provider_account_id)
			);
		`;

		await this.sql`
			CREATE INDEX IF NOT EXISTS idx_auth_accounts_user_id
			ON ${this.sql.unsafe(TABLES.authAccounts)}(user_id);
		`;

		await this.sql`
			CREATE TABLE IF NOT EXISTS ${this.sql.unsafe(TABLES.readingLists)} (
				id TEXT PRIMARY KEY,
				user_id TEXT NOT NULL REFERENCES ${this.sql.unsafe(TABLES.users)}(id) ON DELETE CASCADE,
				name TEXT NOT NULL,
				slug TEXT NOT NULL,
				is_default INTEGER NOT NULL DEFAULT 0,
				created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
				UNIQUE (user_id, slug)
			);
		`;

		await this.sql`
			CREATE UNIQUE INDEX IF NOT EXISTS idx_reading_lists_default_list
			ON ${this.sql.unsafe(TABLES.readingLists)}(user_id)
			WHERE is_default = 1;
		`;

		await this.sql`
			CREATE TABLE IF NOT EXISTS ${this.sql.unsafe(TABLES.books)} (
				id TEXT PRIMARY KEY,
				canonical_key TEXT NOT NULL UNIQUE,
				title TEXT NOT NULL,
				subtitle TEXT,
				author TEXT NOT NULL,
				pages INTEGER,
				language TEXT,
				published_year INTEGER,
				published_date TEXT,
				publisher TEXT,
				description TEXT NOT NULL,
				cover TEXT NOT NULL,
				primary_source TEXT NOT NULL,
				primary_source_book_id TEXT NOT NULL,
				isbn10 TEXT,
				isbn13 TEXT,
				series_name TEXT,
				series_position TEXT,
				created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
			);
		`;

		await this.sql`
			CREATE INDEX IF NOT EXISTS idx_books_source
			ON ${this.sql.unsafe(TABLES.books)}(primary_source, primary_source_book_id);
		`;

		await this.sql`
			CREATE INDEX IF NOT EXISTS idx_books_isbn10
			ON ${this.sql.unsafe(TABLES.books)}(isbn10)
			WHERE isbn10 IS NOT NULL;
		`;

		await this.sql`
			CREATE INDEX IF NOT EXISTS idx_books_isbn13
			ON ${this.sql.unsafe(TABLES.books)}(isbn13)
			WHERE isbn13 IS NOT NULL;
		`;

		await this.sql`
			CREATE TABLE IF NOT EXISTS ${this.sql.unsafe(TABLES.bookIdentifiers)} (
				id TEXT PRIMARY KEY,
				book_id TEXT NOT NULL REFERENCES ${this.sql.unsafe(TABLES.books)}(id) ON DELETE CASCADE,
				identifier TEXT NOT NULL UNIQUE,
				identifier_type TEXT NOT NULL,
				created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
			);
		`;

		await this.sql`
			CREATE INDEX IF NOT EXISTS idx_book_identifiers_book_id
			ON ${this.sql.unsafe(TABLES.bookIdentifiers)}(book_id);
		`;

		await this.sql`
			CREATE TABLE IF NOT EXISTS ${this.sql.unsafe(TABLES.bookSubjects)} (
				id TEXT PRIMARY KEY,
				book_id TEXT NOT NULL REFERENCES ${this.sql.unsafe(TABLES.books)}(id) ON DELETE CASCADE,
				subject TEXT NOT NULL,
				created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
				UNIQUE (book_id, subject)
			);
		`;

		await this.sql`
			CREATE INDEX IF NOT EXISTS idx_book_subjects_book_id
			ON ${this.sql.unsafe(TABLES.bookSubjects)}(book_id);
		`;

		await this.sql`
			CREATE INDEX IF NOT EXISTS idx_book_subjects_subject
			ON ${this.sql.unsafe(TABLES.bookSubjects)}(subject);
		`;

		await this.sql`
			CREATE TABLE IF NOT EXISTS ${this.sql.unsafe(TABLES.bookMetrics)} (
				id TEXT PRIMARY KEY,
				book_id TEXT NOT NULL REFERENCES ${this.sql.unsafe(TABLES.books)}(id) ON DELETE CASCADE,
				source TEXT NOT NULL,
				metric_key TEXT NOT NULL,
				metric_value_number REAL,
				metric_value_text TEXT,
				metric_value_json TEXT,
				created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
				UNIQUE (book_id, source, metric_key)
			);
		`;

		await this.sql`
			CREATE INDEX IF NOT EXISTS idx_book_metrics_book_id
			ON ${this.sql.unsafe(TABLES.bookMetrics)}(book_id);
		`;

		await this.sql`
			CREATE INDEX IF NOT EXISTS idx_book_metrics_key
			ON ${this.sql.unsafe(TABLES.bookMetrics)}(metric_key);
		`;

		await this.sql`
			CREATE TABLE IF NOT EXISTS ${this.sql.unsafe(TABLES.listItems)} (
				id TEXT PRIMARY KEY,
				list_id TEXT NOT NULL REFERENCES ${this.sql.unsafe(TABLES.readingLists)}(id) ON DELETE CASCADE,
				book_id TEXT NOT NULL REFERENCES ${this.sql.unsafe(TABLES.books)}(id) ON DELETE RESTRICT,
				position INTEGER NOT NULL,
				created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
				UNIQUE (list_id, book_id),
				UNIQUE (list_id, position)
			);
		`;

		await this.sql`
			CREATE INDEX IF NOT EXISTS idx_list_items_list_position
			ON ${this.sql.unsafe(TABLES.listItems)}(list_id, position);
		`;
	}

	async getBooks(
		authSubject: string,
		listSlug?: ReadingListSlug,
	): Promise<ReadingListSnapshot> {
		const { listId, activeListSlug } = await this.resolveReadingListContext(
			authSubject,
			listSlug,
		);
		const books = await this.selectBooks(listId);

		return {
			activeListSlug,
			books,
			pages: totalPages(books),
		};
	}

	async addBook(
		authSubject: string,
		book: Book,
		listSlug?: ReadingListSlug,
	): Promise<ReadingListSnapshot> {
		const { listId, activeListSlug } = await this.resolveReadingListContext(
			authSubject,
			listSlug,
		);
		const storedBook = await this.resolveBook(book);
		const nextPosition = await this.getNextPosition(listId);

		await this.sql`
			INSERT INTO ${this.sql.unsafe(TABLES.listItems)} (
				id, list_id, book_id, position
			)
			VALUES (
				${randomUUID()},
				${listId},
				${storedBook.id},
				${nextPosition}
			)
			ON CONFLICT (list_id, book_id) DO NOTHING
		`;

		const books = await this.selectBooks(listId);

		return {
			activeListSlug,
			books,
			pages: totalPages(books),
		};
	}

	async moveBook(
		authSubject: string,
		bookId: string,
		direction: -1 | 1,
		listSlug?: ReadingListSlug,
	): Promise<ReadingListSnapshot> {
		const { listId, activeListSlug } = await this.resolveReadingListContext(
			authSubject,
			listSlug,
		);
		const books = await this.selectBooksWithInternalIds(listId);
		const currentIndex = books.findIndex(
			(book) => book.canonicalKey === bookId,
		);
		const nextIndex = currentIndex + direction;

		if (currentIndex < 0 || nextIndex < 0 || nextIndex >= books.length) {
			return this.getBooks(authSubject, listSlug);
		}

		const reorderedBooks = [...books];
		const [book] = reorderedBooks.splice(currentIndex, 1);
		reorderedBooks.splice(nextIndex, 0, book);

		const valuePlaceholders = reorderedBooks
			.map((_, index) => `($${index * 2 + 2}, $${index * 2 + 3})`)
			.join(", ");
		const updateParams = [
			listId,
			...reorderedBooks.flatMap((row, position) => [row.bookId, position]),
		];

		await this.sql.query(
			`
			WITH reordered(book_id, position) AS (VALUES ${valuePlaceholders})
			UPDATE ${TABLES.listItems} AS items
			SET position = reordered.position,
				updated_at = CURRENT_TIMESTAMP
			FROM reordered
			WHERE items.list_id = $1
				AND items.book_id = reordered.book_id
			`,
			updateParams,
		);

		const updatedBooks = await this.selectBooks(listId);

		return {
			activeListSlug,
			books: updatedBooks,
			pages: totalPages(updatedBooks),
		};
	}

	private async resolveReadingListContext(
		authSubject: string,
		listSlug?: ReadingListSlug,
	) {
		const { provider, providerAccountId } = parseAuthSubject(authSubject);
		const userId = await this.resolveUserId(provider, providerAccountId);
		const lists = await this.ensureReadingLists(userId);
		const activeListSlug = this.resolveSelectedListSlug(
			lists,
			listSlug ?? DEFAULT_READING_LIST_SLUG,
		);
		const listId = lists.find((list) => list.slug === activeListSlug)?.id;

		if (!listId) {
			throw new Error("Failed to resolve reading list.");
		}

		return {
			userId,
			listId,
			activeListSlug,
			lists: lists.map(toReadingListSummary),
		};
	}

	private resolveSelectedListSlug(
		lists: ReadingListCatalogRow[],
		listSlug: ReadingListSlug,
	) {
		const matchingList = lists.find((list) => list.slug === listSlug);

		if (matchingList) {
			return matchingList.slug as ReadingListSlug;
		}

		const defaultList = lists.find((list) => list.isDefault === 1);

		if (defaultList) {
			return normalizeReadingListSlug(defaultList.slug);
		}

		return DEFAULT_READING_LIST_SLUG;
	}

	private async resolveUserId(provider: string, providerAccountId: string) {
		const existingAccount = (await this.sql`
				SELECT user_id AS "userId"
				FROM ${this.sql.unsafe(TABLES.authAccounts)}
				WHERE provider = ${provider}
					AND provider_account_id = ${providerAccountId}
				LIMIT 1
			`) as AuthAccountRow[];

		if (existingAccount.length > 0) {
			return existingAccount[0].userId;
		}

		const userId = randomUUID();
		const accountId = randomUUID();

		await this.sql`
			INSERT INTO ${this.sql.unsafe(TABLES.users)} (id)
			VALUES (${userId})
		`;

		await this.sql`
			INSERT INTO ${this.sql.unsafe(TABLES.authAccounts)} (
				id, user_id, provider, provider_account_id
			)
			VALUES (${accountId}, ${userId}, ${provider}, ${providerAccountId})
			ON CONFLICT (provider, provider_account_id) DO NOTHING
		`;

		const resolvedAccount = (await this.sql`
				SELECT user_id AS "userId"
				FROM ${this.sql.unsafe(TABLES.authAccounts)}
				WHERE provider = ${provider}
					AND provider_account_id = ${providerAccountId}
				LIMIT 1
			`) as AuthAccountRow[];

		if (resolvedAccount.length > 0 && resolvedAccount[0].userId !== userId) {
			await this.sql`
				DELETE FROM ${this.sql.unsafe(TABLES.users)}
				WHERE id = ${userId}
					AND NOT EXISTS (
						SELECT 1
						FROM ${this.sql.unsafe(TABLES.authAccounts)}
						WHERE user_id = ${userId}
					)
					AND NOT EXISTS (
						SELECT 1
						FROM ${this.sql.unsafe(TABLES.readingLists)}
						WHERE user_id = ${userId}
					)
			`;

			return resolvedAccount[0].userId;
		}

		return userId;
	}

	private async ensureReadingLists(userId: string) {
		const existingLists = (await this.sql`
				SELECT id, slug, name, is_default AS "isDefault"
				FROM ${this.sql.unsafe(TABLES.readingLists)}
				WHERE user_id = ${userId}
			`) as ReadingListRow[];

		const hasCanonicalDefault = existingLists.some(
			(list) => list.slug === DEFAULT_READING_LIST_SLUG,
		);
		const legacyDefault = existingLists.find((list) => list.slug === "default");

		if (legacyDefault && !hasCanonicalDefault) {
			await this.sql`
				UPDATE ${this.sql.unsafe(TABLES.readingLists)}
				SET
					name = ${getReadingListDefinition(DEFAULT_READING_LIST_SLUG).name},
					slug = ${DEFAULT_READING_LIST_SLUG},
					is_default = 1,
					updated_at = CURRENT_TIMESTAMP
				WHERE id = ${legacyDefault.id}
			`;
		}

		const normalizedExistingLists = (await this.sql`
				SELECT id, slug, name, is_default AS "isDefault"
				FROM ${this.sql.unsafe(TABLES.readingLists)}
				WHERE user_id = ${userId}
			`) as ReadingListRow[];

		for (const definition of READING_LIST_DEFINITIONS) {
			const existingList =
				normalizedExistingLists.find((list) => list.slug === definition.slug) ??
				(definition.slug === DEFAULT_READING_LIST_SLUG
					? normalizedExistingLists.find((list) => list.slug === "default")
					: undefined);

			if (existingList) {
				await this.sql`
					UPDATE ${this.sql.unsafe(TABLES.readingLists)}
					SET
						name = ${definition.name},
						slug = ${definition.slug},
						is_default = ${definition.isDefault ? 1 : 0},
						updated_at = CURRENT_TIMESTAMP
					WHERE id = ${existingList.id}
				`;
				continue;
			}

			await this.sql`
				INSERT INTO ${this.sql.unsafe(TABLES.readingLists)} (
					id, user_id, name, slug, is_default
				)
				VALUES (
					${randomUUID()},
					${userId},
					${definition.name},
					${definition.slug},
					${definition.isDefault ? 1 : 0}
				)
				ON CONFLICT (user_id, slug) DO NOTHING
			`;
		}

		await this.sql`
			UPDATE ${this.sql.unsafe(TABLES.readingLists)}
			SET
				name = CASE
					WHEN slug = ${DEFAULT_READING_LIST_SLUG} THEN ${getReadingListDefinition(DEFAULT_READING_LIST_SLUG).name}
					WHEN slug = ${"finished"} THEN ${getReadingListDefinition("finished").name}
					WHEN slug = ${"did_not_finish"} THEN ${getReadingListDefinition("did_not_finish").name}
					ELSE name
				END,
				is_default = CASE
					WHEN slug = ${DEFAULT_READING_LIST_SLUG} THEN 1
					ELSE 0
				END,
				updated_at = CURRENT_TIMESTAMP
			WHERE user_id = ${userId}
		`;

		const lists = (await this.sql`
				SELECT
					id,
					slug,
					name,
					is_default AS "isDefault",
					(
						SELECT COUNT(*)
						FROM ${this.sql.unsafe(TABLES.listItems)} AS items
						WHERE items.list_id = reading_lists.id
					) AS "booksCount"
				FROM ${this.sql.unsafe(TABLES.readingLists)}
				WHERE user_id = ${userId}
				ORDER BY is_default DESC, created_at ASC
			`) as ReadingListCatalogRow[];

		return lists.map((list) => ({
			id: list.id,
			slug: normalizeReadingListSlug(list.slug),
			name: list.name,
			isDefault: list.isDefault,
			booksCount: Number(list.booksCount),
		})) as ReadingListCatalogRow[];
	}

	private async resolveBook(book: Book) {
		const identifierKeys = getBookIdentifierKeys(book);
		const normalizedSubjects = normalizeSubjects(book.subjects);
		const existingBook = await this.findBookByIdentifier(identifierKeys);

		if (existingBook) {
			await this.updateBook(existingBook.id, book);
			await this.syncBookSubjects(existingBook.id, normalizedSubjects);
			await this.syncBookMetrics(existingBook.id, book);
			await this.ensureBookIdentifiers(existingBook.id, identifierKeys);

			return existingBook;
		}

		const bookId = randomUUID();
		const canonicalKey = buildBookIdentityKey(book);

		await this.sql`
			INSERT INTO ${this.sql.unsafe(TABLES.books)} (
				id,
				canonical_key,
				title,
				subtitle,
				author,
				pages,
				language,
				published_year,
				published_date,
				publisher,
				description,
				cover,
				primary_source,
				primary_source_book_id,
				isbn10,
				isbn13,
				series_name,
				series_position
			)
			VALUES (
				${bookId},
				${canonicalKey},
				${book.title},
				${book.subtitle},
				${book.author},
				${book.pages},
				${book.language},
				${book.publishedYear},
				${book.publishedDate},
				${book.publisher},
				${book.description},
				${book.cover},
				${book.source},
				${book.sourceBookId},
				${book.isbn10},
				${book.isbn13},
				${book.seriesName},
				${book.seriesPosition}
			)
			ON CONFLICT (canonical_key) DO NOTHING
		`;

		const resolvedBook = await this.getBookByCanonicalKey(canonicalKey);

		await this.ensureBookIdentifiers(resolvedBook.id, identifierKeys);
		await this.syncBookSubjects(resolvedBook.id, normalizedSubjects);
		await this.syncBookMetrics(resolvedBook.id, book);

		return resolvedBook;
	}

	private async updateBook(bookId: string, book: Book) {
		await this.sql`
			UPDATE ${this.sql.unsafe(TABLES.books)}
			SET
				title = ${book.title},
				subtitle = ${book.subtitle},
				author = ${book.author},
				pages = ${book.pages},
				language = ${book.language},
				published_year = ${book.publishedYear},
				published_date = ${book.publishedDate},
				publisher = ${book.publisher},
				description = ${book.description},
				cover = ${book.cover},
				primary_source = ${book.source},
				primary_source_book_id = ${book.sourceBookId},
				isbn10 = ${book.isbn10},
				isbn13 = ${book.isbn13},
				series_name = ${book.seriesName},
				series_position = ${book.seriesPosition},
				updated_at = CURRENT_TIMESTAMP
			WHERE id = ${bookId}
		`;
	}

	private async ensureBookIdentifiers(
		bookId: string,
		identifierKeys: readonly string[],
	) {
		const identifierRows = identifierKeys.map((identifier) => ({
			id: randomUUID(),
			identifier,
			identifierType: identifier.startsWith("isbn:") ? "isbn" : "source",
		}));

		await Promise.all(
			identifierRows.map(
				(identifierRow) =>
					this.sql`
					INSERT INTO ${this.sql.unsafe(TABLES.bookIdentifiers)} (
						id, book_id, identifier, identifier_type
					)
					VALUES (
						${identifierRow.id},
						${bookId},
						${identifierRow.identifier},
						${identifierRow.identifierType}
					)
					ON CONFLICT (identifier) DO NOTHING
				`,
			),
		);
	}

	private async syncBookSubjects(bookId: string, subjects: readonly string[]) {
		await this.sql`
			DELETE FROM ${this.sql.unsafe(TABLES.bookSubjects)}
			WHERE book_id = ${bookId}
		`;

		if (subjects.length === 0) {
			return;
		}

		await Promise.all(
			subjects.map(
				(subject) =>
					this.sql`
					INSERT INTO ${this.sql.unsafe(TABLES.bookSubjects)} (
						id, book_id, subject
					)
					VALUES (
						${randomUUID()},
						${bookId},
						${subject}
					)
					ON CONFLICT (book_id, subject) DO NOTHING
				`,
			),
		);
	}

	private async syncBookMetrics(bookId: string, book: Book) {
		const metricEntries = [
			{
				metricKey: "average_rating",
				metricValueNumber: book.averageRating,
			},
			{
				metricKey: "ratings_count",
				metricValueNumber: book.ratingsCount,
			},
		];

		await this.sql`
			DELETE FROM ${this.sql.unsafe(TABLES.bookMetrics)}
			WHERE book_id = ${bookId}
				AND source = ${book.source}
				AND metric_key IN ('average_rating', 'ratings_count')
		`;

		await Promise.all(
			metricEntries
				.filter((entry) => entry.metricValueNumber !== null)
				.map(
					(entry) =>
						this.sql`
						INSERT INTO ${this.sql.unsafe(TABLES.bookMetrics)} (
							id, book_id, source, metric_key, metric_value_number
						)
						VALUES (
							${randomUUID()},
							${bookId},
							${book.source},
							${entry.metricKey},
							${entry.metricValueNumber}
						)
						ON CONFLICT (book_id, source, metric_key) DO UPDATE SET
							metric_value_number = EXCLUDED.metric_value_number,
							updated_at = CURRENT_TIMESTAMP
					`,
				),
		);
	}

	private async findBookByIdentifier(identifierKeys: readonly string[]) {
		const matches = (await this.sql`
				SELECT
					books.id,
					books.canonical_key AS "canonicalKey",
					books.primary_source AS source,
					books.primary_source_book_id AS "sourceBookId",
					books.isbn10,
					books.isbn13,
					books.title,
					books.subtitle,
					books.author,
					books.pages,
					books.language,
					books.published_year AS "publishedYear",
					books.published_date AS "publishedDate",
					books.publisher,
					books.description,
					books.cover,
					books.series_name AS "seriesName",
					books.series_position AS "seriesPosition"
				FROM ${this.sql.unsafe(TABLES.books)} AS books
				INNER JOIN ${this.sql.unsafe(TABLES.bookIdentifiers)} AS identifiers
					ON identifiers.book_id = books.id
				WHERE identifiers.identifier = ANY(${identifierKeys})
				LIMIT 1
			`) as StoredBookRow[];

		return matches[0] ?? null;
	}

	private async getBookByCanonicalKey(canonicalKey: string) {
		const matches = (await this.sql`
				SELECT
					id,
					canonical_key AS "canonicalKey",
					primary_source AS source,
					primary_source_book_id AS "sourceBookId",
					isbn10,
					isbn13,
					title,
					subtitle,
					author,
					pages,
					language,
					published_year AS "publishedYear",
					published_date AS "publishedDate",
					publisher,
					description,
					cover,
					series_name AS "seriesName",
					series_position AS "seriesPosition"
				FROM ${this.sql.unsafe(TABLES.books)}
				WHERE canonical_key = ${canonicalKey}
				LIMIT 1
			`) as StoredBookRow[];

		if (matches.length === 0) {
			throw new Error("Failed to resolve stored book record.");
		}

		return matches[0];
	}

	private async getNextPosition(listId: string) {
		const rows = (await this.sql`
				SELECT COALESCE(MAX(position) + 1, 0) AS "nextPosition"
				FROM ${this.sql.unsafe(TABLES.listItems)}
				WHERE list_id = ${listId}
			`) as Array<{ nextPosition: number }>;

		return rows[0]?.nextPosition ?? 0;
	}

	private async selectBooks(listId: string) {
		const rows = await this.selectBooksWithInternalIds(listId);
		const subjectsByBookId = await this.selectBookSubjects(
			rows.map((row) => row.bookId),
		);
		const metricsByBookId = await this.selectBookMetrics(
			rows.map((row) => row.bookId),
		);

		return rows.map((row) =>
			toBookFromRow(
				row,
				subjectsByBookId.get(row.bookId) ?? [],
				metricsByBookId.get(row.bookId) ?? {
					averageRating: null,
					ratingsCount: null,
				},
			),
		);
	}

	private async selectBooksWithInternalIds(listId: string) {
		const rows = (await this.sql`
				SELECT
					books.id AS "bookId",
					books.canonical_key AS "canonicalKey",
					books.title,
					books.subtitle,
					books.author,
					books.pages,
					books.language,
					books.published_year AS "publishedYear",
					books.published_date AS "publishedDate",
					books.publisher,
					books.description,
					books.cover,
					books.primary_source AS source,
					books.primary_source_book_id AS "sourceBookId",
					books.isbn10,
					books.isbn13,
					books.series_name AS "seriesName",
					books.series_position AS "seriesPosition",
					items.position
				FROM ${this.sql.unsafe(TABLES.listItems)} AS items
				INNER JOIN ${this.sql.unsafe(TABLES.books)} AS books
					ON books.id = items.book_id
				WHERE items.list_id = ${listId}
				ORDER BY items.position ASC, books.canonical_key ASC
			`) as ListBookRow[];

		return rows;
	}

	private async selectBookSubjects(bookIds: readonly string[]) {
		if (bookIds.length === 0) {
			return new Map<string, string[]>();
		}

		const rows = (await this.sql`
				SELECT
					book_id AS "bookId",
					subject
				FROM ${this.sql.unsafe(TABLES.bookSubjects)}
				WHERE book_id = ANY(${bookIds})
				ORDER BY subject ASC
			`) as BookSubjectRow[];

		const subjectMap = new Map<string, string[]>();

		for (const row of rows) {
			const subjects = subjectMap.get(row.bookId) ?? [];
			subjects.push(row.subject);
			subjectMap.set(row.bookId, subjects);
		}

		return subjectMap;
	}

	private async selectBookMetrics(bookIds: readonly string[]) {
		if (bookIds.length === 0) {
			return new Map<string, BookMetrics>();
		}

		const rows = (await this.sql`
				SELECT
					book_id AS "bookId",
					source,
					metric_key AS "metricKey",
					metric_value_number AS "metricValueNumber"
				FROM ${this.sql.unsafe(TABLES.bookMetrics)}
				WHERE book_id = ANY(${bookIds})
			`) as BookMetricRow[];

		const metricsMap = new Map<string, BookMetrics>();

		for (const row of rows) {
			if (row.metricValueNumber === null) {
				continue;
			}

			const metrics = metricsMap.get(row.bookId) ?? {
				averageRating: null,
				ratingsCount: null,
			};

			if (row.metricKey === "average_rating") {
				metrics.averageRating = row.metricValueNumber;
			}

			if (row.metricKey === "ratings_count") {
				metrics.ratingsCount = row.metricValueNumber;
			}

			metricsMap.set(row.bookId, metrics);
		}

		return metricsMap;
	}
}
