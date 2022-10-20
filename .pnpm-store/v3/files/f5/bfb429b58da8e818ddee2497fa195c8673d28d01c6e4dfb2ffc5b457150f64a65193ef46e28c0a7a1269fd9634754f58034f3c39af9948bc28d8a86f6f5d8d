"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCompilerVersion = exports.newCompilerConfig = exports.compareConfigs = exports.resolveDependencies = exports.getContracts = exports.getCompilerDataFromContracts = void 0;
const plugins_1 = require("hardhat/plugins");
const index_1 = require("../index");
const getCompilerDataFromContracts = (contracts, flatContracts, hhConfig) => {
    let contract;
    let mainContract;
    let config;
    for (contract of contracts) {
        for (mainContract of flatContracts) {
            if (mainContract.name !== contract.contractName) {
                continue;
            }
            const contractConfig = (0, exports.newCompilerConfig)(hhConfig, contract.sourcePath);
            if (config && !(0, exports.compareConfigs)(contractConfig, config)) {
                console.log(`Error in ${index_1.PluginName}: Different compiler versions provided in same request`);
                throw new Error("Compiler version mismatch");
            }
            else {
                config = contractConfig;
            }
        }
    }
    return config;
};
exports.getCompilerDataFromContracts = getCompilerDataFromContracts;
const getContracts = async (hre, flatContracts) => {
    const sourcePaths = await hre.run("compile:solidity:get-source-paths");
    const sourceNames = await hre.run("compile:solidity:get-source-names", {
        sourcePaths
    });
    const data = await hre.run("compile:solidity:get-dependency-graph", {
        sourceNames
    });
    if (data.length === 0) {
        throw new plugins_1.HardhatPluginError(index_1.PluginName, "Could not detect any contracts inside hardhat project. Make sure you have some contracts under ./contracts directory.");
    }
    let contract;
    const requestContracts = [];
    const metadata = {
        compiler: {
            version: (0, exports.extractCompilerVersion)(hre.config)
        },
        sources: {}
    };
    data._resolvedFiles.forEach((resolvedFile, _) => {
        const sourcePath = resolvedFile.sourceName;
        const name = sourcePath
            .split("/")
            .slice(-1)[0]
            .split(".")[0];
        for (contract of flatContracts) {
            if (contract.name !== name) {
                continue;
            }
            metadata.sources[sourcePath] = {
                content: resolvedFile.content.rawContent
            };
            const visited = {};
            (0, exports.resolveDependencies)(data, sourcePath, metadata, visited);
        }
    });
    for (const [key, value] of Object.entries(metadata.sources)) {
        const name = key
            .split("/")
            .slice(-1)[0]
            .split(".")[0];
        const contractToPush = {
            contractName: name,
            source: value.content,
            sourcePath: key,
            networks: {},
            compiler: {
                name: "solc",
                version: (0, exports.extractCompilerVersion)(hre.config, key)
            }
        };
        requestContracts.push(contractToPush);
    }
    return requestContracts;
};
exports.getContracts = getContracts;
const resolveDependencies = (dependencyData, sourcePath, metadata, visited) => {
    if (visited[sourcePath]) {
        return;
    }
    visited[sourcePath] = true;
    dependencyData._dependenciesPerFile
        .get(sourcePath)
        .forEach((resolvedDependency, __) => {
        (0, exports.resolveDependencies)(dependencyData, resolvedDependency.sourceName, metadata, visited);
        metadata.sources[resolvedDependency.sourceName] = {
            content: resolvedDependency.content.rawContent
        };
    });
};
exports.resolveDependencies = resolveDependencies;
const compareConfigs = (originalConfig, newConfig) => {
    if (originalConfig.compiler_version !== newConfig.compiler_version) {
        return false;
    }
    if (originalConfig.optimizations_used !== newConfig.optimizations_used) {
        return false;
    }
    if (originalConfig.optimizations_count !== newConfig.optimizations_count) {
        return false;
    }
    if (originalConfig.evm_version !== newConfig.evm_version) {
        return false;
    }
    return true;
};
exports.compareConfigs = compareConfigs;
const newCompilerConfig = (config, sourcePath) => {
    if (sourcePath !== undefined &&
        config.solidity.overrides[sourcePath] !== undefined) {
        return {
            compiler_version: config.solidity.overrides[sourcePath].version,
            optimizations_used: config.solidity.overrides[sourcePath].settings.optimizer.enabled,
            optimizations_count: config.solidity.overrides[sourcePath].settings.optimizer.runs,
            evm_version: config.solidity.overrides[sourcePath].settings.evmVersion,
            debug: config.solidity.overrides[sourcePath].settings.debug
        };
    }
    return {
        compiler_version: config.solidity.compilers[0].version,
        optimizations_used: config.solidity.compilers[0].settings.optimizer.enabled,
        optimizations_count: config.solidity.compilers[0].settings.optimizer.runs,
        evm_version: config.solidity.compilers[0].settings.evmVersion,
        debug: config.solidity.compilers[0].settings.debug
    };
};
exports.newCompilerConfig = newCompilerConfig;
const extractCompilerVersion = (config, sourcePath) => {
    if (sourcePath !== undefined &&
        config.solidity.overrides[sourcePath] !== undefined) {
        return config.solidity.overrides[sourcePath].version;
    }
    return config.solidity.compilers[0].version;
};
exports.extractCompilerVersion = extractCompilerVersion;
//# sourceMappingURL=util.js.map