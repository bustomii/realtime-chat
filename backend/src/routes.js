import express from "express";
import { getOnlineUsers } from "./store.js";
import { listMessages, listRooms } from "./repo.js";

const router = express.Router();

router.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

router.get("/users/online", async (req, res) => {
	const room = String(req.query.room || "general");
	const users = await getOnlineUsers(room);
	res.json({ users, count: users.length });
});

router.get("/messages", async (req, res) => {
	const limit = Number(req.query.limit || 100);
	const room = String(req.query.room || "general");
	const messages = await listMessages(room, limit);
	res.json({ messages });
});

router.get("/get-rooms", async (req, res) => {
	const rooms = await listRooms();
	res.json({ rooms });
});

export default router;


