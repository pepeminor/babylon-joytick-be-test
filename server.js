const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const OPCODES = require("./modules/opcodes");

const { handleMovement } = require("./modules/handlers/movement");
const { handleAttack, handleWeaponChange } = require("./modules/handlers/combat");
const { handleChat } = require("./modules/handlers/chat");

const server = new WebSocket.Server({ port: 7350 });

const state = {
    players: {},  // userId -> { pos, yaw, hp, state }
    sockets: {}   // userId -> ws
};

server.on("connection", (ws) => {
    ws.id = uuidv4();

    state.players[ws.id] = { pos: [0, 0, 0], yaw: 0, state: "idle", hp: 100 };
    state.sockets[ws.id] = ws;

    console.log(`✅ Player connected: ${ws.id}`);

    // Send welcome message with current players
    ws.send(JSON.stringify({
        op: OPCODES.WELCOME,
        id: ws.id,
        snapshot: state.players
    }));

    // Send new join to all other players
    const joinMsg = JSON.stringify({
        op: OPCODES.JOIN,
        id: ws.id,
        pos: [0, 0, 0],
        yaw: 0,
        state: "idle"
    });
    for (const [pid, sock] of Object.entries(state.sockets)) {
        if (pid !== ws.id && sock.readyState === sock.OPEN) {
            sock.send(joinMsg);
        }
    }

    ws.on("message", (raw) => {
        try {
            const msg = JSON.parse(raw.toString());
            if (msg.type === "update") handleMovement(state, ws, msg);
            if (msg.type === "attack") handleAttack(state, ws, msg);
            if (msg.type === "weapon_change") handleWeaponChange(state, ws, msg);
            if (msg.type === "chat") handleChat(state, ws, msg);
        } catch (e) {
            console.error("❌ Invalid message", e);
        }
    });

    ws.on("close", () => {
        console.log(`🚪 Player left: ${ws.id}`);
        delete state.players[ws.id];
        delete state.sockets[ws.id];

        const leaveMsg = JSON.stringify({ op: OPCODES.LEAVE, id: ws.id });
        for (const sock of Object.values(state.sockets)) {
            if (sock.readyState === sock.OPEN) {
                sock.send(leaveMsg);
            }
        }
    });
});


console.log(`🚀 Pepe WS Server is running...`);
