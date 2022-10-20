import type { Primitives } from '@edge-runtime/vm';
import { Options } from './create-handler';
interface ServerOptions<T extends Primitives> extends Options<T> {
    /**
     * The port to start the server. If none is provided it will use a random
     * available port.
     */
    port?: number;
}
interface EdgeRuntimeServer {
    /**
     * The server URL.
     */
    url: string;
    /**
     * Waits for all the current effects and closes the server.
     */
    close: () => Promise<void>;
    /**
     * Waits for all current effects returning their result.
     */
    waitUntil: () => Promise<any[]>;
}
/**
 * This helper will create a handler based on the given options and then
 * immediately run a server on the provided port. If there is no port, the
 * server will use a random one.
 */
export declare function runServer<T extends Primitives>(options: ServerOptions<T>): Promise<EdgeRuntimeServer>;
export {};
