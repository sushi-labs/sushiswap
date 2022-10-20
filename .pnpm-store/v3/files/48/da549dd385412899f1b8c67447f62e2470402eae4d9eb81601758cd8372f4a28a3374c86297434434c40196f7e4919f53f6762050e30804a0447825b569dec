"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runServer = void 0;
const create_handler_1 = require("./create-handler");
const events_1 = require("events");
const http_1 = __importDefault(require("http"));
/**
 * This helper will create a handler based on the given options and then
 * immediately run a server on the provided port. If there is no port, the
 * server will use a random one.
 */
async function runServer(options) {
    const { handler, waitUntil } = (0, create_handler_1.createHandler)(options);
    const server = http_1.default.createServer(handler);
    server.listen(options.port);
    try {
        await (0, events_1.once)(server, 'listening');
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === 'EADDRINUSE') {
            return runServer({ ...options, port: undefined });
        }
        throw error;
    }
    const address = server.address();
    const url = typeof address === 'string' || address == null
        ? String(address)
        : `http://localhost:${address.port}`;
    return {
        url,
        close: async () => {
            await waitUntil();
            await new Promise((resolve, reject) => {
                return server.close((err) => {
                    if (err)
                        reject(err);
                    resolve();
                });
            });
        },
        waitUntil,
    };
}
exports.runServer = runServer;
//# sourceMappingURL=run-server.js.map