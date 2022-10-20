"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const debug_1 = __importDefault(require("debug"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const semver_1 = __importDefault(require("semver"));
const aggregate_error_1 = __importDefault(require("aggregate-error"));
const artifacts_1 = require("../internal/artifacts");
const config_env_1 = require("../internal/core/config/config-env");
const errors_1 = require("../internal/core/errors");
const errors_list_1 = require("../internal/core/errors-list");
const compilation_job_1 = require("../internal/solidity/compilation-job");
const compiler_1 = require("../internal/solidity/compiler");
const compiler_input_1 = require("../internal/solidity/compiler/compiler-input");
const downloader_1 = require("../internal/solidity/compiler/downloader");
const dependencyGraph_1 = require("../internal/solidity/dependencyGraph");
const parse_1 = require("../internal/solidity/parse");
const resolver_1 = require("../internal/solidity/resolver");
const glob_1 = require("../internal/util/glob");
const global_dir_1 = require("../internal/util/global-dir");
const strings_1 = require("../internal/util/strings");
const builtin_tasks_1 = require("../types/builtin-tasks");
const contract_names_1 = require("../utils/contract-names");
const source_names_1 = require("../utils/source-names");
const task_names_1 = require("./task-names");
const solidity_files_cache_1 = require("./utils/solidity-files-cache");
function isConsoleLogError(error) {
    return (error.type === "TypeError" &&
        typeof error.message === "string" &&
        error.message.includes("log") &&
        error.message.includes("type(library console)"));
}
const log = (0, debug_1.default)("hardhat:core:tasks:compile");
const COMPILE_TASK_FIRST_SOLC_VERSION_SUPPORTED = "0.4.11";
const DEFAULT_CONCURRENCY_LEVEL = Math.max(os_1.default.cpus().length - 1, 1);
/**
 * Returns a list of absolute paths to all the solidity files in the project.
 * This list doesn't include dependencies, for example solidity files inside
 * node_modules.
 *
 * This is the right task to override to change how the solidity files of the
 * project are obtained.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS, async (_, { config }) => {
    const paths = await (0, glob_1.glob)(path_1.default.join(config.paths.sources, "**/*.sol"));
    return paths;
});
/**
 * Receives a list of absolute paths and returns a list of source names
 * corresponding to each path. For example, receives
 * ["/home/user/project/contracts/Foo.sol"] and returns
 * ["contracts/Foo.sol"]. These source names will be used when the solc input
 * is generated.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_GET_SOURCE_NAMES)
    .addParam("sourcePaths", undefined, undefined, config_env_1.types.any)
    .setAction(async ({ sourcePaths }, { config }) => {
    const sourceNames = await Promise.all(sourcePaths.map((p) => (0, source_names_1.localPathToSourceName)(config.paths.root, p)));
    return sourceNames;
});
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_READ_FILE)
    .addParam("absolutePath", undefined, undefined, config_env_1.types.string)
    .setAction(async ({ absolutePath }) => {
    const content = await fs_extra_1.default.readFile(absolutePath, {
        encoding: "utf8",
    });
    return content;
});
/**
 * Receives a list of source names and returns a dependency graph. This task
 * is responsible for both resolving dependencies (like getting files from
 * node_modules) and generating the graph.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH)
    .addParam("sourceNames", undefined, undefined, config_env_1.types.any)
    .addOptionalParam("solidityFilesCache", undefined, undefined, config_env_1.types.any)
    .setAction(async ({ sourceNames, solidityFilesCache, }, { config, run }) => {
    const parser = new parse_1.Parser(solidityFilesCache);
    const resolver = new resolver_1.Resolver(config.paths.root, parser, (absolutePath) => run(task_names_1.TASK_COMPILE_SOLIDITY_READ_FILE, { absolutePath }));
    const resolvedFiles = await Promise.all(sourceNames.map((sn) => resolver.resolveSourceName(sn)));
    const dependencyGraph = await dependencyGraph_1.DependencyGraph.createFromResolvedFiles(resolver, resolvedFiles);
    return dependencyGraph;
});
/**
 * Receives a dependency graph and a file in it, and returns the compilation
 * job for that file. The compilation job should have everything that is
 * necessary to compile that file: a compiler config to be used and a list of
 * files to use as input of the compilation.
 *
 * If the file cannot be compiled, a MatchingCompilerFailure should be
 * returned instead.
 *
 * This is the right task to override to change the compiler configuration.
 * For example, if you want to change the compiler settings when targetting
 * rinkeby, you could do something like this:
 *
 *   const compilationJob = await runSuper();
 *   if (config.network.name === 'rinkeby') {
 *     compilationJob.solidityConfig.settings = newSettings;
 *   }
 *   return compilationJob;
 *
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE)
    .addParam("dependencyGraph", undefined, undefined, config_env_1.types.any)
    .addParam("file", undefined, undefined, config_env_1.types.any)
    .addOptionalParam("solidityFilesCache", undefined, undefined, config_env_1.types.any)
    .setAction(async ({ dependencyGraph, file, }, { config }) => {
    return (0, compilation_job_1.createCompilationJobFromFile)(dependencyGraph, file, config.solidity);
});
/**
 * Receives a dependency graph and returns a tuple with two arrays. The first
 * array is a list of CompilationJobsSuccess, where each item has a list of
 * compilation jobs. The second array is a list of CompilationJobsFailure,
 * where each item has a list of files that couldn't be compiled, grouped by
 * the reason for the failure.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOBS)
    .addParam("dependencyGraph", undefined, undefined, config_env_1.types.any)
    .addOptionalParam("solidityFilesCache", undefined, undefined, config_env_1.types.any)
    .setAction(async ({ dependencyGraph, solidityFilesCache, }, { run }) => {
    const connectedComponents = dependencyGraph.getConnectedComponents();
    log(`The dependency graph was divided in '${connectedComponents.length}' connected components`);
    const compilationJobsCreationResults = await Promise.all(connectedComponents.map((graph) => (0, compilation_job_1.createCompilationJobsFromConnectedComponent)(graph, (file) => run(task_names_1.TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE, {
        file,
        dependencyGraph,
        solidityFilesCache,
    }))));
    let jobs = [];
    let errors = [];
    for (const result of compilationJobsCreationResults) {
        jobs = jobs.concat(result.jobs);
        errors = errors.concat(result.errors);
    }
    return { jobs, errors };
});
/**
 * Receives a list of compilation jobs and returns a new list where some of
 * the compilation jobs might've been removed.
 *
 * This task can be overriden to change the way the cache is used, or to use
 * a different approach to filtering out compilation jobs.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_FILTER_COMPILATION_JOBS)
    .addParam("compilationJobs", undefined, undefined, config_env_1.types.any)
    .addParam("force", undefined, undefined, config_env_1.types.boolean)
    .addOptionalParam("solidityFilesCache", undefined, undefined, config_env_1.types.any)
    .setAction(async ({ compilationJobs, force, solidityFilesCache, }) => {
    (0, errors_1.assertHardhatInvariant)(solidityFilesCache !== undefined, "The implementation of this task needs a defined solidityFilesCache");
    if (force) {
        log(`force flag enabled, not filtering`);
        return compilationJobs;
    }
    const neededCompilationJobs = compilationJobs.filter((job) => needsCompilation(job, solidityFilesCache));
    const jobsFilteredOutCount = compilationJobs.length - neededCompilationJobs.length;
    log(`'${jobsFilteredOutCount}' jobs were filtered out`);
    return neededCompilationJobs;
});
/**
 * Receives a list of compilation jobs and returns a new list where some of
 * the jobs might've been merged.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_MERGE_COMPILATION_JOBS)
    .addParam("compilationJobs", undefined, undefined, config_env_1.types.any)
    .setAction(async ({ compilationJobs, }) => {
    return (0, compilation_job_1.mergeCompilationJobsWithoutBug)(compilationJobs);
});
/**
 * Prints a message when there's nothing to compile.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_LOG_NOTHING_TO_COMPILE)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .setAction(async ({ quiet }) => {
    if (!quiet) {
        console.log("Nothing to compile");
    }
});
/**
 * Receives a list of compilation jobs and sends each one to be compiled.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_COMPILE_JOBS)
    .addParam("compilationJobs", undefined, undefined, config_env_1.types.any)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .addParam("concurrency", undefined, DEFAULT_CONCURRENCY_LEVEL, config_env_1.types.int)
    .setAction(async ({ compilationJobs, quiet, concurrency, }, { run }) => {
    if (compilationJobs.length === 0) {
        log(`No compilation jobs to compile`);
        await run(task_names_1.TASK_COMPILE_SOLIDITY_LOG_NOTHING_TO_COMPILE, { quiet });
        return { artifactsEmittedPerJob: [] };
    }
    log(`Compiling ${compilationJobs.length} jobs`);
    const versionList = [];
    for (const job of compilationJobs) {
        const solcVersion = job.getSolcConfig().version;
        if (!versionList.includes(solcVersion)) {
            // versions older than 0.4.11 don't work with hardhat
            // see issue https://github.com/nomiclabs/hardhat/issues/2004
            if (semver_1.default.lt(solcVersion, COMPILE_TASK_FIRST_SOLC_VERSION_SUPPORTED)) {
                throw new errors_1.HardhatError(errors_list_1.ERRORS.BUILTIN_TASKS.COMPILE_TASK_UNSUPPORTED_SOLC_VERSION, {
                    version: solcVersion,
                    firstSupportedVersion: COMPILE_TASK_FIRST_SOLC_VERSION_SUPPORTED,
                });
            }
            versionList.push(solcVersion);
        }
    }
    /**
     * Downloading the same version of a compiler in parallel can cause an
     * error. When compilation jobs are executed in parallel, there's a chance
     * that both use the same solc version and trigger this problem. To
     * prevent that, we pre-download all the necessary compilers before
     * running the compilation jobs.
     */
    for (const solcVersion of versionList) {
        await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, {
            solcVersion,
            quiet: false,
        });
    }
    const { default: pMap } = await Promise.resolve().then(() => __importStar(require("p-map")));
    const pMapOptions = { concurrency, stopOnError: false };
    try {
        const artifactsEmittedPerJob = await pMap(compilationJobs, async (compilationJob, compilationJobIndex) => {
            const result = await run(task_names_1.TASK_COMPILE_SOLIDITY_COMPILE_JOB, {
                compilationJob,
                compilationJobs,
                compilationJobIndex,
                quiet,
            });
            return {
                compilationJob: result.compilationJob,
                artifactsEmittedPerFile: result.artifactsEmittedPerFile,
            };
        }, pMapOptions);
        return { artifactsEmittedPerJob };
    }
    catch (e) {
        if (!(e instanceof aggregate_error_1.default)) {
            // eslint-disable-next-line @nomiclabs/hardhat-internal-rules/only-hardhat-error
            throw e;
        }
        for (const error of e) {
            if (!errors_1.HardhatError.isHardhatErrorType(error, errors_list_1.ERRORS.BUILTIN_TASKS.COMPILE_FAILURE)) {
                // eslint-disable-next-line @nomiclabs/hardhat-internal-rules/only-hardhat-error
                throw error;
            }
        }
        // error is an aggregate error, and all errors are compilation failures
        throw new errors_1.HardhatError(errors_list_1.ERRORS.BUILTIN_TASKS.COMPILE_FAILURE);
    }
});
/**
 * Receives a compilation job and returns a CompilerInput.
 *
 * It's not recommended to override this task to modify the solc
 * configuration, override
 * TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE instead.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_GET_COMPILER_INPUT)
    .addParam("compilationJob", undefined, undefined, config_env_1.types.any)
    .setAction(async ({ compilationJob, }) => {
    return (0, compiler_input_1.getInputFromCompilationJob)(compilationJob);
});
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_LOG_DOWNLOAD_COMPILER_START)
    .addParam("isCompilerDownloaded", undefined, undefined, config_env_1.types.boolean)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .addParam("solcVersion", undefined, undefined, config_env_1.types.string)
    .setAction(async ({ isCompilerDownloaded, solcVersion, }) => {
    if (isCompilerDownloaded) {
        return;
    }
    console.log(`Downloading compiler ${solcVersion}`);
});
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_LOG_DOWNLOAD_COMPILER_END)
    .addParam("isCompilerDownloaded", undefined, undefined, config_env_1.types.boolean)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .addParam("solcVersion", undefined, undefined, config_env_1.types.string)
    .setAction(async ({}) => { });
/**
 * Receives a solc version and returns a path to a solc binary or to a
 * downloaded solcjs module. It also returns a flag indicating if the returned
 * path corresponds to solc or solcjs.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .addParam("solcVersion", undefined, undefined, config_env_1.types.string)
    .setAction(async ({ quiet, solcVersion, }, { run }) => {
    const compilersCache = await (0, global_dir_1.getCompilersDir)();
    const downloader = new downloader_1.CompilerDownloader(compilersCache);
    const isCompilerDownloaded = await downloader.isCompilerDownloaded(solcVersion);
    const { longVersion, platform: desiredPlatform } = await downloader.getCompilerBuild(solcVersion);
    await run(task_names_1.TASK_COMPILE_SOLIDITY_LOG_DOWNLOAD_COMPILER_START, {
        solcVersion,
        isCompilerDownloaded,
        quiet,
    });
    let compilerPath;
    let platform;
    let nativeBinaryFailed = false;
    const compilerPathResult = await downloader.getDownloadedCompilerPath(solcVersion);
    if (compilerPathResult === undefined) {
        if (desiredPlatform === downloader_1.CompilerPlatform.WASM) {
            // if we were trying to download solcjs and it failed, there's nothing
            // we can do
            throw new errors_1.HardhatError(errors_list_1.ERRORS.SOLC.CANT_GET_COMPILER, {
                version: solcVersion,
            });
        }
        nativeBinaryFailed = true;
    }
    else {
        compilerPath = compilerPathResult.compilerPath;
        // when using a native binary, check that it works correctly
        // it it doesn't, force the downloader to use solcjs
        if (compilerPathResult.platform !== downloader_1.CompilerPlatform.WASM) {
            log("Checking native solc binary");
            const solcBinaryWorks = await checkSolcBinary(compilerPathResult.compilerPath);
            if (!solcBinaryWorks) {
                log("Native solc binary doesn't work, using solcjs instead");
                nativeBinaryFailed = true;
            }
        }
        else {
            platform = downloader_1.CompilerPlatform.WASM;
        }
    }
    if (nativeBinaryFailed) {
        const solcJsDownloader = new downloader_1.CompilerDownloader(compilersCache, {
            forceSolcJs: true,
        });
        const solcjsCompilerPath = await solcJsDownloader.getDownloadedCompilerPath(solcVersion);
        if (solcjsCompilerPath === undefined) {
            throw new errors_1.HardhatError(errors_list_1.ERRORS.SOLC.CANT_GET_COMPILER, {
                version: solcVersion,
            });
        }
        compilerPath = solcjsCompilerPath.compilerPath;
        platform = downloader_1.CompilerPlatform.WASM;
    }
    await run(task_names_1.TASK_COMPILE_SOLIDITY_LOG_DOWNLOAD_COMPILER_END, {
        solcVersion,
        isCompilerDownloaded,
        quiet,
    });
    const isSolcJs = platform === downloader_1.CompilerPlatform.WASM;
    (0, errors_1.assertHardhatInvariant)(compilerPath !== undefined, "A compilerPath should be defined at this point");
    return { compilerPath, isSolcJs, version: solcVersion, longVersion };
});
/**
 * Receives an absolute path to a solcjs module and the input to be compiled,
 * and returns the generated output
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_RUN_SOLCJS)
    .addParam("input", undefined, undefined, config_env_1.types.any)
    .addParam("solcJsPath", undefined, undefined, config_env_1.types.string)
    .setAction(async ({ input, solcJsPath, }) => {
    const compiler = new compiler_1.Compiler(solcJsPath);
    const output = await compiler.compile(input);
    return output;
});
/**
 * Receives an absolute path to a solc binary and the input to be compiled,
 * and returns the generated output
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_RUN_SOLC)
    .addParam("input", undefined, undefined, config_env_1.types.any)
    .addParam("solcPath", undefined, undefined, config_env_1.types.string)
    .setAction(async ({ input, solcPath }) => {
    const compiler = new compiler_1.NativeCompiler(solcPath);
    const output = await compiler.compile(input);
    return output;
});
/**
 * Receives a CompilerInput and a solc version, compiles the input using a native
 * solc binary or, if that's not possible, using solcjs. Returns the generated
 * output.
 *
 * This task can be overriden to change how solc is obtained or used.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_COMPILE_SOLC)
    .addParam("input", undefined, undefined, config_env_1.types.any)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .addParam("solcVersion", undefined, undefined, config_env_1.types.string)
    .addParam("compilationJob", undefined, undefined, config_env_1.types.any)
    .addParam("compilationJobs", undefined, undefined, config_env_1.types.any)
    .addParam("compilationJobIndex", undefined, undefined, config_env_1.types.int)
    .setAction(async ({ input, quiet, solcVersion, compilationJob, compilationJobs, compilationJobIndex, }, { run }) => {
    const solcBuild = await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, {
        quiet,
        solcVersion,
    });
    await run(task_names_1.TASK_COMPILE_SOLIDITY_LOG_RUN_COMPILER_START, {
        compilationJob,
        compilationJobs,
        compilationJobIndex,
        quiet,
    });
    let output;
    if (solcBuild.isSolcJs) {
        output = await run(task_names_1.TASK_COMPILE_SOLIDITY_RUN_SOLCJS, {
            input,
            solcJsPath: solcBuild.compilerPath,
        });
    }
    else {
        output = await run(task_names_1.TASK_COMPILE_SOLIDITY_RUN_SOLC, {
            input,
            solcPath: solcBuild.compilerPath,
        });
    }
    await run(task_names_1.TASK_COMPILE_SOLIDITY_LOG_RUN_COMPILER_END, {
        compilationJob,
        compilationJobs,
        compilationJobIndex,
        output,
        quiet,
    });
    return { output, solcBuild };
});
/**
 * This task is just a proxy to the task that compiles with solc.
 *
 * Override this to use a different task to compile a job.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_COMPILE, async (taskArgs, { run }) => {
    return run(task_names_1.TASK_COMPILE_SOLIDITY_COMPILE_SOLC, taskArgs);
});
/**
 * Receives a compilation output and prints its errors and any other
 * information useful to the user.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_LOG_COMPILATION_ERRORS)
    .addParam("output", undefined, undefined, config_env_1.types.any)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .setAction(async ({ output }) => {
    var _a;
    if ((output === null || output === void 0 ? void 0 : output.errors) === undefined) {
        return;
    }
    for (const error of output.errors) {
        if (error.severity === "error") {
            const errorMessage = (_a = getFormattedInternalCompilerErrorMessage(error)) !== null && _a !== void 0 ? _a : error.formattedMessage;
            console.error(chalk_1.default.red(errorMessage));
        }
        else {
            console.warn(chalk_1.default.yellow(error.formattedMessage));
        }
    }
    const hasConsoleErrors = output.errors.some(isConsoleLogError);
    if (hasConsoleErrors) {
        console.error(chalk_1.default.red(`The console.log call you made isn’t supported. See https://hardhat.org/console-log for the list of supported methods.`));
        console.log();
    }
});
/**
 * Receives a solc output and checks if there are errors. Throws if there are
 * errors.
 *
 * Override this task to avoid interrupting the compilation process if some
 * job has compilation errors.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_CHECK_ERRORS)
    .addParam("output", undefined, undefined, config_env_1.types.any)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .setAction(async ({ output, quiet }, { run }) => {
    await run(task_names_1.TASK_COMPILE_SOLIDITY_LOG_COMPILATION_ERRORS, {
        output,
        quiet,
    });
    if (hasCompilationErrors(output)) {
        throw new errors_1.HardhatError(errors_list_1.ERRORS.BUILTIN_TASKS.COMPILE_FAILURE);
    }
});
/**
 * Saves to disk the artifacts for a compilation job. These artifacts
 * include the main artifacts, the debug files, and the build info.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_EMIT_ARTIFACTS)
    .addParam("compilationJob", undefined, undefined, config_env_1.types.any)
    .addParam("input", undefined, undefined, config_env_1.types.any)
    .addParam("output", undefined, undefined, config_env_1.types.any)
    .addParam("solcBuild", undefined, undefined, config_env_1.types.any)
    .setAction(async ({ compilationJob, input, output, solcBuild, }, { artifacts, run }) => {
    var _a, _b;
    const pathToBuildInfo = await artifacts.saveBuildInfo(compilationJob.getSolcConfig().version, solcBuild.longVersion, input, output);
    const artifactsEmittedPerFile = [];
    for (const file of compilationJob.getResolvedFiles()) {
        log(`Emitting artifacts for file '${file.sourceName}'`);
        if (!compilationJob.emitsArtifacts(file)) {
            continue;
        }
        const artifactsEmitted = [];
        for (const [contractName, contractOutput] of Object.entries((_b = (_a = output.contracts) === null || _a === void 0 ? void 0 : _a[file.sourceName]) !== null && _b !== void 0 ? _b : {})) {
            log(`Emitting artifact for contract '${contractName}'`);
            const artifact = await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_ARTIFACT_FROM_COMPILATION_OUTPUT, {
                sourceName: file.sourceName,
                contractName,
                contractOutput,
            });
            await artifacts.saveArtifactAndDebugFile(artifact, pathToBuildInfo);
            artifactsEmitted.push(artifact.contractName);
        }
        artifactsEmittedPerFile.push({
            file,
            artifactsEmitted,
        });
    }
    return { artifactsEmittedPerFile };
});
/**
 * Generates the artifact for contract `contractName` given its compilation
 * output.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_GET_ARTIFACT_FROM_COMPILATION_OUTPUT)
    .addParam("sourceName", undefined, undefined, config_env_1.types.string)
    .addParam("contractName", undefined, undefined, config_env_1.types.string)
    .addParam("contractOutput", undefined, undefined, config_env_1.types.any)
    .setAction(async ({ sourceName, contractName, contractOutput, }) => {
    return (0, artifacts_1.getArtifactFromContractOutput)(sourceName, contractName, contractOutput);
});
/**
 * Prints a message before running soljs with some input.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_LOG_RUN_COMPILER_START)
    .addParam("compilationJob", undefined, undefined, config_env_1.types.any)
    .addParam("compilationJobs", undefined, undefined, config_env_1.types.any)
    .addParam("compilationJobIndex", undefined, undefined, config_env_1.types.int)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .setAction(async ({}) => { });
/**
 * Prints a message after compiling some input
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_LOG_RUN_COMPILER_END)
    .addParam("compilationJob", undefined, undefined, config_env_1.types.any)
    .addParam("compilationJobs", undefined, undefined, config_env_1.types.any)
    .addParam("compilationJobIndex", undefined, undefined, config_env_1.types.int)
    .addParam("output", undefined, undefined, config_env_1.types.any)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .setAction(async ({}) => { });
/**
 * This is an orchestrator task that uses other subtasks to compile a
 * compilation job.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_COMPILE_JOB)
    .addParam("compilationJob", undefined, undefined, config_env_1.types.any)
    .addParam("compilationJobs", undefined, undefined, config_env_1.types.any)
    .addParam("compilationJobIndex", undefined, undefined, config_env_1.types.int)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .addOptionalParam("emitsArtifacts", undefined, true, config_env_1.types.boolean)
    .setAction(async ({ compilationJob, compilationJobs, compilationJobIndex, quiet, emitsArtifacts, }, { run }) => {
    log(`Compiling job with version '${compilationJob.getSolcConfig().version}'`);
    const input = await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_COMPILER_INPUT, {
        compilationJob,
    });
    const { output, solcBuild } = await run(task_names_1.TASK_COMPILE_SOLIDITY_COMPILE, {
        solcVersion: compilationJob.getSolcConfig().version,
        input,
        quiet,
        compilationJob,
        compilationJobs,
        compilationJobIndex,
    });
    await run(task_names_1.TASK_COMPILE_SOLIDITY_CHECK_ERRORS, { output, quiet });
    let artifactsEmittedPerFile = [];
    if (emitsArtifacts) {
        artifactsEmittedPerFile = (await run(task_names_1.TASK_COMPILE_SOLIDITY_EMIT_ARTIFACTS, {
            compilationJob,
            input,
            output,
            solcBuild,
        })).artifactsEmittedPerFile;
    }
    return {
        artifactsEmittedPerFile,
        compilationJob,
        input,
        output,
        solcBuild,
    };
});
/**
 * Receives a list of CompilationJobsFailure and throws an error if it's not
 * empty.
 *
 * This task could be overriden to avoid interrupting the compilation if
 * there's some part of the project that can't be compiled.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_HANDLE_COMPILATION_JOBS_FAILURES)
    .addParam("compilationJobsCreationErrors", undefined, undefined, config_env_1.types.any)
    .setAction(async ({ compilationJobsCreationErrors, }, { run }) => {
    const hasErrors = compilationJobsCreationErrors.length > 0;
    if (hasErrors) {
        log(`There were errors creating the compilation jobs, throwing`);
        const reasons = await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOBS_FAILURE_REASONS, { compilationJobsCreationErrors });
        throw new errors_1.HardhatError(errors_list_1.ERRORS.BUILTIN_TASKS.COMPILATION_JOBS_CREATION_FAILURE, {
            reasons,
        });
    }
});
/**
 * Receives a list of CompilationJobsFailure and returns an error message
 * that describes the failure.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOBS_FAILURE_REASONS)
    .addParam("compilationJobsCreationErrors", undefined, undefined, config_env_1.types.any)
    .setAction(async ({ compilationJobsCreationErrors: errors, }) => {
    var _a, _b, _c, _d;
    const noCompatibleSolc = [];
    const incompatibleOverridenSolc = [];
    const directlyImportsIncompatibleFile = [];
    const indirectlyImportsIncompatibleFile = [];
    const other = [];
    for (const error of errors) {
        if (error.reason ===
            builtin_tasks_1.CompilationJobCreationErrorReason.NO_COMPATIBLE_SOLC_VERSION_FOUND) {
            noCompatibleSolc.push(error);
        }
        else if (error.reason ===
            builtin_tasks_1.CompilationJobCreationErrorReason.INCOMPATIBLE_OVERRIDEN_SOLC_VERSION) {
            incompatibleOverridenSolc.push(error);
        }
        else if (error.reason ===
            builtin_tasks_1.CompilationJobCreationErrorReason.DIRECTLY_IMPORTS_INCOMPATIBLE_FILE) {
            directlyImportsIncompatibleFile.push(error);
        }
        else if (error.reason ===
            builtin_tasks_1.CompilationJobCreationErrorReason.INDIRECTLY_IMPORTS_INCOMPATIBLE_FILE) {
            indirectlyImportsIncompatibleFile.push(error);
        }
        else if (error.reason === builtin_tasks_1.CompilationJobCreationErrorReason.OTHER_ERROR) {
            other.push(error);
        }
        else {
            // add unrecognized errors to `other`
            other.push(error);
        }
    }
    let errorMessage = "";
    if (incompatibleOverridenSolc.length > 0) {
        errorMessage += `The compiler version for the following files is fixed through an override in your config file to a version that is incompatible with their Solidity version pragmas.

`;
        for (const error of incompatibleOverridenSolc) {
            const { sourceName } = error.file;
            const { versionPragmas } = error.file.content;
            const versionsRange = versionPragmas.join(" ");
            log(`File ${sourceName} has an incompatible overriden compiler`);
            errorMessage += `  * ${sourceName} (${versionsRange})\n`;
        }
        errorMessage += "\n";
    }
    if (noCompatibleSolc.length > 0) {
        errorMessage += `The Solidity version pragma statement in these files doesn't match any of the configured compilers in your config. Change the pragma or configure additional compiler versions in your hardhat config.

`;
        for (const error of noCompatibleSolc) {
            const { sourceName } = error.file;
            const { versionPragmas } = error.file.content;
            const versionsRange = versionPragmas.join(" ");
            log(`File ${sourceName} doesn't match any of the configured compilers`);
            errorMessage += `  * ${sourceName} (${versionsRange})\n`;
        }
        errorMessage += "\n";
    }
    if (directlyImportsIncompatibleFile.length > 0) {
        errorMessage += `These files import other files that use a different and incompatible version of Solidity:

`;
        for (const error of directlyImportsIncompatibleFile) {
            const { sourceName } = error.file;
            const { versionPragmas } = error.file.content;
            const versionsRange = versionPragmas.join(" ");
            const incompatibleDirectImportsFiles = (_b = (_a = error.extra) === null || _a === void 0 ? void 0 : _a.incompatibleDirectImports) !== null && _b !== void 0 ? _b : [];
            const incompatibleDirectImports = incompatibleDirectImportsFiles.map((x) => `${x.sourceName} (${x.content.versionPragmas.join(" ")})`);
            log(`File ${sourceName} imports files ${incompatibleDirectImportsFiles
                .map((x) => x.sourceName)
                .join(", ")} that use an incompatible version of Solidity`);
            let directImportsText = "";
            if (incompatibleDirectImports.length === 1) {
                directImportsText = ` imports ${incompatibleDirectImports[0]}`;
            }
            else if (incompatibleDirectImports.length === 2) {
                directImportsText = ` imports ${incompatibleDirectImports[0]} and ${incompatibleDirectImports[1]}`;
            }
            else if (incompatibleDirectImports.length > 2) {
                const otherImportsCount = incompatibleDirectImports.length - 2;
                directImportsText = ` imports ${incompatibleDirectImports[0]}, ${incompatibleDirectImports[1]} and ${otherImportsCount} other ${(0, strings_1.pluralize)(otherImportsCount, "file")}. Use --verbose to see the full list.`;
            }
            errorMessage += `  * ${sourceName} (${versionsRange})${directImportsText}\n`;
        }
        errorMessage += "\n";
    }
    if (indirectlyImportsIncompatibleFile.length > 0) {
        errorMessage += `These files depend on other files that use a different and incompatible version of Solidity:

`;
        for (const error of indirectlyImportsIncompatibleFile) {
            const { sourceName } = error.file;
            const { versionPragmas } = error.file.content;
            const versionsRange = versionPragmas.join(" ");
            const incompatibleIndirectImports = (_d = (_c = error.extra) === null || _c === void 0 ? void 0 : _c.incompatibleIndirectImports) !== null && _d !== void 0 ? _d : [];
            const incompatibleImports = incompatibleIndirectImports.map(({ dependency }) => `${dependency.sourceName} (${dependency.content.versionPragmas.join(" ")})`);
            for (const { dependency, path: dependencyPath, } of incompatibleIndirectImports) {
                const dependencyPathText = [
                    sourceName,
                    ...dependencyPath.map((x) => x.sourceName),
                    dependency.sourceName,
                ].join(" -> ");
                log(`File ${sourceName} depends on file ${dependency.sourceName} that uses an incompatible version of Solidity
The dependency path is ${dependencyPathText}
`);
            }
            let indirectImportsText = "";
            if (incompatibleImports.length === 1) {
                indirectImportsText = ` depends on ${incompatibleImports[0]}`;
            }
            else if (incompatibleImports.length === 2) {
                indirectImportsText = ` depends on ${incompatibleImports[0]} and ${incompatibleImports[1]}`;
            }
            else if (incompatibleImports.length > 2) {
                const otherImportsCount = incompatibleImports.length - 2;
                indirectImportsText = ` depends on ${incompatibleImports[0]}, ${incompatibleImports[1]} and ${otherImportsCount} other ${(0, strings_1.pluralize)(otherImportsCount, "file")}. Use --verbose to see the full list.`;
            }
            errorMessage += `  * ${sourceName} (${versionsRange})${indirectImportsText}\n`;
        }
        errorMessage += "\n";
    }
    if (other.length > 0) {
        errorMessage += `These files and its dependencies cannot be compiled with your config. This can happen because they have incompatible Solidity pragmas, or don't match any of your configured Solidity compilers.

${other.map((x) => `  * ${x.file.sourceName}`).join("\n")}

`;
    }
    errorMessage += `To learn more, run the command again with --verbose

Read about compiler configuration at https://hardhat.org/config
`;
    return errorMessage;
});
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY_LOG_COMPILATION_RESULT)
    .addParam("compilationJobs", undefined, undefined, config_env_1.types.any)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .setAction(async ({ compilationJobs }) => {
    let count = 0;
    for (const job of compilationJobs) {
        count += job
            .getResolvedFiles()
            .filter((file) => job.emitsArtifacts(file)).length;
    }
    if (count > 0) {
        console.log(`Compiled ${count} Solidity ${(0, strings_1.pluralize)(count, "file")} successfully`);
    }
});
/**
 * Main task for compiling the solidity files in the project.
 *
 * The main responsibility of this task is to orchestrate and connect most of
 * the subtasks related to compiling solidity.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_SOLIDITY)
    .addParam("force", undefined, undefined, config_env_1.types.boolean)
    .addParam("quiet", undefined, undefined, config_env_1.types.boolean)
    .addParam("concurrency", undefined, DEFAULT_CONCURRENCY_LEVEL, config_env_1.types.int)
    .setAction(async ({ force, quiet, concurrency, }, { artifacts, config, run }) => {
    const sourcePaths = await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS);
    const sourceNames = await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_SOURCE_NAMES, {
        sourcePaths,
    });
    const solidityFilesCachePath = (0, solidity_files_cache_1.getSolidityFilesCachePath)(config.paths);
    let solidityFilesCache = await solidity_files_cache_1.SolidityFilesCache.readFromFile(solidityFilesCachePath);
    const dependencyGraph = await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH, { sourceNames, solidityFilesCache });
    solidityFilesCache = await invalidateCacheMissingArtifacts(solidityFilesCache, artifacts, dependencyGraph.getResolvedFiles());
    const compilationJobsCreationResult = await run(task_names_1.TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOBS, {
        dependencyGraph,
        solidityFilesCache,
    });
    await run(task_names_1.TASK_COMPILE_SOLIDITY_HANDLE_COMPILATION_JOBS_FAILURES, {
        compilationJobsCreationErrors: compilationJobsCreationResult.errors,
    });
    const compilationJobs = compilationJobsCreationResult.jobs;
    const filteredCompilationJobs = await run(task_names_1.TASK_COMPILE_SOLIDITY_FILTER_COMPILATION_JOBS, { compilationJobs, force, solidityFilesCache });
    const mergedCompilationJobs = await run(task_names_1.TASK_COMPILE_SOLIDITY_MERGE_COMPILATION_JOBS, { compilationJobs: filteredCompilationJobs });
    const { artifactsEmittedPerJob, } = await run(task_names_1.TASK_COMPILE_SOLIDITY_COMPILE_JOBS, {
        compilationJobs: mergedCompilationJobs,
        quiet,
        concurrency,
    });
    // update cache using the information about the emitted artifacts
    for (const { compilationJob: compilationJob, artifactsEmittedPerFile: artifactsEmittedPerFile, } of artifactsEmittedPerJob) {
        for (const { file, artifactsEmitted } of artifactsEmittedPerFile) {
            solidityFilesCache.addFile(file.absolutePath, {
                lastModificationDate: file.lastModificationDate.valueOf(),
                contentHash: file.contentHash,
                sourceName: file.sourceName,
                solcConfig: compilationJob.getSolcConfig(),
                imports: file.content.imports,
                versionPragmas: file.content.versionPragmas,
                artifacts: artifactsEmitted,
            });
        }
    }
    const allArtifactsEmittedPerFile = solidityFilesCache.getEntries();
    // We know this is the actual implementation, so we use some
    // non-public methods here.
    const artifactsImpl = artifacts;
    artifactsImpl.addValidArtifacts(allArtifactsEmittedPerFile);
    await solidityFilesCache.writeToFile(solidityFilesCachePath);
    await run(task_names_1.TASK_COMPILE_SOLIDITY_LOG_COMPILATION_RESULT, {
        compilationJobs: mergedCompilationJobs,
        quiet,
    });
});
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_REMOVE_OBSOLETE_ARTIFACTS, async (_, { artifacts }) => {
    // We know this is the actual implementation, so we use some
    // non-public methods here.
    const artifactsImpl = artifacts;
    await artifactsImpl.removeObsoleteArtifacts();
});
/**
 * Returns a list of compilation tasks.
 *
 * This is the task to override to add support for other languages.
 */
