import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env.local" }); // or .env.local

export const db = drizzle({
	connection: process.env.DATABASE_URL!,
	casing: "snake_case",
	schema,
});

export type DB = typeof db;
export type Tx = Parameters<Parameters<DB["transaction"]>[0]>[0];

export type DbClient = DB | Tx;
