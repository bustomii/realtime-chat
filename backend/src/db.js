import pg from "pg";
import fs from "fs";

const { Pool } = pg;

export const pool = new Pool({
	connectionString: process.env.DATABASE_URL || "postgresql://postgres@localhost:5432/chatdb",
});

async function waitForDatabase(retries = 30, delayMs = 1000) {
	for (let i = 0; i < retries; i++) {
		try {
			await pool.query("select 1");
			return;
		} catch (e) {
			await new Promise((r) => setTimeout(r, delayMs));
		}
	}
	throw new Error("database not ready");
}

export async function migrate() {
	await waitForDatabase();
	const sql = fs.readFileSync(new URL("./migrations.sql", import.meta.url));
	await pool.query(sql.toString());
}

if (process.argv[2] === "migrate") {
	migrate()
		.then(() => {
			console.log("migrations done");
			process.exit(0);
		})
		.catch((e) => {
			console.error(e);
			process.exit(1);
		});
}