(0, config_env_1.subtask)(task_names_1.TASK_COMPILE_GET_COMPILATION_TASKS, async () => {
    return [task_names_1.TASK_COMPILE_SOLIDITY];
});
/**
 * Main compile task.
 *
 * This is a meta-task that just gets all the compilation tasks and runs them.
 * Right now there's only a "compile solidity" task.
 */
(0, config_env_1.task)(task_names_1.TASK_COMPILE, "Compiles the entire project, building all artifacts")
    .addFlag("force", "Force compilation ignoring cache")
    .addFlag("quiet", "Makes the compilation process less verbose")
    .addParam("concurrency", "Number of compilation jobs executed in parallel. Defaults to the number of CPU cores - 1", DEFAULT_CONCURRENCY_LEVEL, config_env_1.types.int)
    .setAction(async (compilationArgs, { run }) => {
    const compilationTasks = await run(task_names_1.TASK_COMPILE_GET_COMPILATION_TASKS);
    for (const compilationTask of compilationTasks) {
        await run(compilationTask, compilationArgs);
    }
    await run(task_names_1.TASK_COMPILE_REMOVE_OBSOLETE_ARTIFACTS);
});
/**
 * If a file is present in the cache, but some of its artifacts are missing on
 * disk, we remove it from the cache to force it to be recompiled.
 */
