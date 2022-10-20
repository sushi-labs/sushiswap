#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const edge_runtime_1 = require("../edge-runtime");
const util_1 = require("util");
const fs_1 = require("fs");
const server_1 = require("../server");
const child_process_1 = __importDefault(require("child_process"));
const exit_hook_1 = __importDefault(require("exit-hook"));
const mri_1 = __importDefault(require("mri"));
const path_1 = __importDefault(require("path"));
const { _: input, ...flags } = (0, mri_1.default)(process.argv.slice(2), {
    default: {
        cwd: process.cwd(),
        listen: false,
        port: 3000,
        repl: false,
    },
});
async function main() {
    const logger = (0, logger_1.createLogger)();
    /**
     * If there is no script path to run a server, the CLI will start a REPL.
     */
    const [scriptPath] = input;
    if (!scriptPath) {
        const replPath = path_1.default.resolve(__dirname, 'repl.js');
        return (0, util_1.promisify)(child_process_1.default.spawn).call(null, 'node', [replPath], {
            stdio: 'inherit',
        });
    }
    const initialCode = (0, fs_1.readFileSync)(path_1.default.resolve(process.cwd(), scriptPath), 'utf-8');
    const runtime = new edge_runtime_1.EdgeRuntime({ initialCode });
    if (!flags.listen)
        return runtime.evaluate('');
    logger.debug(`v${String(require('../../package.json').version)} at Node.js ${process.version}`);
    /**
     * Start a server with the script provided in the file path.
     */
    const server = await (0, server_1.runServer)({
        logger: logger,
        port: flags.port,
        runtime,
    });
    (0, exit_hook_1.default)(() => server.close());
    logger(`Waiting incoming requests at ${logger.quotes(server.url)}`);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map