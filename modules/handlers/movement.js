const OPCODES = require("../opcodes");

/**
 * Xử lý movement update từ client
 * @param {Object} state - server state
 * @param {WebSocket} ws - client socket
 * @param {Object} msg - message từ client { pos, yaw, state }
 */
function handleMovement(state, ws, msg) {
    if (!state.players[ws.id]) {
        console.warn(`⚠️ handleMovement: player ${ws.id} not found`);
        return;
    }

    // cập nhật state
    state.players[ws.id].pos = msg.pos || [0, 0, 0];
    state.players[ws.id].yaw = msg.yaw || 0;
    state.players[ws.id].state = msg.state || "idle";

    // log debug
    console.log(`📡 UPDATE from ${ws.id} -> pos=${msg.pos}, yaw=${msg.yaw}, state=${msg.state}`);

    // broadcast cho tất cả người khác
    const updateMsg = JSON.stringify({
        op: OPCODES.UPDATE,
        id: ws.id,
        pos: state.players[ws.id].pos,
        yaw: state.players[ws.id].yaw,
        state: state.players[ws.id].state
    });

    for (const [pid, sock] of Object.entries(state.sockets)) {
        if (pid !== ws.id && sock.readyState === sock.OPEN) {
            sock.send(updateMsg);
        }
    }
}

module.exports = { handleMovement };
