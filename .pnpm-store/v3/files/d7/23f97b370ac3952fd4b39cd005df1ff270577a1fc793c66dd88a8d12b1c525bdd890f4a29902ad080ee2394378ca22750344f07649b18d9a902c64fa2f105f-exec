#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Lightweight entrypoint to native swc cli binary.
 *
 * This is to locate corresponding per-platform executables correctly, as well as
 * let npm links binary to `node_modules/.bin` allows npm-related ecosystem (`npx swcx`, etcs)
 * works correctly. However, it means spawning native binary still requires warmup from node.js
 * process.
 *
 * NOTE: THIS IS NOT A PERMANENT APPROACH.
 * Distribution of native cli binary is not fully concluded yet. This allows easier
 * opt-in while implementation is in progress to collect feedback.
 */
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const { platform, arch } = process;
const isMusl = () => (() => {
    function isMusl() {
        if (!process.report || typeof process.report.getReport !== "function") {
            try {
                return (0, fs_1.readFileSync)("/usr/bin/ldd", "utf8").includes("musl");
            }
            catch (e) {
                return true;
            }
        }
        else {
            const { glibcVersionRuntime } = process.report.getReport().header;
            return !glibcVersionRuntime;
        }
    }
    return isMusl();
})();
const platformPackagesMap = {
    "android": {
        "arm64": "@swc/core-android-arm64",
        "arm": "@swc/core-android-arm-eabi",
    },
    "win32": {
        "x64": "@swc/core-win32-x64-msvc",
        "ia32": "@swc/core-win32-ia32-msvc",
        "arm64": "@swc/core-win32-arm64-msvc"
    },
    "darwin": {
        "x64": "@swc/core-darwin-x64",
        "arm64": "@swc/core-darwin-arm64",
    },
    "freebsd": {
        "x64": "@swc/core-freebsd-x64",
    },
    "linux": {
        "x64": `@swc/core-linux-x64-${isMusl() ? 'musl' : 'gnu'}`,
        "arm64": `@swc/core-linux-arm64-${isMusl() ? 'musl' : 'gnu'}`,
        "arm": "@swc/core-linux-arm64-gnu"
    },
};
const inferBinaryName = () => {
    const packageName = platformPackagesMap[platform][arch];
    if (!packageName) {
        throw new Error(`Unsupported platform: binary for '${platform} ${arch}' is not available`);
    }
    return path_1.default.join(path_1.default.dirname(require.resolve(packageName)), platform === 'win32' ? 'swc.exe' : 'swc');
};
const executeBinary = () => __awaiter(void 0, void 0, void 0, function* () {
    const binary = inferBinaryName();
    const [, , ...args] = process.argv;
    const options = { cwd: process.cwd(), stdio: "inherit" };
    return (0, child_process_1.spawn)(binary, args, options);
});
executeBinary().catch((e) => console.error(e));
