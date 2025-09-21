const { OPCODES } = require("../opcodes");

function handleAttack(state, ws, msg) {
    const attacker = state.players[ws.id];
    const target = state.players[msg.targetId];
    if (!attacker || !target) return state;

    const damage = msg.damage || 10;
    target.hp = Math.max(0, (target.hp || 100) - damage);

    const dmgMsg = JSON.stringify({
        op: OPCODES.DAMAGE,
        from: ws.id,
        to: msg.targetId,
        hp: target.hp
    });

    Object.values(state.sockets).forEach((sock) => sock.send(dmgMsg));
    return state;
}

function handleWeaponChange(state, ws, msg) {
    const player = state.players[ws.id];
    if (!player) return state;

    player.weapon = msg.weapon || "default";

    const wpnMsg = JSON.stringify({
        op: OPCODES.WEAPON_CHANGE,
        id: ws.id,
        weapon: player.weapon
    });

    Object.values(state.sockets).forEach((sock) => sock.send(wpnMsg));
    return state;
}

module.exports = { handleAttack, handleWeaponChange };
