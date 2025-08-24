import {
	addUser,
	removeUser,
	getOnlineUsers,
	createSystemMessage,
	createUserMessage,
	addMessage,
	getMessages,
	getUsernameBySocketId,
} from "./store.js";

export function registerSocketHandlers(io) {
	io.on("connection", (socket) => {
		let joined = false;
		const timestamps = [];

		socket.on("join", (payload, callback) => {
			const { username } = payload || {};
			if (!username || typeof username !== "string") {
				return callback?.({ ok: false, error: "USERNAME_REQUIRED" });
			}
			addUser(socket.id, username);
			joined = true;
			const history = getMessages(100);
			const msg = createSystemMessage(`${username} bergabung`);
			addMessage(msg);
			io.emit("system", msg);
			io.emit("online", { users: getOnlineUsers() });
			callback?.({ ok: true, history });
		});

		socket.on("message", (payload, callback) => {
			const { text } = payload || {};
			const username = getUsernameBySocketId(socket.id);
			if (!joined || !username) return callback?.({ ok: false, error: "NOT_JOINED" });
			if (!text || typeof text !== "string") return callback?.({ ok: false, error: "TEXT_REQUIRED" });
			const now = Date.now();
			while (timestamps.length && now - timestamps[0] > 3000) timestamps.shift();
			if (timestamps.length >= 5) return callback?.({ ok: false, error: "RATE_LIMITED" });
			timestamps.push(now);
			const msg = createUserMessage(username, String(text).slice(0, 1000));
			addMessage(msg);
			io.emit("message", msg);
			callback?.({ ok: true });
		});

		socket.on("typing", (payload) => {
			const { isTyping } = payload || {};
			const username = getUsernameBySocketId(socket.id);
			if (!joined || !username) return;
			socket.broadcast.emit("typing", { username, isTyping: !!isTyping });
		});

		socket.on("disconnect", () => {
			const user = removeUser(socket.id);
			if (user && joined) {
				const msg = createSystemMessage(`${user.username} keluar`);
				addMessage(msg);
				io.emit("system", msg);
				io.emit("online", { users: getOnlineUsers() });
			}
		});
	});
}


