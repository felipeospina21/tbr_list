import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" }); // or .env.local

const sql = neon(process.env.DATABASE_URL!, {
	fetchOptions: {
		cache: "no-store",
	},
});

// 2. Pass the custom client into Drizzle, keeping your casing and schema setup
export const db = drizzle({
	client: sql,
	casing: "snake_case",
	schema,
});

export type DB = typeof db;
export type Tx = Parameters<Parameters<DB["transaction"]>[0]>[0];

export type DbClient = DB | Tx;
