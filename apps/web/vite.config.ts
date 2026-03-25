import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { type Plugin, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Serves clay.wasm from @shelby-protocol/clay-codes during dev.
 * Vite pre-bundles the SDK into /node_modules/.vite/deps/ chunks,
 * which resolve clay.wasm relative to that dir — a path that doesn't exist.
 * This middleware intercepts the request and serves the real file.
 */
function serveClayWasm(): Plugin {
	let wasmPath = "";

	return {
		name: "serve-clay-wasm",
		configResolved(config) {
			// Resolve clay.wasm from the installed package
			const candidates = [
				resolve(config.root, "node_modules/@shelby-protocol/clay-codes/dist/clay.wasm"),
				resolve(config.root, "../../node_modules/.bun/@shelby-protocol+clay-codes@0.0.2/node_modules/@shelby-protocol/clay-codes/dist/clay.wasm"),
			];
			for (const p of candidates) {
				if (existsSync(p)) {
					wasmPath = p;
					break;
				}
			}
		},
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				if (req.url?.endsWith("/clay.wasm") && wasmPath) {
					res.setHeader("Content-Type", "application/wasm");
					res.end(readFileSync(wasmPath));
					return;
				}
				next();
			});
		},
	};
}

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		tailwindcss(),
		tanstackStart({
			spa: { enabled: true },
		}),
		viteReact(),
		serveClayWasm(),
	],
	server: {
		port: 3001,
	},
});
