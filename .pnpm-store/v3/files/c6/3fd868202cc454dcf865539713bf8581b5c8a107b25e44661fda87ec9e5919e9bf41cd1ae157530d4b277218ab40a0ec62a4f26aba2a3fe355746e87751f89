"use strict";
// copied from `edge-functions-bridge`:
// https://github.com/vercel/runtimes/blob/c076db9e3ce5635f7c2690396e3d9f791a0fd808/packages/edge-functions-bridge/src/get-edge-function-source.ts#L282-L317
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEdgeWasmPlugin = exports.WasmAssets = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
class WasmAssets {
    constructor() {
        this.assets = new Map();
    }
    /**
     * Declare a WebAssembly binding
     */
    async declare(filePath) {
        const hash = sha1(await fs_1.promises.readFile(filePath));
        const name = `wasm_${hash}`;
        this.assets.set(name, filePath);
        return name;
    }
    /**
     * Get an object with the context needed to execute the code
     * built with the plugin
     */
    async getContext() {
        const promises = [];
        const context = {};
        for (const [name, filePath] of this.assets) {
            promises.push((async () => {
                const bytes = await fs_1.promises.readFile(filePath);
                context[name] = await WebAssembly.compile(bytes);
            })());
        }
        await Promise.all(promises);
        return context;
    }
    /**
     * Allow to iterate easily
     */
    [Symbol.iterator]() {
        return this.assets[Symbol.iterator]();
    }
}
exports.WasmAssets = WasmAssets;
function createEdgeWasmPlugin() {
    const wasmAssets = new WasmAssets();
    const plugin = {
        name: 'vercel-wasm',
        setup(b) {
            b.onResolve({ filter: /\.wasm\?module/i }, async (data) => {
                const wasmFile = data.path.replace(/\?module$/, '');
                const resolvedPath = await b.resolve(wasmFile, {
                    importer: data.importer,
                    resolveDir: data.resolveDir,
                });
                if (!resolvedPath.path) {
                    return {
                        errors: [
                            { text: `WebAssembly file could not be located: ${wasmFile}` },
                        ],
                    };
                }
                const name = await wasmAssets.declare(resolvedPath.path);
                return {
                    path: name,
                    namespace: 'vercel-wasm',
                };
            });
            b.onLoad({ namespace: 'vercel-wasm', filter: /.+/ }, args => {
                return {
                    loader: 'js',
                    contents: `export default globalThis[${JSON.stringify(args.path)}]`,
                };
            });
        },
    };
    return { plugin, wasmAssets };
}
exports.createEdgeWasmPlugin = createEdgeWasmPlugin;
function sha1(data) {
    return crypto_1.createHash('sha1').update(data).digest('hex');
}
