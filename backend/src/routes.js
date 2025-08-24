import express from "express";
import { getOnlineUsers, getMessages } from "./store.js";

const router = express.Router();

router.get("/health", (req, res) => {
	res.json({ status: "ok" });
});

router.get("/users/online", (req, res) => {
	res.json({ users: getOnlineUsers(), count: getOnlineUsers().length });
});

router.get("/messages", (req, res) => {
	const limit = Number(req.query.limit || 100);
	res.json({ messages: getMessages(limit) });
});

export default router;


