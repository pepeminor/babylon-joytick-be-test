let PepeMatch = {
    matchInit: function (ctx, logger, nk, params) {
        logger.info("✅ PepeMatch init");
        return {
            state: { players: {} },
            tickRate: 10, // 100ms 1 lần loop
            label: "pepe_match",
        };
    },

    matchJoinAttempt: function (ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
        return { state, accept: true };
    },

    matchJoin: function (ctx, logger, nk, dispatcher, tick, state, presences) {
        for (const p of presences) {
            // nếu user đã tồn tại trong state thì giữ nguyên (không reset)
            if (!state.players[p.userId]) {
                state.players[p.userId] = { pos: [0, 0, 0], yaw: 0, state: "idle" };
            }

            logger.info(`✅ Player joined: ${p.userId}`);

            // gửi welcome cho riêng thằng này
            dispatcher.broadcastMessage(
                1,
                JSON.stringify({
                    type: "welcome",
                    id: p.userId,
                    others: Object.keys(state.players).filter(id => id !== p.userId),
                    snapshot: state.players, // ⚡ gửi thêm toàn bộ state hiện tại
                }),
                [p]
            );

            // báo cho những thằng khác
            dispatcher.broadcastMessage(
                2,
                JSON.stringify({ type: "join", id: p.userId }),
                Object.values(ctx.presences).filter(pp => pp.userId !== p.userId)
            );
        }
        return { state };
    },

    matchLeave: function (ctx, logger, nk, dispatcher, tick, state, presences) {
        for (const p of presences) {
            delete state.players[p.userId];
            dispatcher.broadcastMessage(
                4,
                JSON.stringify({ type: "leave", id: p.userId })
            );
        }
        return { state };
    },

    matchLoop: function (ctx, logger, nk, dispatcher, tick, state, messages) {
        for (const m of messages) {
            try {
                const msg = JSON.parse(new TextDecoder().decode(m.data));
                if (msg.type === "update") {
                    // update server state
                    state.players[m.sender.userId] = {
                        pos: msg.pos,
                        yaw: msg.yaw,
                        state: msg.state,
                    };

                    // gửi cho các player khác (không gửi lại cho sender)
                    dispatcher.broadcastMessage(
                        3, // ⚡ phải match với FE sendMatchState(..., 3, ...)
                        JSON.stringify({
                            type: "update",
                            id: m.sender.userId,
                            pos: msg.pos,
                            yaw: msg.yaw,
                            state: msg.state,
                        }),
                        [m.sender]
                    );
                }
            } catch (e) {
                logger.error("Invalid message: " + e);
            }
        }
        return { state };
    },

};

function InitModule(ctx, logger, nk, initializer) {
    initializer.registerMatch(
        "pepe_match",
        PepeMatch.matchInit,
        PepeMatch.matchJoinAttempt,
        PepeMatch.matchJoin,
        PepeMatch.matchLeave,
        PepeMatch.matchLoop
    );
}
!InitModule;
