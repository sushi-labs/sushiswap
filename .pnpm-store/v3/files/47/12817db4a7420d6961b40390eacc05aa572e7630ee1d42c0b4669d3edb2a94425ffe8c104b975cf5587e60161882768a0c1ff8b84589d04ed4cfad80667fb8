"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequire = exports.requireDependencies = void 0;
const fs_1 = require("fs");
const vm_1 = require("vm");
const path_1 = require("path");
/**
 * Allows to require a series of dependencies provided by their path
 * into a provided module context. It fills and accepts a require
 * cache to ensure each module is loaded once.
 */
function requireDependencies(params) {
    const { context, requireCache, dependencies } = params;
    const requireFn = createRequire(context, requireCache);
    for (const { path, mapExports } of dependencies) {
        const mod = requireFn(path, path);
        for (const mapKey of Object.keys(mapExports)) {
            context[mapExports[mapKey]] = mod[mapKey];
        }
    }
}
exports.requireDependencies = requireDependencies;
function createRequire(context, cache) {
    return function requireFn(referrer, specifier) {
        const resolved = require.resolve(specifier, {
            paths: [(0, path_1.dirname)(referrer)],
        });
        const cached = cache.get(resolved);
        if (cached !== undefined) {
            return cached.exports;
        }
        const module = {
            exports: {},
            loaded: false,
            id: resolved,
        };
        cache.set(resolved, module);
        const fn = (0, vm_1.runInContext)(`(function(module,exports,require,__dirname,__filename) {${(0, fs_1.readFileSync)(resolved, 'utf-8')}\n})`, context);
        try {
            fn(module, module.exports, requireFn.bind(null, resolved), (0, path_1.dirname)(resolved), resolved);
        }
        finally {
            cache.delete(resolved);
        }
        module.loaded = true;
        return module.exports;
    };
}
exports.createRequire = createRequire;
//# sourceMappingURL=require.js.map