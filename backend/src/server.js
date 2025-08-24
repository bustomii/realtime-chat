import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import router from "./routes.js";
import { registerSocketHandlers } from "./socket.js";
import { migrate } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 3000,
		standardHeaders: true,
		legacyHeaders: false,
	})
);

app.use("/api", router);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
	cors: { origin: "*" },
});

registerSocketHandlers(io);

migrate().catch((e) => {
	console.error(e);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
	console.log(`server listening on http://localhost:${PORT}`);
});