async function invalidateCacheMissingArtifacts(solidityFilesCache, artifacts, resolvedFiles) {
    for (const file of resolvedFiles) {
        const cacheEntry = solidityFilesCache.getEntry(file.absolutePath);
        if (cacheEntry === undefined) {
            continue;
        }
        const { artifacts: emittedArtifacts } = cacheEntry;
        for (const emittedArtifact of emittedArtifacts) {
            const artifactExists = await artifacts.artifactExists((0, contract_names_1.getFullyQualifiedName)(file.sourceName, emittedArtifact));
            if (!artifactExists) {
                log(`Invalidate cache for '${file.absolutePath}' because artifact '${emittedArtifact}' doesn't exist`);
                solidityFilesCache.removeEntry(file.absolutePath);
                break;
            }
        }
    }
    return solidityFilesCache;
}
/**
 * Checks if the given compilation job needs to be done.
 */
function needsCompilation(job, cache) {
    for (const file of job.getResolvedFiles()) {
        const hasChanged = cache.hasFileChanged(file.absolutePath, file.contentHash, 
        // we only check if the solcConfig is different for files that
        // emit artifacts
        job.emitsArtifacts(file) ? job.getSolcConfig() : undefined);
        if (hasChanged) {
            return true;
        }
    }
    return false;
}
function hasCompilationErrors(output) {
    return (output.errors && output.errors.some((x) => x.severity === "error"));
}
async function checkSolcBinary(solcPath) {
    return new Promise((resolve) => {
        const process = (0, child_process_1.exec)(`${solcPath} --version`);
        process.on("exit", (code) => {
            resolve(code === 0);
        });
    });
}
/**
 * This function returns a properly formatted Internal Compiler Error message.
 *
 * This is present due to a bug in Solidity. See: https://github.com/ethereum/solidity/issues/9926
 *
 * If the error is not an ICE, or if it's properly formatted, this function returns undefined.
 */
function getFormattedInternalCompilerErrorMessage(error) {
    if (error.formattedMessage.trim() !== "InternalCompilerError:") {
        return;
    }
    // We trim any final `:`, as we found some at the end of the error messages,
    // and then trim just in case a blank space was left
    return `${error.type}: ${error.message}`.replace(/[:\s]*$/g, "").trim();
}
//# sourceMappingURL=compile.js.map