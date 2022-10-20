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
exports.TASK_SOURCIFY = exports.TASK_ETHERSCAN_VERIFY = exports.TASK_EXPORT = exports.TASK_DEPLOY_RUN_DEPLOY = exports.TASK_DEPLOY_MAIN = exports.TASK_DEPLOY = void 0;
require("./type-extensions");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const murmur_128_1 = __importDefault(require("murmur-128"));
const construction_1 = require("hardhat/internal/core/providers/construction"); // TODO harhdat argument types not from internal
const config_1 = require("hardhat/config");
const plugins_1 = require("hardhat/plugins");
const types = __importStar(require("hardhat/internal/core/params/argumentTypes")); // TODO harhdat argument types not from internal
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const plugins_2 = require("hardhat/plugins");
const debug_1 = __importDefault(require("debug"));
const log = debug_1.default('hardhat:wighawag:hardhat-deploy');
const DeploymentsManager_1 = require("./DeploymentsManager");
const chokidar_1 = __importDefault(require("chokidar"));
const etherscan_1 = require("./etherscan");
const sourcify_1 = require("./sourcify");
const globalStore_1 = require("./globalStore");
const utils_1 = require("./utils");
exports.TASK_DEPLOY = 'deploy';
exports.TASK_DEPLOY_MAIN = 'deploy:main';
exports.TASK_DEPLOY_RUN_DEPLOY = 'deploy:runDeploy';
exports.TASK_EXPORT = 'export';
exports.TASK_ETHERSCAN_VERIFY = 'etherscan-verify';
exports.TASK_SOURCIFY = 'sourcify';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let nodeTaskArgs = {};
function isHardhatEVM(hre) {
    const { network } = hre;
    return network.name === plugins_1.HARDHAT_NETWORK_NAME;
}
function normalizePathArray(config, paths) {
    const newArray = [];
    for (const value of paths) {
        if (value) {
            newArray.push(normalizePath(config, value, value));
        }
    }
    return newArray;
}
function normalizePath(config, userPath, defaultPath) {
    if (userPath === undefined) {
        userPath = path_1.default.join(config.paths.root, defaultPath);
    }
    else {
        if (!path_1.default.isAbsolute(userPath)) {
            userPath = path_1.default.normalize(path_1.default.join(config.paths.root, userPath));
        }
    }
    return userPath;
}
config_1.extendConfig((config, userConfig) => {
    var _a, _b, _c;
    config.paths.deployments = normalizePath(config, (_a = userConfig.paths) === null || _a === void 0 ? void 0 : _a.deployments, 'deployments');
    config.paths.imports = normalizePath(config, (_b = userConfig.paths) === null || _b === void 0 ? void 0 : _b.imports, 'imports');
    if ((_c = userConfig.paths) === null || _c === void 0 ? void 0 : _c.deploy) {
        let deployPaths = [];
        if (typeof userConfig.paths.deploy === 'string') {
            deployPaths = [userConfig.paths.deploy];
        }
        else {
            deployPaths = userConfig.paths.deploy;
        }
        config.paths.deploy = deployPaths.map((p) => normalizePath(config, p, 'deploy'));
    }
    else {
        config.paths.deploy = [normalizePath(config, undefined, 'deploy')];
    }
    if (userConfig.namedAccounts) {
        config.namedAccounts = userConfig.namedAccounts;
    }
    else {
        config.namedAccounts = {};
    }
    config.deterministicDeployment = userConfig.deterministicDeployment;
    if (userConfig.external) {
        if (!config.external) {
            config.external = {};
        }
        if (userConfig.external.contracts) {
            const externalContracts = [];
            config.external.contracts = externalContracts;
            for (const userDefinedExternalContracts of userConfig.external
                .contracts) {
                const userArtifacts = typeof userDefinedExternalContracts.artifacts === 'string'
                    ? [userDefinedExternalContracts.artifacts]
                    : userDefinedExternalContracts.artifacts;
                externalContracts.push({
                    artifacts: userArtifacts.map((v) => normalizePath(config, v, v)),
                    deploy: userDefinedExternalContracts.deploy
                        ? normalizePath(config, userDefinedExternalContracts.deploy, userDefinedExternalContracts.deploy)
                        : undefined,
                });
            }
        }
        if (userConfig.external.deployments) {
            config.external.deployments = {};
            for (const key of Object.keys(userConfig.external.deployments)) {
                config.external.deployments[key] = normalizePathArray(config, userConfig.external.deployments[key]);
            }
        }
    }
    for (const compiler of config.solidity.compilers) {
        setupExtraSolcSettings(compiler.settings);
    }
    const defaultConfig = {};
    if (userConfig.verify !== undefined) {
        const customConfig = userConfig.verify;
        config.verify = Object.assign(Object.assign({}, defaultConfig), customConfig);
    }
    else {
        config.verify = defaultConfig;
        // backward compatibility for runtime (js)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (userConfig.etherscan) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            config.verify.etherscan = userConfig.etherscan;
        }
    }
});
function createNetworkFromConfig(env, networkName, config) {
    const tags = {};
    const tagsCollected = config.tags || [];
    for (const tag of tagsCollected) {
        tags[tag] = true;
    }
    const network = {
        name: networkName,
        config,
        live: config.live,
        saveDeployments: config.saveDeployments,
        zksync: config.zksync,
        tags,
        deploy: config.deploy || env.config.paths.deploy,
        companionNetworks: {},
    };
    networkFromConfig(env, network, false);
    return network;
}
function networkFromConfig(env, network, companion) {
    let live = true;
    const networkName = network.name; // cannot use fork here as this could be set via task, T
    if (networkName === 'localhost' || networkName === 'hardhat') {
        // the 2 default network are not live network
        live = false;
    }
    if (network.config.live !== undefined) {
        live = network.config.live;
    }
    if (network.config.verify !== undefined) {
        network.verify = network.config.verify;
    }
    else {
        // backward compatibility for runtime (js)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (network.config.etherscan) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            network.verify = { etherscan: network.config.etherscan };
        }
    }
    if (network.config.zksync !== undefined) {
        network.zksync = network.config.zksync;
    }
    // associate tags to current network as object
    network.tags = {};
    const tags = network.config.tags || [];
    for (const tag of tags) {
        network.tags[tag] = true;
    }
    if (network.config.deploy) {
        network.deploy = network.config.deploy;
    }
    else {
        network.deploy = env.config.paths.deploy;
    }
    if (companion && network.config.companionNetworks) {
        network.companionNetworks = network.config.companionNetworks;
    }
    else {
        network.companionNetworks = {};
    }
    if (network.config.live !== undefined) {
        live = network.config.live;
    }
    network.live = live;
    if (network.config.saveDeployments === undefined) {
        network.saveDeployments = true;
    }
    else {
        network.saveDeployments = network.config.saveDeployments;
    }
    let autoImpersonate = false;
    if (networkName === 'hardhat') {
        autoImpersonate = true;
    }
    if (network.config.autoImpersonate !== undefined) {
        autoImpersonate = network.config.autoImpersonate;
    }
    network.autoImpersonate = autoImpersonate;
}
log('start...');
let deploymentsManager;
config_1.extendEnvironment((env) => {
    networkFromConfig(env, env.network, true);
    if (deploymentsManager === undefined || env.deployments === undefined) {
        deploymentsManager = new DeploymentsManager_1.DeploymentsManager(env, plugins_2.lazyObject(() => env.network) // IMPORTANT, else other plugin cannot set env.network before end, like solidity-coverage does here in the coverage task :  https://github.com/sc-forks/solidity-coverage/blob/3c0f3a5c7db26e82974873bbf61cf462072a7c6d/plugins/resources/nomiclabs.utils.js#L93-L98
        );
        env.deployments = deploymentsManager.deploymentsExtension;
        env.getNamedAccounts =
            deploymentsManager.getNamedAccounts.bind(deploymentsManager);
        env.getUnnamedAccounts =
            deploymentsManager.getUnnamedAccounts.bind(deploymentsManager);
        env.getChainId = () => {
            return deploymentsManager.getChainId();
        };
        for (const networkName of Object.keys(env.config.networks)) {
            const config = env.config.networks[networkName];
            if (!('url' in config) || networkName === 'hardhat') {
                continue;
            }
            globalStore_1.store.networks[networkName] = createNetworkFromConfig(env, networkName, config);
        }
        env.companionNetworks = {};
        for (const name of Object.keys(env.network.companionNetworks)) {
            const networkName = env.network.companionNetworks[name];
            // TODO Fork case ?
            if (networkName === env.network.name) {
                deploymentsManager.addCompanionManager(name, deploymentsManager);
                const extraNetwork = {
                    deployments: deploymentsManager.deploymentsExtension,
                    getNamedAccounts: () => deploymentsManager.getNamedAccounts(),
                    getUnnamedAccounts: () => deploymentsManager.getUnnamedAccounts(),
                    getChainId: () => deploymentsManager.getChainId(),
                    provider: plugins_2.lazyObject(() => env.network.provider),
                };
                env.companionNetworks[name] = extraNetwork;
                continue;
            }
            const config = env.config.networks[networkName];
            if (!('url' in config) || networkName === 'hardhat') {
                throw new Error(`in memory network like hardhat are not supported as companion network`);
            }
            const network = globalStore_1.store.networks[networkName];
            if (!network) {
                throw new Error(`no network named ${networkName}`);
            }
            network.provider = construction_1.createProvider(networkName, config, env.config.paths, env.artifacts);
            const networkDeploymentsManager = new DeploymentsManager_1.DeploymentsManager(env, network);
            deploymentsManager.addCompanionManager(name, networkDeploymentsManager);
            const extraNetwork = {
                deployments: networkDeploymentsManager.deploymentsExtension,
                getNamedAccounts: () => networkDeploymentsManager.getNamedAccounts(),
                getUnnamedAccounts: () => networkDeploymentsManager.getUnnamedAccounts(),
                getChainId: () => networkDeploymentsManager.getChainId(),
                provider: network.provider,
            };
            env.companionNetworks[name] = extraNetwork;
        }
    }
    log('ready');
});
function addIfNotPresent(array, value) {
    if (array.indexOf(value) === -1) {
        array.push(value);
    }
}
function setupExtraSolcSettings(settings) {
    settings.metadata = settings.metadata || {};
    settings.metadata.useLiteralContent = true;
    if (settings.outputSelection === undefined) {
        settings.outputSelection = {
            '*': {
                '*': [],
                '': [],
            },
        };
    }
    if (settings.outputSelection['*'] === undefined) {
        settings.outputSelection['*'] = {
            '*': [],
            '': [],
        };
    }
    if (settings.outputSelection['*']['*'] === undefined) {
        settings.outputSelection['*']['*'] = [];
    }
    if (settings.outputSelection['*'][''] === undefined) {
        settings.outputSelection['*'][''] = [];
    }
    addIfNotPresent(settings.outputSelection['*']['*'], 'abi');
    addIfNotPresent(settings.outputSelection['*']['*'], 'evm.bytecode');
    addIfNotPresent(settings.outputSelection['*']['*'], 'evm.deployedBytecode');
    addIfNotPresent(settings.outputSelection['*']['*'], 'metadata');
    addIfNotPresent(settings.outputSelection['*']['*'], 'devdoc');
    addIfNotPresent(settings.outputSelection['*']['*'], 'userdoc');
    addIfNotPresent(settings.outputSelection['*']['*'], 'storageLayout');
    addIfNotPresent(settings.outputSelection['*']['*'], 'evm.methodIdentifiers');
    addIfNotPresent(settings.outputSelection['*']['*'], 'evm.gasEstimates');
    // addIfNotPresent(settings.outputSelection["*"][""], "ir");
    // addIfNotPresent(settings.outputSelection["*"][""], "irOptimized");
    // addIfNotPresent(settings.outputSelection["*"][""], "ast");
}
config_1.subtask(exports.TASK_DEPLOY_RUN_DEPLOY, 'deploy run only')
    .addOptionalParam('export', 'export current network deployments')
    .addOptionalParam('exportAll', 'export all deployments into one file')
    .addOptionalParam('tags', 'specify which deploy script to execute via tags, separated by commas', undefined, types.string)
    .addOptionalParam('write', 'whether to write deployments to file', true, types.boolean)
    .addOptionalParam('pendingtx', 'whether to save pending tx', false, types.boolean)
    .addOptionalParam('gasprice', 'gas price to use for transactions', undefined, types.string)
    .addOptionalParam('maxfee', 'max fee per gas', undefined, types.string)
    .addOptionalParam('priorityfee', 'max priority fee per gas', undefined, types.string)
    .addFlag('reset', 'whether to delete deployments files first')
    .addFlag('log', 'whether to output log')
    .addFlag('reportGas', 'report gas use')
    .setAction(async (args, hre) => {
    let tags = args.tags;
    if (typeof tags === 'string') {
        tags = tags.split(',');
    }
    await deploymentsManager.runDeploy(tags, {
        log: args.log,
        resetMemory: false,
        deletePreviousDeployments: args.reset,
        writeDeploymentsToFiles: args.write,
        export: args.export,
        exportAll: args.exportAll,
        savePendingTx: args.pendingtx,
        gasPrice: args.gasprice,
        maxFeePerGas: args.maxfee,
        maxPriorityFeePerGas: args.priorityfee,
    });
    if (args.reportGas) {
        console.log(`total gas used: ${hre.deployments.getGasUsed()}`);
    }
});
config_1.subtask(exports.TASK_DEPLOY_MAIN, 'deploy')
    .addOptionalParam('export', 'export current network deployments')
    .addOptionalParam('exportAll', 'export all deployments into one file')
    .addOptionalParam('tags', 'specify which deploy script to execute via tags, separated by commas', undefined, types.string)
    .addOptionalParam('write', 'whether to write deployments to file', true, types.boolean)
    .addOptionalParam('pendingtx', 'whether to save pending tx', false, types.boolean)
    .addOptionalParam('gasprice', 'gas price to use for transactions', undefined, types.string)
    .addOptionalParam('maxfee', 'max fee per gas', undefined, types.string)
    .addOptionalParam('priorityfee', 'max priority fee per gas', undefined, types.string)
    .addFlag('noCompile', 'disable pre compilation')
    .addFlag('reset', 'whether to delete deployments files first')
    .addFlag('log', 'whether to output log')
    .addFlag('watch', 'redeploy on every change of contract or deploy script')
    .addFlag('watchOnly', 'do not actually deploy, just watch and deploy if changes occurs')
    .addFlag('reportGas', 'report gas use')
    .setAction(async (args, hre) => {
    if (args.reset) {
        await deploymentsManager.deletePreviousDeployments(args.runAsNode ? 'localhost' : undefined);
    }
    async function compileAndDeploy() {
        if (!args.noCompile) {
            await hre.run('compile');
        }
        return hre.run(exports.TASK_DEPLOY_RUN_DEPLOY, Object.assign(Object.assign({}, args), { reset: false }));
    }
    let currentPromise = args.watchOnly ? null : compileAndDeploy();
    if (args.watch || args.watchOnly) {
        const deployPaths = utils_1.getDeployPaths(hre.network);
        const watcher = chokidar_1.default.watch([hre.config.paths.sources, ...deployPaths], {
            ignored: /(^|[/\\])\../,
            persistent: true,
        });
        watcher.on('ready', () => console.log('Initial scan complete. Ready for changes'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let rejectPending = null;
        // eslint-disable-next-line no-inner-declarations,@typescript-eslint/no-explicit-any
        function pending() {
            return new Promise((resolve, reject) => {
                rejectPending = reject;
                if (currentPromise) {
                    currentPromise
                        .then(() => {
                        rejectPending = null;
                        resolve();
                    })
                        .catch((error) => {
                        rejectPending = null;
                        currentPromise = null;
                        console.error(error);
                    });
                }
                else {
                    rejectPending = null;
                    resolve();
                }
            });
        }
        watcher.on('change', async () => {
            console.log('change detected');
            if (currentPromise) {
                console.log('deployment in progress, please wait ...');
                if (rejectPending) {
                    // console.log("disabling previously pending redeployments...");
                    rejectPending();
                }
                try {
                    // console.log("waiting for current redeployment...");
                    await pending();
                    // console.log("pending finished");
                }
                catch (e) {
                    return;
                }
            }
            currentPromise = compileAndDeploy();
            try {
                await currentPromise;
            }
            catch (e) {
                console.error(e);
            }
            currentPromise = null;
        });
        try {
            await currentPromise;
        }
        catch (e) {
            console.error(e);
        }
        currentPromise = null;
        await new Promise((resolve) => setTimeout(resolve, 2000000000)); // TODO better way ?
    }
    else {
        const firstDeployments = await currentPromise;
        return firstDeployments;
    }
});
config_1.task(task_names_1.TASK_TEST, 'Runs mocha tests')
    .addFlag('deployFixture', 'run the global fixture before tests')
    .addFlag('noImpersonation', 'do not impersonate unknown accounts')
    .setAction(async (args, hre, runSuper) => {
    if (args.noImpersonation) {
        deploymentsManager.disableAutomaticImpersonation();
    }
    if (args.deployFixture || process.env.HARDHAT_DEPLOY_FIXTURE) {
        if (!args.noCompile) {
            await hre.run('compile');
        }
        await hre.deployments.fixture(undefined, {
            keepExistingDeployments: true, // by default reuse the existing deployments (useful for fork testing)
        });
        return runSuper(Object.assign(Object.assign({}, args), { noCompile: true }));
    }
    else {
        return runSuper(args);
    }
});
config_1.task(exports.TASK_DEPLOY, 'Deploy contracts')
    .addOptionalParam('export', 'export current network deployments')
    .addOptionalParam('exportAll', 'export all deployments into one file')
    .addOptionalParam('tags', 'specify which deploy script to execute via tags, separated by commas', undefined, types.string)
    .addOptionalParam('write', 'whether to write deployments to file', undefined, types.boolean)
    // TODO pendingtx
    .addOptionalParam('gasprice', 'gas price to use for transactions', undefined, types.string)
    .addOptionalParam('maxfee', 'max fee per gas', undefined, types.string)
    .addOptionalParam('priorityfee', 'max priority fee per gas', undefined, types.string)
    .addOptionalParam('deployScripts', 'override deploy script folder path', undefined, types.string)
    .addFlag('noImpersonation', 'do not impersonate unknown accounts')
    .addFlag('noCompile', 'disable pre compilation')
    .addFlag('reset', 'whether to delete deployments files first')
    .addFlag('silent', 'whether to remove log')
    .addFlag('watch', 'redeploy on every change of contract or deploy script')
    .addFlag('reportGas', 'report gas use')
    .setAction(async (args, hre) => {
    if (args.noImpersonation) {
        deploymentsManager.disableAutomaticImpersonation();
    }
    if (args.deployScripts) {
        // TODO support commas separated list
        hre.network.deploy = [
            normalizePath(hre.config, args.deployScripts, args.deployScripts),
        ];
        if (globalStore_1.store.networks[utils_1.getNetworkName(hre.network)]) {
            globalStore_1.store.networks[utils_1.getNetworkName(hre.network)].deploy = hre.network.deploy; // fallback to global store
        }
    }
    args.log = !args.silent;
    delete args.silent;
    if (args.write === undefined) {
        args.write = !isHardhatEVM(hre);
    }
    args.pendingtx = !isHardhatEVM(hre);
    await hre.run(exports.TASK_DEPLOY_MAIN, args);
});
config_1.task(exports.TASK_EXPORT, 'export contract deployment of the specified network into one file')
    .addOptionalParam('export', 'export current network deployments')
    .addOptionalParam('exportAll', 'export all deployments into one file')
    .setAction(async (args) => {
    await deploymentsManager.loadDeployments(false);
    await deploymentsManager.export(args);
});
async function enableProviderLogging(provider, enabled) {
    await provider.request({
        method: 'hardhat_setLoggingEnabled',
        params: [enabled],
    });
}
config_1.task(task_names_1.TASK_NODE, 'Starts a JSON-RPC server on top of Hardhat EVM')
    .addOptionalParam('export', 'export current network deployments')
    .addOptionalParam('exportAll', 'export all deployments into one file')
    .addOptionalParam('tags', 'specify which deploy script to execute via tags, separated by commas', undefined, types.string)
    .addOptionalParam('write', 'whether to write deployments to file', true, types.boolean)
    .addOptionalParam('gasprice', 'gas price to use for transactions', undefined, types.string)
    .addOptionalParam('maxfee', 'max fee per gas', undefined, types.string)
    .addOptionalParam('priorityfee', 'max priority fee per gas', undefined, types.string)
    // TODO --unlock-accounts
    .addFlag('noReset', 'do not delete deployments files already present')
    .addFlag('noImpersonation', 'do not impersonate unknown accounts')
    .addFlag('silent', 'whether to renove log')
    .addFlag('noDeploy', 'do not deploy')
    .addFlag('watch', 'redeploy on every change of contract or deploy script')
    .setAction(async (args, hre, runSuper) => {
    if (args.noImpersonation) {
        deploymentsManager.disableAutomaticImpersonation();
    }
    nodeTaskArgs = args;
    if (!isHardhatEVM(hre)) {
        throw new plugins_1.HardhatPluginError(`
Unsupported network for JSON-RPC server. Only hardhat is currently supported.
hardhat-deploy cannot run on the hardhat provider when defaultNetwork is not hardhat, see https://github.com/nomiclabs/hardhat/issues/1139 and https://github.com/wighawag/hardhat-deploy/issues/63
you can specifiy hardhat via "--network hardhat"
`);
    }
    deploymentsManager.runAsNode(true);
    // console.log('node', args);
    await runSuper(args);
});
config_1.subtask(task_names_1.TASK_NODE_GET_PROVIDER).setAction(async (args, hre, runSuper) => {
    const provider = await runSuper(args);
    if (!nodeTaskArgs.noReset) {
        await deploymentsManager.deletePreviousDeployments('localhost');
    }
    if (nodeTaskArgs.noDeploy) {
        // console.log('skip');
        return provider;
    }
    // console.log('enabling logging');
    await enableProviderLogging(provider, false);
    const networkName = utils_1.getNetworkName(hre.network);
    if (networkName !== hre.network.name) {
        console.log(`copying ${networkName}'s deployment to localhost...`);
        // copy existing deployment from specified netwotk into localhost deployment folder
        fs_extra_1.default.copy(path_1.default.join(hre.config.paths.deployments, networkName), path_1.default.join(hre.config.paths.deployments, 'localhost'));
    }
    nodeTaskArgs.log = !nodeTaskArgs.silent;
    delete nodeTaskArgs.silent;
    nodeTaskArgs.pendingtx = false;
    await hre.run(exports.TASK_DEPLOY_MAIN, Object.assign(Object.assign({}, nodeTaskArgs), { watch: false, reset: false }));
    await enableProviderLogging(provider, true);
    return provider;
});
config_1.subtask(task_names_1.TASK_NODE_SERVER_READY).setAction(async (args, hre, runSuper) => {
    await runSuper(args);
    if (nodeTaskArgs.watch) {
        await hre.run(exports.TASK_DEPLOY_MAIN, Object.assign(Object.assign({}, nodeTaskArgs), { watchOnly: true, reset: false }));
    }
});
config_1.task(exports.TASK_ETHERSCAN_VERIFY, 'submit contract source code to etherscan')
    .addOptionalParam('apiKey', 'etherscan api key', undefined, types.string)
    .addOptionalParam('license', 'SPDX license (useful if SPDX is not listed in the sources), need to be supported by etherscan: https://etherscan.io/contract-license-types', undefined, types.string)
    .addOptionalParam('apiUrl', 'specify the url manually', undefined, types.string)
    .addOptionalParam('contractName', 'specific contract name to verify', undefined, types.string)
    .addFlag('forceLicense', 'force the use of the license specified by --license option')
    .addFlag('sleep', 'sleep 500ms between each verification, so API rate limit is not exceeded')
    .addFlag('solcInput', 'fallback on solc-input (useful when etherscan fails on the minimum sources, see https://github.com/ethereum/solidity/issues/9573)')
    .addFlag('writePostData', 'write the post data on file in "etherscan_requests/<network>" folder, for debugging purpose')
    .setAction(async (args, hre) => {
    var _a, _b, _c, _d, _e, _f;
    const etherscanApiKey = args.apiKey ||
        process.env.ETHERSCAN_API_KEY ||
        ((_b = (_a = hre.network.verify) === null || _a === void 0 ? void 0 : _a.etherscan) === null || _b === void 0 ? void 0 : _b.apiKey) ||
        ((_d = (_c = hre.config.verify) === null || _c === void 0 ? void 0 : _c.etherscan) === null || _d === void 0 ? void 0 : _d.apiKey);
    if (!etherscanApiKey) {
        throw new Error(`No Etherscan API KEY provided. Set it through command line option, in hardhat.config.ts, or by setting the "ETHERSCAN_API_KEY" env variable`);
    }
    const solcInputsPath = await deploymentsManager.getSolcInputPath();
    await etherscan_1.submitSources(hre, solcInputsPath, {
        contractName: args.contractName,
        etherscanApiKey,
        license: args.license,
        fallbackOnSolcInput: args.solcInput,
        forceLicense: args.forceLicense,
        sleepBetween: args.sleep,
        apiUrl: args.apiUrl || ((_f = (_e = hre.network.verify) === null || _e === void 0 ? void 0 : _e.etherscan) === null || _f === void 0 ? void 0 : _f.apiUrl),
        writePostData: args.writePostData,
    });
});
config_1.task(exports.TASK_SOURCIFY, 'submit contract source code to sourcify (https://sourcify.dev)')
    .addOptionalParam('endpoint', 'endpoint url for sourcify', undefined, types.string)
    .addOptionalParam('contractName', 'specific contract name to verify', undefined, types.string)
    .addFlag('writeFailingMetadata', 'write to disk failing metadata for easy debugging')
    .setAction(async (args, hre) => {
    await sourcify_1.submitSourcesToSourcify(hre, args);
});
config_1.task('export-artifacts')
    .addPositionalParam('dest', 'destination folder where the extended artifacts files will be written to', undefined, types.string)
    .addFlag('solcInput', 'if set, artifacts will have an associated solcInput files (required for old version of solidity to ensure verifiability')
    .addFlag('includingEmptyBytecode', 'if set, even contract without bytecode (like interfaces) will be exported')
    .addFlag('includingNoPublicFunctions', 'if set, even contract without public interface (like imternal libraries) will be exported')
    .addOptionalParam('exclude', 'list of contract names separated by commas to exclude', undefined, types.string)
    .addOptionalParam('include', 'list of contract names separated by commas to include. If specified, only these will be considered', undefined, types.string)
    .addFlag('hideSources', 'if set, the artifacts files will not contain source code (metadata or other data exposing it) unless specified via --sources-for')
    .addOptionalParam('sourcesFor', 'list of contract names separated by commas to include source (metadata,etc...) for (see --hide-sources)', undefined, types.string)
    .setAction(async (args, hre) => {
    var _a, _b, _c, _d;
    await hre.run('compile');
    const argsInclude = args.include ? args.include.split(',') : [];
    const checkInclude = argsInclude.length > 0;
    const include = argsInclude.reduce((result, item) => {
        result[item] = true;
        return result;
    }, {});
    const argsExclude = args.exclude ? args.exclude.split(',') : [];
    const exclude = argsExclude.reduce((result, item) => {
        result[item] = true;
        return result;
    }, {});
    const argsSourcesFor = args.sourcesFor
        ? args.sourcesFor.split(',')
        : [];
    const sourcesFor = argsSourcesFor.reduce((result, item) => {
        result[item] = true;
        return result;
    }, {});
    const extendedArtifactFolderpath = args.dest;
    fs_extra_1.default.emptyDirSync(extendedArtifactFolderpath);
    const artifactPaths = await hre.artifacts.getArtifactPaths();
    for (const artifactPath of artifactPaths) {
        const artifact = await fs_extra_1.default.readJSON(artifactPath);
        const artifactName = path_1.default.basename(artifactPath, '.json');
        if (exclude[artifactName]) {
            continue;
        }
        if (checkInclude && !include[artifactName]) {
            continue;
        }
        const artifactDBGPath = path_1.default.join(path_1.default.dirname(artifactPath), artifactName + '.dbg.json');
        const artifactDBG = await fs_extra_1.default.readJSON(artifactDBGPath);
        const buildinfoPath = path_1.default.join(path_1.default.dirname(artifactDBGPath), artifactDBG.buildInfo);
        const buildInfo = await fs_extra_1.default.readJSON(buildinfoPath);
        const output = buildInfo.output.contracts[artifact.sourceName][artifactName];
        if (!args.includingNoPublicFunctions) {
            if (!artifact.abi ||
                artifact.abi.filter((v) => v.type !== 'event').length === 0) {
                continue;
            }
        }
        if (!args.includingEmptyBytecode) {
            if (!artifact.bytecode || artifact.bytecode === '0x') {
                continue;
            }
        }
        // TODO decide on ExtendedArtifact vs Artifact vs Deployment type
        // save space by not duplicating bytecodes
        if ((_b = (_a = output.evm) === null || _a === void 0 ? void 0 : _a.bytecode) === null || _b === void 0 ? void 0 : _b.object) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            output.evm.bytecode.object = undefined;
        }
        if ((_d = (_c = output.evm) === null || _c === void 0 ? void 0 : _c.deployedBytecode) === null || _d === void 0 ? void 0 : _d.object) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            output.evm.deployedBytecode.object = undefined;
        }
        // -----------------------------------------
        const extendedArtifact = Object.assign(Object.assign({}, artifact), output);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extendedArtifact._format = undefined;
        if (args.solcInput) {
            const solcInput = JSON.stringify(buildInfo.input, null, '  ');
            const solcInputHash = Buffer.from(murmur_128_1.default(solcInput)).toString('hex');
            extendedArtifact.solcInput = solcInput;
            extendedArtifact.solcInputHash = solcInputHash;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let dataToWrite = extendedArtifact;
        if (args.hideSources && !sourcesFor[artifactName]) {
            dataToWrite = {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                contractName: extendedArtifact.contractName,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sourceName: extendedArtifact.sourceName,
                abi: extendedArtifact.abi,
                bytecode: extendedArtifact.bytecode,
                deployedBytecode: extendedArtifact.deployedBytecode,
                linkReferences: extendedArtifact.linkReferences,
                deployedLinkReferences: extendedArtifact.deployedLinkReferences,
                devdoc: extendedArtifact.devdoc,
                userdoc: extendedArtifact.userdoc,
                evm: extendedArtifact.evm
                    ? {
                        gasEstimates: extendedArtifact.evm.gasEstimates,
                        methodIdentifiers: extendedArtifact.evm.methodIdentifiers,
                    }
                    : undefined,
            };
        }
        let filepath = path_1.default.join(extendedArtifactFolderpath, artifactName + '.json');
        if (dataToWrite.sourceName) {
            if (dataToWrite.contractName) {
                filepath = path_1.default.join(extendedArtifactFolderpath, dataToWrite.sourceName, dataToWrite.contractName + '.json');
            }
            else {
                filepath = path_1.default.join(extendedArtifactFolderpath, dataToWrite.sourceName, artifactName + '.json');
            }
        }
        fs_extra_1.default.ensureFileSync(filepath);
        fs_extra_1.default.writeFileSync(filepath, JSON.stringify(dataToWrite, null, '  '));
    }
});
//# sourceMappingURL=index.js.map