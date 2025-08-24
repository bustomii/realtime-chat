import dayjs from "dayjs";

const DEFAULT_ROOM = "general";

const state = {
	roomName: DEFAULT_ROOM,
	usersBySocketId: new Map(),
	usernames: new Set(),
	messages: [],
};

export function getRoomName() {
	return state.roomName;
}

export function addUser(socketId, username) {
	state.usersBySocketId.set(socketId, { socketId, username });
	state.usernames.add(username);
}

export function removeUser(socketId) {
	const user = state.usersBySocketId.get(socketId);
	if (user) {
		state.usersBySocketId.delete(socketId);
		const stillExists = Array.from(state.usersBySocketId.values()).some(
			(u) => u.username === user.username
		);
		if (!stillExists) state.usernames.delete(user.username);
	}
	return user;
}

export function getOnlineUsers() {
	return Array.from(state.usersBySocketId.values()).map((u) => ({
		id: u.socketId,
		username: u.username,
	}));
}

export function isUsernameTaken(username) {
	return state.usernames.has(username);
}

export function addMessage({ id, username, text, timestamp }) {
	state.messages.push({ id, username, text, timestamp });
	if (state.messages.length > 500) state.messages.shift();
}

export function getMessages(limit = 100) {
	if (!limit || limit <= 0) return [...state.messages];
	return state.messages.slice(-limit);
}

export function createSystemMessage(text) {
	return {
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		username: "system",
		text,
		timestamp: dayjs().toISOString(),
	};
}

export function createUserMessage(username, text) {
	return {
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		username,
		text,
		timestamp: dayjs().toISOString(),
	};
}

export function getUsernameBySocketId(socketId) {
	const u = state.usersBySocketId.get(socketId);
	return u ? u.username : undefined;
}

export function clearAll() {
	state.usersBySocketId.clear();
	state.usernames.clear();
	state.messages.length = 0;
}

export default {
	getRoomName,
	addUser,
	removeUser,
	getOnlineUsers,
	isUsernameTaken,
	addMessage,
	getMessages,
	createSystemMessage,
	createUserMessage,
	getUsernameBySocketId,
	clearAll,
};


