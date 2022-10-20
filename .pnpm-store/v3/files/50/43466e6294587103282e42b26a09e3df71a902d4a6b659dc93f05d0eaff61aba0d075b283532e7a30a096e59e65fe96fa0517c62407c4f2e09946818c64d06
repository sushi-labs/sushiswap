"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLambdaOptionsFromFunction = exports.createZip = exports.createLambda = exports.Lambda = void 0;
const assert_1 = __importDefault(require("assert"));
const async_sema_1 = __importDefault(require("async-sema"));
const yazl_1 = require("yazl");
const minimatch_1 = __importDefault(require("minimatch"));
const fs_extra_1 = require("fs-extra");
const download_1 = require("./fs/download");
const stream_to_buffer_1 = __importDefault(require("./fs/stream-to-buffer"));
class Lambda {
    constructor(opts) {
        const { handler, runtime, maxDuration, memory, environment = {}, allowQuery, regions, supportsMultiPayloads, } = opts;
        if ('files' in opts) {
            assert_1.default(typeof opts.files === 'object', '"files" must be an object');
        }
        if ('zipBuffer' in opts) {
            assert_1.default(Buffer.isBuffer(opts.zipBuffer), '"zipBuffer" must be a Buffer');
        }
        assert_1.default(typeof handler === 'string', '"handler" is not a string');
        assert_1.default(typeof runtime === 'string', '"runtime" is not a string');
        assert_1.default(typeof environment === 'object', '"environment" is not an object');
        if (memory !== undefined) {
            assert_1.default(typeof memory === 'number', '"memory" is not a number');
        }
        if (maxDuration !== undefined) {
            assert_1.default(typeof maxDuration === 'number', '"maxDuration" is not a number');
        }
        if (allowQuery !== undefined) {
            assert_1.default(Array.isArray(allowQuery), '"allowQuery" is not an Array');
            assert_1.default(allowQuery.every(q => typeof q === 'string'), '"allowQuery" is not a string Array');
        }
        if (supportsMultiPayloads !== undefined) {
            assert_1.default(typeof supportsMultiPayloads === 'boolean', '"supportsMultiPayloads" is not a boolean');
        }
        if (regions !== undefined) {
            assert_1.default(Array.isArray(regions), '"regions" is not an Array');
            assert_1.default(regions.every(r => typeof r === 'string'), '"regions" is not a string Array');
        }
        this.type = 'Lambda';
        this.files = 'files' in opts ? opts.files : undefined;
        this.handler = handler;
        this.runtime = runtime;
        this.memory = memory;
        this.maxDuration = maxDuration;
        this.environment = environment;
        this.allowQuery = allowQuery;
        this.regions = regions;
        this.zipBuffer = 'zipBuffer' in opts ? opts.zipBuffer : undefined;
        this.supportsMultiPayloads = supportsMultiPayloads;
    }
    async createZip() {
        let { zipBuffer } = this;
        if (!zipBuffer) {
            if (!this.files) {
                throw new Error('`files` is not defined');
            }
            await sema.acquire();
            try {
                zipBuffer = await createZip(this.files);
            }
            finally {
                sema.release();
            }
        }
        return zipBuffer;
    }
}
exports.Lambda = Lambda;
const sema = new async_sema_1.default(10);
const mtime = new Date(1540000000000);
/**
 * @deprecated Use `new Lambda()` instead.
 */
async function createLambda(opts) {
    const lambda = new Lambda(opts);
    // backwards compat
    lambda.zipBuffer = await lambda.createZip();
    return lambda;
}
exports.createLambda = createLambda;
async function createZip(files) {
    const names = Object.keys(files).sort();
    const symlinkTargets = new Map();
    for (const name of names) {
        const file = files[name];
        if (file.mode && download_1.isSymbolicLink(file.mode) && file.type === 'FileFsRef') {
            const symlinkTarget = await fs_extra_1.readlink(file.fsPath);
            symlinkTargets.set(name, symlinkTarget);
        }
    }
    const zipFile = new yazl_1.ZipFile();
    const zipBuffer = await new Promise((resolve, reject) => {
        for (const name of names) {
            const file = files[name];
            const opts = { mode: file.mode, mtime };
            const symlinkTarget = symlinkTargets.get(name);
            if (typeof symlinkTarget === 'string') {
                zipFile.addBuffer(Buffer.from(symlinkTarget, 'utf8'), name, opts);
            }
            else {
                const stream = file.toStream();
                stream.on('error', reject);
                zipFile.addReadStream(stream, name, opts);
            }
        }
        zipFile.end();
        stream_to_buffer_1.default(zipFile.outputStream).then(resolve).catch(reject);
    });
    return zipBuffer;
}
exports.createZip = createZip;
async function getLambdaOptionsFromFunction({ sourceFile, config, }) {
    if (config?.functions) {
        for (const [pattern, fn] of Object.entries(config.functions)) {
            if (sourceFile === pattern || minimatch_1.default(sourceFile, pattern)) {
                return {
                    memory: fn.memory,
                    maxDuration: fn.maxDuration,
                };
            }
        }
    }
    return {};
}
exports.getLambdaOptionsFromFunction = getLambdaOptionsFromFunction;
