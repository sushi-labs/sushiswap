'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var debug = require('debug');
var glob = require('glob');
var isGlob = require('is-glob');
var resolve$1 = require('resolve');
var tsconfigPaths = require('tsconfig-paths');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var debug__default = /*#__PURE__*/_interopDefaultLegacy(debug);
var isGlob__default = /*#__PURE__*/_interopDefaultLegacy(isGlob);

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const IMPORTER_NAME = "eslint-import-resolver-typescript";
const log = debug__default["default"](IMPORTER_NAME);
const defaultExtensions = [
  ".ts",
  ".tsx",
  ".d.ts",
  ".js",
  ".jsx",
  ".json",
  ".node"
];
const interfaceVersion = 2;
function resolve(source, file, options) {
  var _a, _b, _c, _d;
  options = options != null ? options : {};
  log("looking for:", source);
  source = removeQuerystring(source);
  if (resolve$1.isCore(source)) {
    log("matched core:", source);
    return {
      found: true,
      path: null
    };
  }
  initMappers(options);
  const mappedPath = getMappedPath(source);
  if (mappedPath) {
    log("matched ts path:", mappedPath.path);
  }
  let foundNodePath;
  try {
    foundNodePath = tsResolve((_a = mappedPath == null ? void 0 : mappedPath.path) != null ? _a : source, __spreadProps(__spreadValues({}, options), {
      extensions: (_c = (_b = mappedPath == null ? void 0 : mappedPath.extensions) != null ? _b : options.extensions) != null ? _c : defaultExtensions,
      basedir: path__default["default"].dirname(path__default["default"].resolve(file)),
      packageFilter: (_d = options.packageFilter) != null ? _d : packageFilterDefault
    }));
  } catch (e) {
    foundNodePath = null;
  }
  if ((/\.jsx?$/.test(foundNodePath) || options.alwaysTryTypes && !foundNodePath) && !/^@types[/\\]/.test(source) && !path__default["default"].isAbsolute(source) && !source.startsWith(".")) {
    const definitelyTyped = resolve("@types" + path__default["default"].sep + mangleScopedPackage(source), file, options);
    if (definitelyTyped.found) {
      return definitelyTyped;
    }
  }
  if (foundNodePath) {
    log("matched node path:", foundNodePath);
    return {
      found: true,
      path: foundNodePath
    };
  }
  log("didn't find ", source);
  return {
    found: false
  };
}
function packageFilterDefault(pkg) {
  pkg.main = pkg.types || pkg.typings || pkg.module || pkg["jsnext:main"] || pkg.main;
  return pkg;
}
function resolveExtension(id) {
  const idWithoutJsExt = removeJsExtension(id);
  if (idWithoutJsExt === id) {
    return;
  }
  if (id.endsWith(".mjs")) {
    return {
      path: idWithoutJsExt,
      extensions: [".mts", ".d.mts"]
    };
  }
  if (id.endsWith(".cjs")) {
    return {
      path: idWithoutJsExt,
      extensions: [".cts", ".d.cts"]
    };
  }
  return {
    path: idWithoutJsExt
  };
}
function tsResolve(id, opts) {
  var _a;
  try {
    return resolve$1.sync(id, opts);
  } catch (error) {
    const resolved = resolveExtension(id);
    if (resolved) {
      return resolve$1.sync(resolved.path, __spreadProps(__spreadValues({}, opts), {
        extensions: (_a = resolved.extensions) != null ? _a : opts.extensions
      }));
    }
    throw error;
  }
}
function removeQuerystring(id) {
  const querystringIndex = id.lastIndexOf("?");
  if (querystringIndex >= 0) {
    return id.slice(0, querystringIndex);
  }
  return id;
}
function removeJsExtension(id) {
  return id.replace(/\.([cm]js|jsx?)$/, "");
}
let mappersBuildForOptions;
let mappers;
function getMappedPath(source) {
  const paths = mappers.map((mapper) => mapper(source)).filter((path2) => !!path2);
  if (paths.length > 1) {
    log("found multiple matching ts paths:", paths);
  }
  return paths[0];
}
const createExtendedMatchPath = (...createArgs) => {
  const matchPath = tsconfigPaths.createMatchPath(...createArgs);
  return (id, readJson, fileExists, extensions) => {
    var _a;
    const match = matchPath(id, readJson, fileExists, extensions);
    if (match != null) {
      return {
        path: match
      };
    }
    const resolved = resolveExtension(id);
    if (resolved) {
      const match2 = matchPath(resolved.path, readJson, fileExists, (_a = resolved.extensions) != null ? _a : extensions);
      if (match2) {
        return {
          path: match2,
          extensions: resolved.extensions
        };
      }
    }
  };
};
function initMappers(options) {
  if (mappers && mappersBuildForOptions === options) {
    return;
  }
  if (options.directory) {
    console.warn(`[${IMPORTER_NAME}]: option \`directory\` is deprecated, please use \`project\` instead`);
    if (!options.project) {
      options.project = options.directory;
    }
  }
  const configPaths = typeof options.project === "string" ? [options.project] : Array.isArray(options.project) ? options.project : [process.cwd()];
  mappers = configPaths.reduce((paths, path2) => [...paths, ...isGlob__default["default"](path2) ? glob.sync(path2) : [path2]], []).map(tsconfigPaths.loadConfig).filter(isConfigLoaderSuccessResult).map((configLoaderResult) => {
    const matchPath = createExtendedMatchPath(configLoaderResult.absoluteBaseUrl, configLoaderResult.paths);
    return (source) => {
      var _a;
      return matchPath(source, void 0, void 0, (_a = options.extensions) != null ? _a : defaultExtensions);
    };
  });
  mappersBuildForOptions = options;
}
function isConfigLoaderSuccessResult(configLoaderResult) {
  if (configLoaderResult.resultType !== "success") {
    log("failed to init tsconfig-paths:", configLoaderResult.message);
    return false;
  }
  return true;
}
function mangleScopedPackage(moduleName) {
  if (moduleName.startsWith("@")) {
    const replaceSlash = moduleName.replace(path__default["default"].sep, "__");
    if (replaceSlash !== moduleName) {
      return replaceSlash.slice(1);
    }
  }
  return moduleName;
}

exports.interfaceVersion = interfaceVersion;
exports.resolve = resolve;
