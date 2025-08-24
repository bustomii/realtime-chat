import { pool } from "./db.js";

export async function listRooms() {
	const res = await pool.query("select name from rooms");
	return res.rows.map((r) => r.name);
}

export async function findOrCreateRoom(name) {
	const client = await pool.connect();
	try {
		await client.query("begin");
		const sel = await client.query("select id from rooms where name=$1", [name]);
		if (sel.rowCount > 0) {
			await client.query("commit");
			return sel.rows[0].id;
		}
		const ins = await client.query("insert into rooms(name) values($1) returning id", [name]);
		await client.query("commit");
		return ins.rows[0].id;
	} catch (e) {
		await client.query("rollback");
		throw e;
	} finally {
		client.release();
	}
}

export async function saveMessage(roomName, username, text) {
	const roomId = await findOrCreateRoom(roomName);
	const res = await pool.query(
		"insert into messages(room_id, username, text) values($1,$2,$3) returning id, created_at",
		[roomId, username, text]
	);
	const m = res.rows[0];
	return {
		id: String(m.id),
		username,
		text,
		timestamp: new Date(m.created_at).toISOString(),
	};
}

export async function listMessages(roomName, limit = 100) {
	const roomId = await findOrCreateRoom(roomName);
	const res = await pool.query(
		"select id, username, text, created_at from messages where room_id=$1 order by created_at asc limit $2",
		[roomId, limit]
	);
	return res.rows.map((r) => ({
		id: String(r.id),
		username: r.username,
		text: r.text,
		timestamp: new Date(r.created_at).toISOString(),
	}));
}


