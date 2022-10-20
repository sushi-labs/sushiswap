"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCosmiConfigSync = exports.createCosmiConfig = exports.isLegacyConfig = void 0;
var cosmiconfig_1 = require("cosmiconfig");
var cosmiconfig_typescript_loader_1 = require("cosmiconfig-typescript-loader");
var cosmiconfig_toml_loader_1 = require("cosmiconfig-toml-loader");
var string_env_interpolation_1 = require("string-env-interpolation");
var legacySearchPlaces = ['.graphqlconfig', '.graphqlconfig.json', '.graphqlconfig.yaml', '.graphqlconfig.yml'];
function isLegacyConfig(filepath) {
    filepath = filepath.toLowerCase();
    return legacySearchPlaces.some(function (name) { return filepath.endsWith(name); });
}
exports.isLegacyConfig = isLegacyConfig;
function transformContent(content) {
    return (0, string_env_interpolation_1.env)(content);
}
var createCustomLoader = function (loader) {
    return function (filepath, content) {
        return loader(filepath, transformContent(content));
    };
};
function createCosmiConfig(moduleName, _a) {
    var legacy = _a.legacy;
    var options = prepareCosmiconfig(moduleName, {
        legacy: legacy,
    });
    return (0, cosmiconfig_1.cosmiconfig)(moduleName, options);
}
exports.createCosmiConfig = createCosmiConfig;
function createCosmiConfigSync(moduleName, _a) {
    var legacy = _a.legacy;
    var options = prepareCosmiconfig(moduleName, { legacy: legacy });
    return (0, cosmiconfig_1.cosmiconfigSync)(moduleName, options);
}
exports.createCosmiConfigSync = createCosmiConfigSync;
function prepareCosmiconfig(moduleName, _a) {
    var legacy = _a.legacy;
    var loadYaml = createCustomLoader(cosmiconfig_1.defaultLoaders['.yaml']);
    var loadTomlCustom = createCustomLoader(cosmiconfig_toml_loader_1.loadToml);
    var loadJson = createCustomLoader(cosmiconfig_1.defaultLoaders['.json']);
    var searchPlaces = [
        '#.config.ts',
        '#.config.js',
        '#.config.cjs',
        '#.config.json',
        '#.config.yaml',
        '#.config.yml',
        '#.config.toml',
        '.#rc',
        '.#rc.ts',
        '.#rc.js',
        '.#rc.cjs',
        '.#rc.json',
        '.#rc.yml',
        '.#rc.yaml',
        '.#rc.toml',
        'package.json',
    ];
    if (legacy) {
        searchPlaces.push.apply(searchPlaces, legacySearchPlaces);
    }
    // We need to wrap loaders in order to access and transform file content (as string)
    // Cosmiconfig has transform option but at this point config is not a string but an object
    return {
        searchPlaces: searchPlaces.map(function (place) { return place.replace('#', moduleName); }),
        loaders: {
            '.ts': (0, cosmiconfig_typescript_loader_1.TypeScriptLoader)({ transpileOnly: true }),
            '.js': cosmiconfig_1.defaultLoaders['.js'],
            '.json': loadJson,
            '.yaml': loadYaml,
            '.yml': loadYaml,
            '.toml': loadTomlCustom,
            noExt: loadYaml,
        },
    };
}
