"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixConfig = exports.register = void 0;
const build_utils_1 = require("@vercel/build-utils");
const path_1 = require("path");
/*
 * Fork of TS-Node - https://github.com/TypeStrong/ts-node
 * Copyright Blake Embrey
 * MIT License
 */
/**
 * Debugging.
 */
const shouldDebug = false;
const debug = shouldDebug
    ? console.log.bind(console, 'ts-node')
    : () => undefined;
const debugFn = shouldDebug
    ? (key, fn) => {
        let i = 0;
        return (x) => {
            debug(key, x, ++i);
            return fn(x);
        };
    }
    : (_, fn) => fn;
/**
 * Track the project information.
 */
class MemoryCache {
    constructor(rootFileNames = []) {
        this.fileContents = new Map();
        this.fileVersions = new Map();
        for (const fileName of rootFileNames)
            this.fileVersions.set(fileName, 1);
    }
}
/**
 * Default register options.
 */
const DEFAULTS = {
    files: null,
    pretty: null,
    compiler: undefined,
    compilerOptions: undefined,
    ignore: undefined,
    project: undefined,
    ignoreDiagnostics: undefined,
    logError: null,
};
/**
 * Default TypeScript compiler options required by `ts-node`.
 */
const TS_NODE_COMPILER_OPTIONS = {
    sourceMap: true,
    inlineSourceMap: false,
    inlineSources: true,
    declaration: false,
    noEmit: false,
    outDir: '$$ts-node$$',
};
/**
 * Replace backslashes with forward slashes.
 */
function normalizeSlashes(value) {
    return value.replace(/\\/g, '/');
}
/**
 * Cached fs operation wrapper.
 */
function cachedLookup(fn) {
    const cache = new Map();
    return (arg) => {
        if (!cache.has(arg)) {
            cache.set(arg, fn(arg));
        }
        return cache.get(arg);
    };
}
/**
 * Register TypeScript compiler.
 */
