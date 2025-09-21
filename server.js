const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const {
  handleAttack,
  handleWeaponChange,
} = require("./modules/handlers/combat");
const { handleChat } = require("./modules/handlers/chat");
const { updateAOI } = require("./modules/aoi");
const { OPCODES } = require("./modules/opcodes");
const { CONFIG } = require("./modules/config");
const { handleMovement } = require("./modules/handlers/movement");

const server = new WebSocket.Server({ port: 7350 });

const state = {
  players: {}, // userId -> { pos, yaw, hp, state }
  sockets: {}, // userId -> ws
  aoi: {}, // userId -> Set(nearbyIds)
};

// === Tick loop ===
setInterval(() => {
  for (const [pid, ws] of Object.entries(state.sockets)) {
    if (ws.readyState !== ws.OPEN) continue;

    const nearbyIds = updateAOI(state, ws);

    const updates = [];
    for (const id of nearbyIds) {
      const p = state.players[id];
      if (p) {
        updates.push({
          id,
          pos: p.pos,
          yaw: p.yaw,
          state: p.state,
        });
      }
    }

    if (updates.length > 0) {
      ws.send(
        JSON.stringify({
          op: OPCODES.BATCH_UPDATE,
          players: updates,
        })
      );
    }
  }
}, 1000 / CONFIG.TICK_RATE);

server.on("connection", (ws) => {
  ws.id = uuidv4();

  state.players[ws.id] = { pos: [0, 0, 0], yaw: 0, state: "idle", hp: 100 };
  state.sockets[ws.id] = ws;

  console.log(`✅ Player connected: ${ws.id}`);

  // send snapshot with AOI
  const nearbyIds = updateAOI(state, ws);
  const snapshot = {};
  for (const id of nearbyIds) snapshot[id] = state.players[id];

  // Send welcome message with current players
  ws.send(
    JSON.stringify({
      op: OPCODES.WELCOME,
      id: ws.id,
      snapshot,
    })
  );

  // Send new join to all other players
  const joinMsg = JSON.stringify({
    op: OPCODES.JOIN,
    id: ws.id,
    pos: [0, 0, 0],
    yaw: 0,
    state: "idle",
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
