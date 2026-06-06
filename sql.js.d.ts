declare module "sql.js" {
	export type SqlJsConfig = {
		locateFile?: (file: string) => string;
	};

	export interface SqlJsStatement {
		bind(params: unknown[] | Record<string, unknown>): void;
		step(): boolean;
		getAsObject(): Record<string, unknown>;
		free(): void;
	}

	export class Database {
		constructor(data?: Uint8Array | ArrayBuffer | Buffer);
		run(sql: string, params?: unknown[] | Record<string, unknown>): void;
		prepare(
			sql: string,
			params?: unknown[] | Record<string, unknown>,
		): SqlJsStatement;
		exec(
			sql: string,
			params?: unknown[] | Record<string, unknown>,
		): Array<{
			columns: string[];
			values: unknown[][];
		}>;
		export(): Uint8Array;
	}

	export default function initSqlJs(config?: SqlJsConfig): Promise<{
		Database: typeof Database;
	}>;
}

declare module "sql.js/dist/sql-asm.js" {
	import initSqlJs from "sql.js";

	export default initSqlJs;
}
