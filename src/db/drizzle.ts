import { neonConfig, Pool } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

config({ path: ".env.local" }); // or .env.local

neonConfig.webSocketConstructor = ws;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL!,
});

// 2. Pass the custom client into Drizzle, keeping your casing and schema setup
export const db = drizzle({
	client: pool,
	casing: "snake_case",
	schema,
});

export type DB = typeof db;
export type Tx = Parameters<Parameters<DB["transaction"]>[0]>[0];

export type DbClient = DB | Tx;
