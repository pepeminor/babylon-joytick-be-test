const { OPCODES } = require("../opcodes");

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
