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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const config_1 = require("hardhat/config");
const errors_1 = require("hardhat/internal/core/errors");
const path_1 = require("path");
function getDefaultConfig() {
    return {
        extends: ["solhint:default"],
    };
}
function getFormatter(formatterName = "stylish") {
    try {
        const solhintPath = require.resolve("solhint");
        const formatterPath = require.resolve(`eslint/lib/formatters/${formatterName}`, { paths: [solhintPath] });
        return require(formatterPath);
    }
    catch (ex) {
        throw new errors_1.NomicLabsHardhatPluginError("@nomiclabs/hardhat-solhint", `An error occurred loading the solhint formatter ${formatterName}`, ex);
    }
}
async function hasConfigFile(rootDirectory) {
    const files = [
        ".solhint.json",
        ".solhintrc",
        ".solhintrc.json",
        ".solhintrc.yaml",
        ".solhintrc.yml",
        ".solhintrc.js",
        "solhint.config.js",
    ];
    for (const file of files) {
        if (fs.existsSync((0, path_1.join)(rootDirectory, file))) {
            return true;
        }
    }
    return false;
}
async function getSolhintConfig(rootDirectory) {
    let solhintConfig;
    const { loadConfig, applyExtends } = await Promise.resolve().then(() => __importStar(require("solhint/lib/config/config-file")));
    if (await hasConfigFile(rootDirectory)) {
        try {
            solhintConfig = await loadConfig();
        }
        catch (err) {
            throw new errors_1.NomicLabsHardhatPluginError("@nomiclabs/hardhat-solhint", "An error occurred when loading your solhint config.", err);
        }
    }
    else {
        solhintConfig = getDefaultConfig();
    }
    try {
        solhintConfig = applyExtends(solhintConfig);
    }
    catch (err) {
        throw new errors_1.NomicLabsHardhatPluginError("@nomiclabs/hardhat-solhint", "An error occurred when processing your solhint config.", err);
    }
    return solhintConfig;
}
function printReport(reports) {
    const formatter = getFormatter();
    console.log(formatter(reports));
}
(0, config_1.subtask)("hardhat-solhint:run-solhint", async (_, { config }) => {
    const { processPath } = await Promise.resolve().then(() => __importStar(require("solhint/lib/index")));
    return processPath((0, path_1.join)(config.paths.sources, "**", "*.sol"), await getSolhintConfig(config.paths.root));
});
(0, config_1.task)("check", async (_, { run }, runSuper) => {
    if (runSuper.isDefined) {
        await runSuper();
    }
    const reports = await run("hardhat-solhint:run-solhint");
    printReport(reports);
});
//# sourceMappingURL=index.js.map