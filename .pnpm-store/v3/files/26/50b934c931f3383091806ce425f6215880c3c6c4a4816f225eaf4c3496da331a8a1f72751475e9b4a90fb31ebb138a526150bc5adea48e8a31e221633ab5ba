"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectSourcesSync = exports.collectSources = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
const load_file_js_1 = require("./load-file.js");
const helpers_js_1 = require("../utils/helpers.js");
const custom_loader_js_1 = require("../utils/custom-loader.js");
const queue_js_1 = require("../utils/queue.js");
const module_1 = require("module");
const process_1 = require("process");
const CONCURRENCY_LIMIT = 50;
async function collectSources({ pointerOptionMap, options, }) {
    const sources = [];
    const queue = (0, queue_js_1.useQueue)({ concurrency: CONCURRENCY_LIMIT });
    const { addSource, collect } = createHelpers({
        sources,
        stack: [collectDocumentString, collectCustomLoader, collectFallback],
    });
    for (const pointer in pointerOptionMap) {
        const pointerOptions = pointerOptionMap[pointer];
        collect({
            pointer,
            pointerOptions,
            pointerOptionMap,
            options,
            addSource,
            queue: queue.add,
        });
    }
    await queue.runAll();
    return sources;
}
exports.collectSources = collectSources;
function collectSourcesSync({ pointerOptionMap, options, }) {
    const sources = [];
    const queue = (0, queue_js_1.useSyncQueue)();
    const { addSource, collect } = createHelpers({
        sources,
        stack: [collectDocumentString, collectCustomLoaderSync, collectFallbackSync],
    });
    for (const pointer in pointerOptionMap) {
        const pointerOptions = pointerOptionMap[pointer];
        collect({
            pointer,
            pointerOptions,
            pointerOptionMap,
            options,
            addSource,
            queue: queue.add,
        });
    }
    queue.runAll();
    return sources;
}
exports.collectSourcesSync = collectSourcesSync;
function createHelpers({ sources, stack }) {
    const addSource = ({ source }) => {
        sources.push(source);
    };
    const collect = (0, helpers_js_1.useStack)(...stack);
    return {
        addSource,
        collect,
    };
}
function addResultOfCustomLoader({ pointer, result, addSource, }) {
    if ((0, graphql_1.isSchema)(result)) {
        addSource({
            source: {
                location: pointer,
                schema: result,
                document: (0, utils_1.getDocumentNodeFromSchema)(result),
            },
            pointer,
            noCache: true,
        });
    }
    else if (result.kind && result.kind === graphql_1.Kind.DOCUMENT) {
        addSource({
            source: {
                document: result,
                location: pointer,
            },
            pointer,
        });
    }
    else if (result.document) {
        addSource({
            source: {
                location: pointer,
                ...result,
            },
            pointer,
        });
    }
}
function collectDocumentString({ pointer, pointerOptions, options, addSource, queue }, next) {
    if ((0, utils_1.isDocumentString)(pointer)) {
        return queue(() => {
            const source = (0, utils_1.parseGraphQLSDL)(`${(0, helpers_js_1.stringToHash)(pointer)}.graphql`, pointer, {
                ...options,
                ...pointerOptions,
            });
            addSource({
                source,
                pointer,
            });
        });
    }
    next();
}
function collectCustomLoader({ pointer, pointerOptions, queue, addSource, options, pointerOptionMap }, next) {
    if (pointerOptions.loader) {
        return queue(async () => {
            await Promise.all((0, utils_1.asArray)(pointerOptions.require).map(m => Promise.resolve().then(() => __importStar(require(m)))));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore TODO options.cwd is possibly undefined, but it seems like no test covers this path
            const loader = await (0, custom_loader_js_1.useCustomLoader)(pointerOptions.loader, options.cwd);
            const result = await loader(pointer, { ...options, ...pointerOptions }, pointerOptionMap);
            if (!result) {
                return;
            }
            addResultOfCustomLoader({ pointer, result, addSource });
        });
    }
    next();
}
function collectCustomLoaderSync({ pointer, pointerOptions, queue, addSource, options, pointerOptionMap }, next) {
    if (pointerOptions.loader) {
        return queue(() => {
            const cwdRequire = (0, module_1.createRequire)(options.cwd || (0, process_1.cwd)());
            for (const m of (0, utils_1.asArray)(pointerOptions.require)) {
                cwdRequire(m);
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore TODO options.cwd is possibly undefined, but it seems like no test covers this path
            const loader = (0, custom_loader_js_1.useCustomLoaderSync)(pointerOptions.loader, options.cwd);
            const result = loader(pointer, { ...options, ...pointerOptions }, pointerOptionMap);
            if (result) {
                addResultOfCustomLoader({ pointer, result, addSource });
            }
        });
    }
    next();
}
function collectFallback({ queue, pointer, options, pointerOptions, addSource }) {
    return queue(async () => {
        const sources = await (0, load_file_js_1.loadFile)(pointer, {
            ...options,
            ...pointerOptions,
        });
        if (sources) {
            for (const source of sources) {
                addSource({ source, pointer });
            }
        }
    });
}
function collectFallbackSync({ queue, pointer, options, pointerOptions, addSource }) {
    return queue(() => {
        const sources = (0, load_file_js_1.loadFileSync)(pointer, {
            ...options,
            ...pointerOptions,
        });
        if (sources) {
            for (const source of sources) {
                addSource({ source, pointer });
            }
        }
    });
}
