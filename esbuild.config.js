import esbuild from "esbuild";

esbuild.build({
    entryPoints: [
        "modules/config.js",
        "modules/opcodes.js",
        "modules/utils.js",
        "modules/handlers/movement.js",
        "modules/handlers/combat.js",
        "modules/handlers/chat.js",
        "modules/pepe_match.js",
        "modules/init.js"
    ],
    bundle: true,
    outfile: "dist/init.js",
    platform: "node",
    format: "iife",       // quan trọng: build ra global
    globalName: "NakamaMod", // không bắt buộc, chỉ để wrap
    allowOverwrite: true,
}).catch(() => process.exit(1));
