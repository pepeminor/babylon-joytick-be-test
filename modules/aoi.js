const { CONFIG } = require("./config");
const { OPCODES } = require("./opcodes");

function getNearbyPlayers(state, ws) {
  const me = state.players[ws.id];
  if (!me) return [];

  const others = Object.entries(state.players)
    .filter(([pid]) => pid !== ws.id)
    .map(([pid, info]) => ({
      id: pid,
      dist: Math.hypot(info.pos[0] - me.pos[0], info.pos[2] - me.pos[2]),
    }))
    .filter((o) => o.dist <= CONFIG.AOI_DISTANCE)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, CONFIG.AOI_MAX_NEARBY);

  return others.map((o) => o.id);
}

function updateAOI(state, ws) {
  const nearbyIds = getNearbyPlayers(state, ws);
  const oldSet = state.aoi[ws.id] || new Set();

  const enter = nearbyIds.filter((id) => !oldSet.has(id));
  const exit = [...oldSet].filter((id) => !nearbyIds.includes(id));

  // send JOIN for Enter
  for (const id of enter) {
    const sock = state.sockets[ws.id];
    if (sock?.readyState === sock.OPEN) {
      const info = state.players[id];
      sock.send(
        JSON.stringify({
          op: OPCODES.JOIN,
          id,
          pos: info.pos,
          yaw: info.yaw,
          state: info.state,
        })
      );
    }
  }

  // send LEAVE for Exit
  for (const id of exit) {
    const sock = state.sockets[ws.id];
    if (sock?.readyState === sock.OPEN) {
      sock.send(JSON.stringify({ op: OPCODES.LEAVE, id }));
    }
  }

  state.aoi[ws.id] = new Set(nearbyIds);
  return nearbyIds;
}

module.exports = { getNearbyPlayers, updateAOI };
