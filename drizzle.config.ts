import { defineConfig } from 'drizzle-kit';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	dbCredentials: {
		host: "localhost",
		port: 54321,
		user: "postgres",
		password: "postgres",
		url: process.env.DATABASE_URL
	},
	out: "./supabase/migrations",

	verbose: true,
	strict: true,
	dialect: 'postgresql'
});