function register(opts = {}) {
    const options = Object.assign({}, DEFAULTS, opts);
    const ignoreDiagnostics = [
        6059,
        18002,
        18003,
        ...(options.ignoreDiagnostics || []),
    ].map(Number);
    // Require the TypeScript compiler and configuration.
    const cwd = options.basePath || process.cwd();
    const nowNodeBase = path_1.resolve(__dirname, '..', '..', '..');
    let compiler;
    const require_ = eval('require');
    try {
        compiler = require_.resolve(options.compiler || 'typescript', {
            paths: [options.project || cwd, nowNodeBase],
        });
    }
    catch (e) {
        compiler = 'typescript';
    }
    //eslint-disable-next-line @typescript-eslint/no-var-requires
    const ts = require_(compiler);
    if (compiler.startsWith(nowNodeBase)) {
        console.log('Using TypeScript ' + ts.version + ' (no local tsconfig.json)');
    }
    else {
        console.log('Using TypeScript ' + ts.version + ' (local user-provided)');
    }
    const transformers = options.transformers || undefined;
    const readFile = options.readFile || ts.sys.readFile;
    const fileExists = options.fileExists || ts.sys.fileExists;
    const formatDiagnostics = process.stdout.isTTY || options.pretty
        ? ts.formatDiagnosticsWithColorAndContext
        : ts.formatDiagnostics;
    const diagnosticHost = {
        getNewLine: () => ts.sys.newLine,
        getCurrentDirectory: () => cwd,
        getCanonicalFileName: path => path,
    };
    function createTSError(diagnostics) {
        const message = formatDiagnostics(diagnostics, diagnosticHost);
        return new build_utils_1.NowBuildError({ code: 'NODE_TYPESCRIPT_ERROR', message });
    }
    function reportTSError(diagnostics, shouldExit) {
        if (!diagnostics || diagnostics.length === 0) {
            return;
        }
        const error = createTSError(diagnostics);
        if (shouldExit) {
            throw error;
        }
        else {
            // Print error in red color and continue execution.
            console.error('\x1b[31m%s\x1b[0m', error);
        }
    }
    // we create a custom build per tsconfig.json instance
    const builds = new Map();
    function getBuild(configFileName = '') {
        let build = builds.get(configFileName);
        if (build)
            return build;
        const config = readConfig(configFileName);
        /**
         * Create the basic required function using transpile mode.
         */
        const getOutput = function (code, fileName) {
            const result = ts.transpileModule(code, {
                fileName,
                transformers,
                compilerOptions: config.options,
                reportDiagnostics: true,
            });
            const diagnosticList = result.diagnostics
                ? filterDiagnostics(result.diagnostics, ignoreDiagnostics)
                : [];
            reportTSError(diagnosticList, config.options.noEmitOnError);
            return { code: result.outputText, map: result.sourceMapText };
        };
        // Use full language services when the fast option is disabled.
        let getOutputTypeCheck;
        {
            const memoryCache = new MemoryCache(config.fileNames);
            const cachedReadFile = cachedLookup(debugFn('readFile', readFile));
            // Create the compiler host for type checking.
            const serviceHost = {
                getScriptFileNames: () => Array.from(memoryCache.fileVersions.keys()),
                getScriptVersion: (fileName) => {
                    const version = memoryCache.fileVersions.get(fileName);
                    return version === undefined ? '' : version.toString();
                },
                getScriptSnapshot(fileName) {
                    let contents = memoryCache.fileContents.get(fileName);
                    // Read contents into TypeScript memory cache.
                    if (contents === undefined) {
                        contents = cachedReadFile(fileName);
                        if (contents === undefined)
                            return;
                        memoryCache.fileVersions.set(fileName, 1);
                        memoryCache.fileContents.set(fileName, contents);
                    }
                    return ts.ScriptSnapshot.fromString(contents);
                },
                readFile: cachedReadFile,
                readDirectory: cachedLookup(debugFn('readDirectory', ts.sys.readDirectory)),
                getDirectories: cachedLookup(debugFn('getDirectories', ts.sys.getDirectories)),
                fileExists: cachedLookup(debugFn('fileExists', fileExists)),
                directoryExists: cachedLookup(debugFn('directoryExists', ts.sys.directoryExists)),
                getNewLine: () => ts.sys.newLine,
                useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
                getCurrentDirectory: () => cwd,
                getCompilationSettings: () => config.options,
                getDefaultLibFileName: () => ts.getDefaultLibFilePath(config.options),
                getCustomTransformers: () => transformers,
            };
            const registry = ts.createDocumentRegistry(ts.sys.useCaseSensitiveFileNames, cwd);
            const service = ts.createLanguageService(serviceHost, registry);
            // Set the file contents into cache manually.
            const updateMemoryCache = function (contents, fileName) {
                const fileVersion = memoryCache.fileVersions.get(fileName) || 0;
                // Avoid incrementing cache when nothing has changed.
                if (memoryCache.fileContents.get(fileName) === contents)
                    return;
                memoryCache.fileVersions.set(fileName, fileVersion + 1);
                memoryCache.fileContents.set(fileName, contents);
            };
            getOutputTypeCheck = function (code, fileName) {
                updateMemoryCache(code, fileName);
                const output = service.getEmitOutput(fileName);
                // Get the relevant diagnostics - this is 3x faster than `getPreEmitDiagnostics`.
                const diagnostics = service
                    .getSemanticDiagnostics(fileName)
                    .concat(service.getSyntacticDiagnostics(fileName));
                const diagnosticList = filterDiagnostics(diagnostics, ignoreDiagnostics);
                reportTSError(diagnosticList, config.options.noEmitOnError);
                if (output.emitSkipped) {
                    throw new TypeError(`${path_1.relative(cwd, fileName)}: Emit skipped`);
                }
                // Throw an error when requiring `.d.ts` files.
                if (output.outputFiles.length === 0) {
                    throw new TypeError('Unable to require `.d.ts` file.\n' +
                        'This is usually the result of a faulty configuration or import. ' +
                        'Make sure there is a `.js`, `.json` or another executable extension and ' +
                        'loader (attached before `ts-node`) available alongside ' +
                        `\`${path_1.basename(fileName)}\`.`);
                }
                return {
                    code: output.outputFiles[1].text,
                    map: output.outputFiles[0].text,
                };
            };
        }
        builds.set(configFileName, (build = {
            getOutput,
            getOutputTypeCheck,
        }));
        return build;
    }
    // determine the tsconfig.json path for a given folder
    function detectConfig() {
        let configFileName = undefined;
        // Read project configuration when available.
        configFileName = options.project
            ? ts.findConfigFile(normalizeSlashes(options.project), fileExists)
            : ts.findConfigFile(normalizeSlashes(cwd), fileExists);
        if (configFileName)
            return normalizeSlashes(configFileName);
    }
    /**
     * Load TypeScript configuration.
     */
    function readConfig(configFileName) {
        let config = { compilerOptions: {} };
        const basePath = normalizeSlashes(path_1.dirname(configFileName));
        // Read project configuration when available.
        if (configFileName) {
            const result = ts.readConfigFile(configFileName, readFile);
            // Return diagnostics.
            if (result.error) {
                const errorResult = {
                    errors: [result.error],
                    fileNames: [],
                    options: {},
                };
                const configDiagnosticList = filterDiagnostics(errorResult.errors, ignoreDiagnostics);
                // Render the configuration errors.
                reportTSError(configDiagnosticList, true);
                return errorResult;
            }
            config = result.config;
        }
        // Remove resolution of "files".
        if (!options.files) {
            config.files = [];
            config.include = [];
        }
        // Override default configuration options `ts-node` requires.
        config.compilerOptions = Object.assign({}, config.compilerOptions, options.compilerOptions, TS_NODE_COMPILER_OPTIONS);
        fixConfig(config, options.nodeVersionMajor);
        const configResult = ts.parseJsonConfigFileContent(config, ts.sys, basePath, undefined, configFileName);
        if (configFileName) {
            const configDiagnosticList = filterDiagnostics(configResult.errors, ignoreDiagnostics);
            // Render the configuration errors.
            reportTSError(configDiagnosticList, configResult.options.noEmitOnError);
        }
        return configResult;
    }
    // Create a simple TypeScript compiler proxy.
    function compile(code, fileName, skipTypeCheck) {
        const configFileName = detectConfig();
        const build = getBuild(configFileName);
        const { code: value, map: sourceMap } = (skipTypeCheck ? build.getOutput : build.getOutputTypeCheck)(code, fileName);
        const output = {
            code: value,
            map: Object.assign(JSON.parse(sourceMap), {
                file: path_1.basename(fileName),
                sources: [fileName],
            }),
        };
        delete output.map.sourceRoot;
        return output;
    }
    return compile;
}
exports.register = register;
/**
 * Do post-processing on config options to support `ts-node`.
 */
