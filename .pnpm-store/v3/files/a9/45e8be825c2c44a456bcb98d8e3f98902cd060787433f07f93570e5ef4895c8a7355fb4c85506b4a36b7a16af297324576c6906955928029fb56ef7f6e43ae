import type { Plugin } from 'esbuild';
export declare class WasmAssets {
    private readonly assets;
    /**
     * Declare a WebAssembly binding
     */
    declare(filePath: string): Promise<string>;
    /**
     * Get an object with the context needed to execute the code
     * built with the plugin
     */
    getContext(): Promise<Record<string, WebAssembly.Module>>;
    /**
     * Allow to iterate easily
     */
    [Symbol.iterator](): IterableIterator<[string, string]>;
}
export declare function createEdgeWasmPlugin(): {
    plugin: Plugin;
    wasmAssets: WasmAssets;
};
