import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import initSqlJs from "sql.js/dist/sql-asm.js";

import { type Book, totalPages } from "../../types/readingList";
import type { ReadingListSnapshot, ReadingListStore } from "./readingListStore";

const DATABASE_PATH =
	process.env.READING_LIST_DB_PATH ??
	path.join(
		/* turbopackIgnore: true */ process.cwd(),
		".data",
		"reading-list.sqlite",
	);

let storePromise: Promise<ReadingListStore> | null = null;

type SqlJsStatement = {
	step(): boolean;
	bind(values: unknown[]): void;
	getAsObject(): Record<string, unknown>;
	free(): void;
};

type SqlJsDatabase = {
	run(sql: string, params?: unknown[]): void;
	prepare(sql: string): SqlJsStatement;
	export(): Uint8Array;
};

type SqlJsModule = {
	Database: new (file?: Uint8Array) => SqlJsDatabase;
};

export function getReadingListStore() {
	storePromise ??= createSqliteReadingListStore();

	return storePromise;
}

async function createSqliteReadingListStore(): Promise<ReadingListStore> {
	const SQL = await initSqlJs();

	const database = await loadDatabase(SQL);
	const store = new SqliteReadingListStore(database, DATABASE_PATH);

	await store.initialize();

	return store;
}

async function loadDatabase(SQL: SqlJsModule) {
	try {
		const file = await fs.readFile(DATABASE_PATH);
		return new SQL.Database(file);
	} catch {
		return new SQL.Database();
	}
}

class SqliteReadingListStore implements ReadingListStore {
	constructor(
		private readonly database: SqlJsDatabase,
		private readonly filePath: string,
	) {}

	async initialize() {
		this.database.run(`
			CREATE TABLE IF NOT EXISTS reading_list_books (
				id TEXT PRIMARY KEY,
				title TEXT NOT NULL,
				author TEXT NOT NULL,
				pages INTEGER,
				description TEXT NOT NULL,
				cover TEXT NOT NULL,
				accent TEXT NOT NULL,
				position INTEGER NOT NULL
			);
		`);

		this.database.run(`
			CREATE INDEX IF NOT EXISTS idx_reading_list_books_position
			ON reading_list_books(position);
		`);
	}

	async getBooks(): Promise<ReadingListSnapshot> {
		const books = this.selectBooks();
		return {
			books,
			pages: totalPages(books),
		};
	}

	async addBook(book: Book): Promise<ReadingListSnapshot> {
		if (await this.hasBook(book.id)) {
			return this.getBooks();
		}

		const nextPosition = await this.getNextPosition();

		this.database.run("BEGIN");

		try {
			this.database.run(
				`
					INSERT INTO reading_list_books (
						id, title, author, pages, description, cover, accent, position
					)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?)
				`,
				[
					book.id,
					book.title,
					book.author,
					book.pages,
					book.description,
					book.cover,
					book.accent,
					nextPosition,
				],
			);

			this.database.run("COMMIT");
			await this.persist();
			return this.getBooks();
		} catch (error) {
			this.database.run("ROLLBACK");
			throw error;
		}
	}

	async moveBook(
		bookId: string,
		direction: -1 | 1,
	): Promise<ReadingListSnapshot> {
		const books = this.selectBooks();
		const currentIndex = books.findIndex((book) => book.id === bookId);
		const nextIndex = currentIndex + direction;

		if (currentIndex < 0 || nextIndex < 0 || nextIndex >= books.length) {
			return this.getBooks();
		}

		const nextBooks = [...books];
		const [book] = nextBooks.splice(currentIndex, 1);
		nextBooks.splice(nextIndex, 0, book);

		this.database.run("BEGIN");

		try {
			nextBooks.forEach((nextBook, position) => {
				this.database.run(
					"UPDATE reading_list_books SET position = ? WHERE id = ?",
					[position, nextBook.id],
				);
			});

			this.database.run("COMMIT");
			await this.persist();
			return this.getBooks();
		} catch (error) {
			this.database.run("ROLLBACK");
			throw error;
		}
	}

	private async hasBook(bookId: string) {
		const statement = this.database.prepare(
			"SELECT 1 FROM reading_list_books WHERE id = ? LIMIT 1",
		);

		try {
			statement.bind([bookId]);
			return statement.step();
		} finally {
			statement.free();
		}
	}

	private async getNextPosition() {
		const statement = this.database.prepare(
			"SELECT COALESCE(MAX(position) + 1, 0) AS nextPosition FROM reading_list_books",
		);

		try {
			if (!statement.step()) {
				return 0;
			}

			const row = statement.getAsObject() as Record<string, unknown>;
			return Number(row.nextPosition ?? 0);
		} finally {
			statement.free();
		}
	}

	private selectBooks(): Book[] {
		const statement = this.database.prepare(
			`
				SELECT id, title, author, pages, description, cover, accent
				FROM reading_list_books
				ORDER BY position ASC
			`,
		);
		const books: Book[] = [];

		try {
			while (statement.step()) {
				const row = statement.getAsObject() as Record<string, unknown>;
				books.push({
					id: String(row.id),
					title: String(row.title),
					author: String(row.author),
					pages:
						typeof row.pages === "number"
							? row.pages
							: row.pages === null
								? null
								: Number(row.pages),
					description: String(row.description),
					cover: String(row.cover),
					accent: String(row.accent),
				});
			}
		} finally {
			statement.free();
		}

		return books;
	}

	private async persist() {
		await fs.mkdir(path.dirname(this.filePath), { recursive: true });
		const data = this.database.export();
		await fs.writeFile(this.filePath, Buffer.from(data));
	}
}