function fixConfig(config, nodeVersionMajor = 12) {
    if (!config.compilerOptions) {
        config.compilerOptions = {};
    }
    // Delete options that *should not* be passed through.
    delete config.compilerOptions.out;
    delete config.compilerOptions.outFile;
    delete config.compilerOptions.composite;
    delete config.compilerOptions.declarationDir;
    delete config.compilerOptions.declarationMap;
    delete config.compilerOptions.emitDeclarationOnly;
    delete config.compilerOptions.tsBuildInfoFile;
    delete config.compilerOptions.incremental;
    // This will prevent TS from polyfill/downlevel emit.
    if (config.compilerOptions.target === undefined) {
        // See https://github.com/tsconfig/bases/tree/main/bases
        let target;
        if (nodeVersionMajor >= 16) {
            target = 'ES2021';
        }
        else if (nodeVersionMajor >= 14) {
            target = 'ES2020';
        }
        else {
            target = 'ES2019';
        }
        config.compilerOptions.target = target;
    }
    // When mixing TS with JS, its best to enable this flag.
    // This is useful when no `tsconfig.json` is supplied.
    if (config.compilerOptions.esModuleInterop === undefined) {
        config.compilerOptions.esModuleInterop = true;
    }
    // Target CommonJS, always!
    config.compilerOptions.module = 'CommonJS';
    return config;
}
exports.fixConfig = fixConfig;
/**
 * Filter diagnostics.
 */
function filterDiagnostics(diagnostics, ignore) {
    return diagnostics.filter(x => ignore.indexOf(x.code) === -1);
}
