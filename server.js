import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 3001;
const MAX_PLAYERS = 30;
const clients = new Map(); // id -> ws

function broadcast(data, exceptId) {
    const msg = JSON.stringify(data);
    for (const [id, sock] of clients) {
        if (id !== exceptId && sock.readyState === sock.OPEN) {
            sock.send(msg);
        }
    }
}

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
    if (clients.size >= MAX_PLAYERS) {
        ws.send(JSON.stringify({ type: "full" }));
        ws.close();
        return;
    }

    const id = "p" + Math.floor(Math.random() * 100000);
    clients.set(id, ws);
    console.log("✅ Player joined:", id);

    // gửi cho chính nó: ID của mình + danh sách người khác
    ws.send(JSON.stringify({
        type: "welcome",
        id,
        others: Array.from(clients.keys()).filter((k) => k !== id)
    }));

    // báo cho người khác biết có người mới
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

console.log(`🚀 WS server running at ws://localhost:${PORT}`);
