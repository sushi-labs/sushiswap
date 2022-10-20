import { cosmiconfig, cosmiconfigSync, defaultLoaders } from 'cosmiconfig';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
import { loadToml } from 'cosmiconfig-toml-loader';
import { env } from 'string-env-interpolation';
var legacySearchPlaces = ['.graphqlconfig', '.graphqlconfig.json', '.graphqlconfig.yaml', '.graphqlconfig.yml'];
export function isLegacyConfig(filepath) {
    filepath = filepath.toLowerCase();
    return legacySearchPlaces.some(function (name) { return filepath.endsWith(name); });
}
function transformContent(content) {
    return env(content);
}
var createCustomLoader = function (loader) {
    return function (filepath, content) {
        return loader(filepath, transformContent(content));
    };
};
export function createCosmiConfig(moduleName, _a) {
    var legacy = _a.legacy;
    var options = prepareCosmiconfig(moduleName, {
        legacy: legacy,
    });
    return cosmiconfig(moduleName, options);
}
export function createCosmiConfigSync(moduleName, _a) {
    var legacy = _a.legacy;
    var options = prepareCosmiconfig(moduleName, { legacy: legacy });
    return cosmiconfigSync(moduleName, options);
}
function prepareCosmiconfig(moduleName, _a) {
    var legacy = _a.legacy;
    var loadYaml = createCustomLoader(defaultLoaders['.yaml']);
    var loadTomlCustom = createCustomLoader(loadToml);
    var loadJson = createCustomLoader(defaultLoaders['.json']);
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
            '.ts': TypeScriptLoader({ transpileOnly: true }),
            '.js': defaultLoaders['.js'],
            '.json': loadJson,
            '.yaml': loadYaml,
            '.yml': loadYaml,
            '.toml': loadTomlCustom,
            noExt: loadYaml,
        },
    };
}
