// // global.handleAttack = function (state, ctx, dispatcher, msg, sender) {
// //     const attacker = state.players[sender.userId];
// //     const target = state.players[msg.targetId];
// //     if (!attacker || !target) return state;

// //     const damage = msg.damage || 10;
// //     target.hp = Math.max(0, (target.hp || 100) - damage);

// //     dispatcher.broadcastMessage(
// //         global.OPCODES.DAMAGE,
// //         JSON.stringify({
// //             type: "damage",
// //             from: sender.userId,
// //             to: msg.targetId,
// //             hp: target.hp
// //         })
// //     );

// //     return state;
// // };

// // global.handleWeaponChange = function (state, ctx, dispatcher, msg, sender) {
// //     const player = state.players[sender.userId];
// //     if (!player) return state;

// //     player.weapon = msg.weapon || "default";

// //     dispatcher.broadcastMessage(
// //         global.OPCODES.WEAPON_CHANGE,
// //         JSON.stringify({
// //             type: "weapon_change",
// //             id: sender.userId,
// //             weapon: player.weapon
// //         })
// //     );

// //     return state;
// // };

// const OPCODES = require("../opcodes");

// function handleAttack(state, ctx, dispatcher, msg, sender) {
//     const attacker = state.players[sender.userId];
//     const target = state.players[msg.targetId];
//     if (!attacker || !target) return state;

//     const damage = msg.damage || 10;
//     target.hp = Math.max(0, (target.hp || 100) - damage);

//     dispatcher.broadcastMessage(
//         OPCODES.DAMAGE,
//         JSON.stringify({
//             type: "damage",
//             from: sender.userId,
//             to: msg.targetId,
//             hp: target.hp,
//         })
//     );

//     return state;
// }

// function handleWeaponChange(state, ctx, dispatcher, msg, sender) {
//     const player = state.players[sender.userId];
//     if (!player) return state;

//     player.weapon = msg.weapon || "default";

//     dispatcher.broadcastMessage(
//         OPCODES.WEAPON_CHANGE,
//         JSON.stringify({
//             type: "weapon_change",
//             id: sender.userId,
//             weapon: player.weapon,
//         })
//     );

//     return state;
// }

// module.exports = { handleAttack, handleWeaponChange };

const OPCODES = require("../opcodes");

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
