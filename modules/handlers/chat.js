// // // import OPCODES from '../opcodes'
// // // const OPCODES = require("../opcodes");
// // global.handleChat = function (state, ctx, dispatcher, msg, sender) {
// //     const chatMsg = {
// //         type: "chat",
// //         from: sender.userId,
// //         text: msg.text || "",
// //     };

// //     // broadcast cho tất cả
// //     dispatcher.broadcastMessage(global.OPCODES.CHAT, JSON.stringify(chatMsg));
// //     return state;
// // }

// const OPCODES = require("../opcodes");

// function handleChat(state, ctx, dispatcher, msg, sender) {
//     const chatMsg = {
//         type: "chat",
//         from: sender.userId,
//         text: msg.text || "",
//     };

//     dispatcher.broadcastMessage(OPCODES.CHAT, JSON.stringify(chatMsg));
//     return state;
// }

// module.exports = { handleChat };

const OPCODES = require("../opcodes");

function handleChat(state, ws, msg) {
    const chatMsg = JSON.stringify({
        op: OPCODES.CHAT,
        from: ws.id,
        text: msg.text || ""
    });

    Object.values(state.sockets).forEach((sock) => sock.send(chatMsg));
    return state;
}

module.exports = { handleChat };
