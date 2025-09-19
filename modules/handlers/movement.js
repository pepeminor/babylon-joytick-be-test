const OPCODES = require("../opcodes");

/**
 * handleMovement
 * @param {Object} state
 * @param {WebSocket} ws
 * @param {Object} msg
 */
function handleMovement(state, ws, msg) {
  if (!state.players[ws.id]) {
    console.warn(`⚠️ handleMovement: player ${ws.id} not found`);
    return;
  }

  state.players[ws.id].pos = msg.pos || [0, 0, 0];
  state.players[ws.id].yaw = msg.yaw || 0;
  state.players[ws.id].state = msg.state || "idle";

  const updateMsg = JSON.stringify({
    op: OPCODES.UPDATE,
    id: ws.id,
    pos: state.players[ws.id].pos,
    yaw: state.players[ws.id].yaw,
    state: state.players[ws.id].state,
  });

  for (const [pid, sock] of Object.entries(state.sockets)) {
    if (pid !== ws.id && sock.readyState === sock.OPEN) {
      sock.send(updateMsg);
    }
  }
}

module.exports = { handleMovement };
