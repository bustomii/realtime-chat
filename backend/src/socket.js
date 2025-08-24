import {
	addUser,
	removeUser,
	getOnlineUsers,
	createSystemMessage,
	getUsernameBySocketId,
	setUserRoom,
} from "./store.js";
import { saveMessage, listMessages } from "./repo.js";

export function registerSocketHandlers(io) {
	io.on("connection", (socket) => {
		let joined = false;
		const timestamps = [];

		socket.on("join", async (payload, callback) => {
			const { username, room = "general" } = payload || {};
			if (!username || typeof username !== "string") {
				return callback?.({ ok: false, error: "Username is required" });
			}
			addUser(socket.id, username);
			setUserRoom(socket.id, room);
			joined = true;
			// ensure only one room (besides private room id)
			for (const r of socket.rooms) {
				if (r !== socket.id && r !== room) socket.leave(r);
			}
			socket.join(room);
			const history = await listMessages(room, 100);
			const msg = createSystemMessage(`${username} bergabung room ${room}`);
			io.to(room).emit("system", msg);
			io.to(room).emit("online", { users: getOnlineUsers(room) });
			callback?.({ ok: true, history });
		});

		socket.on("message", async (payload, callback) => {
			const { text } = payload || {};
			const username = getUsernameBySocketId(socket.id);
			if (!joined || !username) return callback?.({ ok: false, error: "You are not joined" });
			if (!text || typeof text !== "string") return callback?.({ ok: false, error: "Text is required" });
			const now = Date.now();
			while (timestamps.length && now - timestamps[0] > 3000) timestamps.shift();
			if (timestamps.length >= 5) return callback?.({ ok: false, error: "Please wait 3 seconds before sending another message" });
			timestamps.push(now);
			const room = Array.from(socket.rooms).find((r) => r !== socket.id) || "general";
			const msg = await saveMessage(room, username, String(text).slice(0, 1000));
			io.to(room).emit("message", msg);
			callback?.({ ok: true });
		});

		socket.on("typing", (payload) => {
			const { isTyping } = payload || {};
			const username = getUsernameBySocketId(socket.id);
			if (!joined || !username) return;
			const room = Array.from(socket.rooms).find((r) => r !== socket.id) || "general";
			socket.to(room).emit("typing", { username, isTyping: !!isTyping });
		});

		socket.on("disconnect", () => {
			const user = removeUser(socket.id);
			if (user && joined) {
				const room = user.room || Array.from(socket.rooms).find((r) => r !== socket.id) || "general";
				const msg = createSystemMessage(`${user.username} keluar room ${room}`);
				io.to(room).emit("system", msg);
				io.to(room).emit("online", { users: getOnlineUsers(room) });
			}
		});
	});
}


