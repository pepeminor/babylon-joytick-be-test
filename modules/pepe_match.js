// // global.PepeMatch = {
// //     matchInit: function (ctx, logger, nk, params) {
// //         logger.info("✅ PepeMatch init");
// //         return { state: { players: {} }, tickRate: global.CONFIG.TICK_RATE, label: "pepe_match" };
// //     },

// //     matchJoinAttempt: function (ctx, logger, nk, dispatcher, tick, state, presence) {
// //         return { state: state, accept: true };
// //     },

// //     matchJoin: function (ctx, logger, nk, dispatcher, tick, state, presences) {
// //         for (const p of presences) {
// //             if (!state.players[p.userId]) {
// //                 state.players[p.userId] = { pos: [0, 0, 0], yaw: 0, state: "idle", hp: 100 };
// //             }

// //             logger.info("✅ Player joined: " + p.userId);

// //             dispatcher.broadcastMessage(
// //                 global.OPCODES.WELCOME,
// //                 JSON.stringify({
// //                     type: "welcome",
// //                     id: p.userId,
// //                     snapshot: state.players
// //                 }),
// //                 [p]
// //             );
// //         }
// //         return { state };
// //     },

// //     matchLeave: function (ctx, logger, nk, dispatcher, tick, state, presences) {
// //         for (const p of presences) {
// //             delete state.players[p.userId];
// //             dispatcher.broadcastMessage(
// //                 global.OPCODES.LEAVE,
// //                 JSON.stringify({ type: "leave", id: p.userId })
// //             );
// //         }
// //         return { state };
// //     },

// //     matchLoop: function (ctx, logger, nk, dispatcher, tick, state, messages) {
// //         for (const m of messages) {
// //             try {
// //                 const msg = JSON.parse(new TextDecoder().decode(m.data));
// //                 if (msg.type === "update") state = global.handleMovement(state, ctx, dispatcher, msg, m.sender);
// //                 if (msg.type === "attack") state = global.handleAttack(state, ctx, dispatcher, msg, m.sender);
// //                 if (msg.type === "weapon_change") state = global.handleWeaponChange(state, ctx, dispatcher, msg, m.sender);
// //                 if (msg.type === "chat") state = global.handleChat(state, ctx, dispatcher, msg, m.sender);
// //             } catch (e) {
// //                 logger.error("❌ Invalid message: " + e);
// //             }
// //         }
// //         return { state };
// //     }

// // };

// const CONFIG = require("./config");
// const OPCODES = require("./opcodes");
// const { handleMovement } = require("./handlers/movement");
// const { handleAttack, handleWeaponChange } = require("./handlers/combat");
// const { handleChat } = require("./handlers/chat");

// const PepeMatch = {
//     matchInit(ctx, logger, nk, params) {
//         logger.info("✅ PepeMatch init");
//         return { state: { players: {} }, tickRate: CONFIG.TICK_RATE, label: "pepe_match" };
//     },

//     matchJoinAttempt(ctx, logger, nk, dispatcher, tick, state, presence) {
//         return { state, accept: true };
//     },

//     matchJoin(ctx, logger, nk, dispatcher, tick, state, presences) {
//         for (const p of presences) {
//             if (!state.players[p.userId]) {
//                 state.players[p.userId] = { pos: [0, 0, 0], yaw: 0, state: "idle", hp: 100 };
//             }
//             logger.info("✅ Player joined: " + p.userId);
//             dispatcher.broadcastMessage(
//                 OPCODES.WELCOME,
//                 JSON.stringify({ type: "welcome", id: p.userId, snapshot: state.players }),
//                 [p]
//             );
//         }
//         return { state };
//     },

//     matchLeave(ctx, logger, nk, dispatcher, tick, state, presences) {
//         for (const p of presences) {
//             delete state.players[p.userId];
//             dispatcher.broadcastMessage(
//                 OPCODES.LEAVE,
//                 JSON.stringify({ type: "leave", id: p.userId })
//             );
//         }
//         return { state };
//     },

//     matchLoop(ctx, logger, nk, dispatcher, tick, state, messages) {
//         for (const m of messages) {
//             try {
//                 const msg = JSON.parse(new TextDecoder().decode(m.data));
//                 if (msg.type === "update") state = handleMovement(state, ctx, dispatcher, msg, m.sender);
//                 if (msg.type === "attack") state = handleAttack(state, ctx, dispatcher, msg, m.sender);
//                 if (msg.type === "weapon_change") state = handleWeaponChange(state, ctx, dispatcher, msg, m.sender);
//                 if (msg.type === "chat") state = handleChat(state, ctx, dispatcher, msg, m.sender);
//             } catch (e) {
//                 logger.error("❌ Invalid message: " + e);
//             }
//         }
//         return { state };
//     },
// };

// module.exports = { PepeMatch };
