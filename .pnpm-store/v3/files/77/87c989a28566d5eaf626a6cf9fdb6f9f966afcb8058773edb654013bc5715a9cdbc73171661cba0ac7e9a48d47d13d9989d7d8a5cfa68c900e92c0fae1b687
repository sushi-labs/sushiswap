"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixConfigDev = exports.onDevRequest = exports.rawBody = void 0;
const entrypoint = process.env.VERCEL_DEV_ENTRYPOINT;
delete process.env.VERCEL_DEV_ENTRYPOINT;
const tsconfig = process.env.VERCEL_DEV_TSCONFIG;
delete process.env.VERCEL_DEV_TSCONFIG;
if (!entrypoint) {
    throw new Error('`VERCEL_DEV_ENTRYPOINT` must be defined');
}
const path_1 = require("path");
const ts_node_1 = require("ts-node");
const typescript_1 = require("./typescript");
let useRequire = false;
if (!process.env.VERCEL_DEV_IS_ESM) {
    const resolveTypescript = (p) => {
        try {
            return require.resolve('typescript', {
                paths: [p],
            });
        }
        catch (_) {
            return '';
        }
    };
    const requireTypescript = (p) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require(p);
    };
    let ts = null;
    // Use the project's version of Typescript if available and supports `target`
    let compiler = resolveTypescript(process.cwd());
    if (compiler) {
        ts = requireTypescript(compiler);
    }
    // Otherwise fall back to using the copy that `@vercel/node` uses
    if (!ts) {
        compiler = resolveTypescript(path_1.join(__dirname, '..'));
        ts = requireTypescript(compiler);
    }
    let config = {};
    if (tsconfig) {
        try {
            config = ts.readConfigFile(tsconfig, ts.sys.readFile).config;
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                console.error(`Error while parsing "${tsconfig}"`);
                throw err;
            }
        }
    }
    fixConfigDev(config);
    ts_node_1.register({
        compiler,
        compilerOptions: config.compilerOptions,
        transpileOnly: true,
    });
    useRequire = true;
}
const http_1 = require("http");
const launcher_js_1 = require("@vercel/node-bridge/launcher.js");
function listen(server, port, host) {
    return new Promise(resolve => {
        server.listen(port, host, () => {
            resolve();
        });
    });
}
let bridge = undefined;
async function main() {
    const config = JSON.parse(process.env.VERCEL_DEV_CONFIG || '{}');
    delete process.env.VERCEL_DEV_CONFIG;
    const buildEnv = JSON.parse(process.env.VERCEL_DEV_BUILD_ENV || '{}');
    delete process.env.VERCEL_DEV_BUILD_ENV;
    const shouldAddHelpers = !(config.helpers === false || buildEnv.NODEJS_HELPERS === '0');
    const proxyServer = http_1.createServer(onDevRequest);
    await listen(proxyServer, 0, '127.0.0.1');
    const launcher = launcher_js_1.getVercelLauncher({
        entrypointPath: path_1.join(process.cwd(), entrypoint),
        helpersPath: './helpers.js',
        shouldAddHelpers,
        useRequire,
        // not used
        bridgePath: '',
        sourcemapSupportPath: '',
    });
    bridge = launcher();
    const address = proxyServer.address();
    if (typeof process.send === 'function') {
        process.send(address);
    }
    else {
        console.log('Dev server listening:', address);
    }
}
function rawBody(readable) {
    return new Promise((resolve, reject) => {
        let bytes = 0;
        const chunks = [];
        readable.on('error', reject);
        readable.on('data', chunk => {
            chunks.push(chunk);
            bytes += chunk.length;
        });
        readable.on('end', () => {
            resolve(Buffer.concat(chunks, bytes));
        });
    });
}
exports.rawBody = rawBody;
async function onDevRequest(req, res) {
    const body = await rawBody(req);
    const event = {
        Action: 'Invoke',
        body: JSON.stringify({
            method: req.method,
            path: req.url,
            headers: req.headers,
            encoding: 'base64',
            body: body.toString('base64'),
        }),
    };
    if (!bridge) {
        res.statusCode = 500;
        res.end('Bridge is not ready, please try again');
        return;
    }
    const result = await bridge.launcher(event, {
        callbackWaitsForEmptyEventLoop: false,
    });
    res.statusCode = result.statusCode;
    for (const [key, value] of Object.entries(result.headers)) {
        if (typeof value !== 'undefined') {
            res.setHeader(key, value);
        }
    }
    res.end(Buffer.from(result.body, result.encoding));
}
exports.onDevRequest = onDevRequest;
function fixConfigDev(config) {
    const nodeVersionMajor = Number(process.versions.node.split('.')[0]);
    typescript_1.fixConfig(config, nodeVersionMajor);
    // In prod, `.ts` inputs use TypeScript and
    // `.js` inputs use Babel to convert ESM to CJS.
    // In dev, both `.ts` and `.js` inputs use ts-node
    // without Babel so we must enable `allowJs`.
    config.compilerOptions.allowJs = true;
    // In prod, we emit outputs to the filesystem.
    // In dev, we don't emit because we use ts-node.
    config.compilerOptions.noEmit = true;
}
exports.fixConfigDev = fixConfigDev;
main().catch(err => {
    console.error(err);
    process.exit(1);
});
