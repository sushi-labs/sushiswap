"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }




var _chunkM24XL6CIjs = require('./chunk-M24XL6CI.js');


var _chunkWXLEX5S3js = require('./chunk-WXLEX5S3.js');

// src/load.ts
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);
var _joycon = require('joycon'); var _joycon2 = _interopRequireDefault(_joycon);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _bundlerequire = require('bundle-require');
var joycon = new (0, _joycon2.default)();
var loadJson = async (filepath) => {
  try {
    return _chunkWXLEX5S3js.jsoncParse.call(void 0, await _fs2.default.promises.readFile(filepath, "utf8"));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse ${_path2.default.relative(process.cwd(), filepath)}: ${error.message}`);
    } else {
      throw error;
    }
  }
};
var jsonLoader = {
  test: /\.json$/,
  load(filepath) {
    return loadJson(filepath);
  }
};
joycon.addLoader(jsonLoader);
async function loadTsupConfig(cwd, configFile) {
  const configJoycon = new (0, _joycon2.default)();
  const configPath = await configJoycon.resolve({
    files: configFile ? [configFile] : [
      "tsup.config.ts",
      "tsup.config.js",
      "tsup.config.cjs",
      "tsup.config.mjs",
      "tsup.config.json",
      "package.json"
    ],
    cwd,
    stopDir: _path2.default.parse(cwd).root,
    packageKey: "tsup"
  });
  if (configPath) {
    if (configPath.endsWith(".json")) {
      let data = await loadJson(configPath);
      if (configPath.endsWith("package.json")) {
        data = data.tsup;
      }
      if (data) {
        return { path: configPath, data };
      }
      return {};
    }
    const config = await _bundlerequire.bundleRequire.call(void 0, {
      filepath: configPath
    });
    return {
      path: configPath,
      data: config.mod.tsup || config.mod.default || config.mod
    };
  }
  return {};
}
async function loadPkg(cwd) {
  const { data } = await joycon.load(["package.json"], cwd, _path2.default.dirname(cwd));
  return data || {};
}
async function getDeps(cwd) {
  const data = await loadPkg(cwd);
  const deps = Array.from(/* @__PURE__ */ new Set([
    ...Object.keys(data.dependencies || {}),
    ...Object.keys(data.peerDependencies || {})
  ]));
  return deps;
}

// src/log.ts
var colorize = (type, data, onlyImportant = false) => {
  if (onlyImportant && (type === "info" || type === "success"))
    return data;
  const color = type === "info" ? "blue" : type === "error" ? "red" : type === "warn" ? "yellow" : "green";
  return _chunkM24XL6CIjs.colorette_exports[color](data);
};
var makeLabel = (name, input, type) => {
  return [
    name && `${_chunkM24XL6CIjs.dim.call(void 0, "[")}${name.toUpperCase()}${_chunkM24XL6CIjs.dim.call(void 0, "]")}`,
    colorize(type, input.toUpperCase())
  ].filter(Boolean).join(" ");
};
var silent = false;
function setSilent(isSilent) {
  silent = !!isSilent;
}
function getSilent() {
  return silent;
}
var createLogger = (name) => {
  return {
    setName(_name) {
      name = _name;
    },
    success(label, ...args) {
      return this.log(label, "success", ...args);
    },
    info(label, ...args) {
      return this.log(label, "info", ...args);
    },
    error(label, ...args) {
      return this.log(label, "error", ...args);
    },
    warn(label, ...args) {
      return this.log(label, "warn", ...args);
    },
    log(label, type, ...data) {
      switch (type) {
        case "error": {
          return console.error(makeLabel(name, label, type), ...data.map((item) => colorize(type, item, true)));
        }
        default:
          if (silent)
            return;
          console.log(makeLabel(name, label, type), ...data.map((item) => colorize(type, item, true)));
      }
    }
  };
};

// src/lib/report-size.ts
var prettyBytes = (bytes) => {
  if (bytes === 0)
    return "0 B";
  const unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const exp = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, exp)).toFixed(2)} ${unit[exp]}`;
};
var getLengthOfLongestString = (strings) => {
  return strings.reduce((max, str) => {
    return Math.max(max, str.length);
  }, 0);
};
var padRight = (str, maxLength) => {
  return str + " ".repeat(maxLength - str.length);
};
var reportSize = (logger, format, files) => {
  const filenames = Object.keys(files);
  const maxLength = getLengthOfLongestString(filenames) + 1;
  for (const name of filenames) {
    logger.success(format, `${_chunkM24XL6CIjs.bold.call(void 0, padRight(name, maxLength))}${_chunkM24XL6CIjs.green.call(void 0, prettyBytes(files[name]))}`);
  }
};









exports.loadTsupConfig = loadTsupConfig; exports.loadPkg = loadPkg; exports.getDeps = getDeps; exports.setSilent = setSilent; exports.getSilent = getSilent; exports.createLogger = createLogger; exports.reportSize = reportSize;
