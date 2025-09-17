import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 3001;
const MAX_PLAYERS = 30;
const clients = new Map(); // id -> ws

// ===== HTTP server =====
const app = express();
app.get("/", (req, res) => res.send("WS server is running 🚀"));
const server = createServer(app);

// ===== WS server attach vào HTTP =====
const wss = new WebSocketServer({ server });

function broadcast(data, exceptId) {
    const msg = JSON.stringify(data);
    for (const [id, sock] of clients) {
        if (id !== exceptId && sock.readyState === sock.OPEN) {
            sock.send(msg);
        }
    }
}

wss.on("connection", (ws) => {
    if (clients.size >= MAX_PLAYERS) {
        ws.send(JSON.stringify({ type: "full" }));
        ws.close();
        return;
    }

    const id = "p" + Math.floor(Math.random() * 100000);
    clients.set(id, ws);
    console.log("✅ Player joined:", id);

    ws.send(JSON.stringify({
        type: "welcome",
        id,
        others: Array.from(clients.keys()).filter((k) => k !== id),
    }));

    broadcast({ type: "join", id }, id);

    ws.on("message", (raw) => {
        try {
            const data = JSON.parse(raw.toString());
            if (data.type === "update") {
                broadcast({ type: "update", id, ...data }, id);
            }
        } catch (e) {
            console.error("Invalid WS message:", raw.toString());
        }
    });

    ws.on("close", () => {
        console.log("❌ Player left:", id);
        clients.delete(id);
        broadcast({ type: "leave", id });
    });
});

server.listen(PORT, () => {
    console.log(`🚀 WS server running at http://localhost:${PORT}`);
    console.log(`👉 FE connect URL: ws://localhost:${PORT}`);
});
