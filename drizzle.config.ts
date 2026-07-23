import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	casing: "snake_case",
	verbose: true, // Logs DDL statements for debugging
	strict: true, // Enables rename detection and stricter check
});
