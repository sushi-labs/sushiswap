"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDependencies = exports.getScriptName = exports.runPipInstall = exports.runBundleInstall = exports.runPackageJsonScript = exports.runCustomInstallCommand = exports.getEnvForPackageManager = exports.runNpmInstall = exports.walkParentDirs = exports.scanParentDirs = exports.getNodeVersion = exports.getSpawnOptions = exports.runShellScript = exports.getNodeBinPath = exports.execCommand = exports.spawnCommand = exports.execAsync = exports.spawnAsync = void 0;
const assert_1 = __importDefault(require("assert"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const async_sema_1 = __importDefault(require("async-sema"));
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const semver_1 = require("semver");
const util_1 = require("util");
const debug_1 = __importDefault(require("../debug"));
const errors_1 = require("../errors");
const node_version_1 = require("./node-version");
const read_config_file_1 = require("./read-config-file");
// Only allow one `runNpmInstall()` invocation to run concurrently
const runNpmInstallSema = new async_sema_1.default(1);
function spawnAsync(command, args, opts = {}) {
    return new Promise((resolve, reject) => {
        const stderrLogs = [];
        opts = { stdio: 'inherit', ...opts };
        const child = cross_spawn_1.default(command, args, opts);
        if (opts.stdio === 'pipe' && child.stderr) {
            child.stderr.on('data', data => stderrLogs.push(data));
        }
        child.on('error', reject);
        child.on('close', (code, signal) => {
            if (code === 0 || opts.ignoreNon0Exit) {
                return resolve();
            }
            const cmd = opts.prettyCommand
                ? `Command "${opts.prettyCommand}"`
                : 'Command';
            reject(new errors_1.NowBuildError({
                code: `BUILD_UTILS_SPAWN_${code || signal}`,
                message: opts.stdio === 'inherit'
                    ? `${cmd} exited with ${code || signal}`
                    : stderrLogs.map(line => line.toString()).join(''),
            }));
        });
    });
}
exports.spawnAsync = spawnAsync;
function execAsync(command, args, opts = {}) {
    return new Promise((resolve, reject) => {
        opts.stdio = 'pipe';
        const stdoutList = [];
        const stderrList = [];
        const child = cross_spawn_1.default(command, args, opts);
        child.stderr.on('data', data => {
            stderrList.push(data);
        });
        child.stdout.on('data', data => {
            stdoutList.push(data);
        });
        child.on('error', reject);
        child.on('close', (code, signal) => {
            if (code === 0 || opts.ignoreNon0Exit) {
                return resolve({
                    code,
                    stdout: Buffer.concat(stdoutList).toString(),
                    stderr: Buffer.concat(stderrList).toString(),
                });
            }
            const cmd = opts.prettyCommand
                ? `Command "${opts.prettyCommand}"`
                : 'Command';
            return reject(new errors_1.NowBuildError({
                code: `BUILD_UTILS_EXEC_${code || signal}`,
                message: `${cmd} exited with ${code || signal}`,
            }));
        });
    });
}
exports.execAsync = execAsync;
function spawnCommand(command, options = {}) {
    const opts = { ...options, prettyCommand: command };
    if (process.platform === 'win32') {
        return cross_spawn_1.default('cmd.exe', ['/C', command], opts);
    }
    return cross_spawn_1.default('sh', ['-c', command], opts);
}
exports.spawnCommand = spawnCommand;
async function execCommand(command, options = {}) {
    const opts = { ...options, prettyCommand: command };
    if (process.platform === 'win32') {
        await spawnAsync('cmd.exe', ['/C', command], opts);
    }
    else {
        await spawnAsync('sh', ['-c', command], opts);
    }
    return true;
}
exports.execCommand = execCommand;
async function getNodeBinPath({ cwd, }) {
    const { code, stdout, stderr } = await execAsync('npm', ['bin'], {
        cwd,
        prettyCommand: 'npm bin',
        // in some rare cases, we saw `npm bin` exit with a non-0 code, but still
        // output the right bin path, so we ignore the exit code
        ignoreNon0Exit: true,
    });
    const nodeBinPath = stdout.trim();
    if (path_1.default.isAbsolute(nodeBinPath)) {
        return nodeBinPath;
    }
    throw new errors_1.NowBuildError({
        code: `BUILD_UTILS_GET_NODE_BIN_PATH`,
        message: `Running \`npm bin\` failed to return a valid bin path (code=${code}, stdout=${stdout}, stderr=${stderr})`,
    });
}
exports.getNodeBinPath = getNodeBinPath;
async function chmodPlusX(fsPath) {
    const s = await fs_extra_1.default.stat(fsPath);
    const newMode = s.mode | 64 | 8 | 1; // eslint-disable-line no-bitwise
    if (s.mode === newMode)
        return;
    const base8 = newMode.toString(8).slice(-3);
    await fs_extra_1.default.chmod(fsPath, base8);
}
async function runShellScript(fsPath, args = [], spawnOpts) {
    assert_1.default(path_1.default.isAbsolute(fsPath));
    const destPath = path_1.default.dirname(fsPath);
    await chmodPlusX(fsPath);
    const command = `./${path_1.default.basename(fsPath)}`;
    await spawnAsync(command, args, {
        ...spawnOpts,
        cwd: destPath,
        prettyCommand: command,
    });
    return true;
}
exports.runShellScript = runShellScript;
function getSpawnOptions(meta, nodeVersion) {
    const opts = {
        env: { ...process.env },
    };
    if (!meta.isDev) {
        let found = false;
        const oldPath = opts.env.PATH || process.env.PATH || '';
        const pathSegments = oldPath.split(path_1.default.delimiter).map(segment => {
            if (/^\/node[0-9]+\/bin/.test(segment)) {
                found = true;
                return `/node${nodeVersion.major}/bin`;
            }
            return segment;
        });
        if (!found) {
            // If we didn't find & replace, prepend at beginning of PATH
            pathSegments.unshift(`/node${nodeVersion.major}/bin`);
        }
        opts.env.PATH = pathSegments.filter(Boolean).join(path_1.default.delimiter);
    }
    return opts;
}
exports.getSpawnOptions = getSpawnOptions;
async function getNodeVersion(destPath, _nodeVersion, config = {}, meta = {}) {
    const latest = node_version_1.getLatestNodeVersion();
    if (meta && meta.isDev) {
        // Use the system-installed version of `node` in PATH for `vercel dev`
        return { ...latest, runtime: 'nodejs' };
    }
    const { packageJson } = await scanParentDirs(destPath, true);
    let { nodeVersion } = config;
    let isAuto = true;
    if (packageJson && packageJson.engines && packageJson.engines.node) {
        const { node } = packageJson.engines;
        if (nodeVersion &&
            semver_1.validRange(node) &&
            !semver_1.intersects(nodeVersion, node) &&
            !meta.isDev) {
            console.warn(`Warning: Due to "engines": { "node": "${node}" } in your \`package.json\` file, the Node.js Version defined in your Project Settings ("${nodeVersion}") will not apply. Learn More: http://vercel.link/node-version`);
        }
        else if (semver_1.coerce(node)?.raw === node && !meta.isDev) {
            console.warn(`Warning: Detected "engines": { "node": "${node}" } in your \`package.json\` with major.minor.patch, but only major Node.js Version can be selected. Learn More: http://vercel.link/node-version`);
        }
        else if (semver_1.validRange(node) &&
            semver_1.intersects(`${latest.major + 1}.x`, node) &&
            !meta.isDev) {
            console.warn(`Warning: Detected "engines": { "node": "${node}" } in your \`package.json\` that will automatically upgrade when a new major Node.js Version is released. Learn More: http://vercel.link/node-version`);
        }
        nodeVersion = node;
        isAuto = false;
    }
    return node_version_1.getSupportedNodeVersion(nodeVersion, isAuto);
}
exports.getNodeVersion = getNodeVersion;
async function scanParentDirs(destPath, readPackageJson = false) {
    assert_1.default(path_1.default.isAbsolute(destPath));
    const pkgJsonPath = await walkParentDirs({
        base: '/',
        start: destPath,
        filename: 'package.json',
    });
    const packageJson = readPackageJson && pkgJsonPath
        ? JSON.parse(await fs_extra_1.default.readFile(pkgJsonPath, 'utf8'))
        : undefined;
    const [yarnLockPath, npmLockPath, pnpmLockPath] = await walkParentDirsMulti({
        base: '/',
        start: destPath,
        filenames: ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml'],
    });
    let lockfileVersion;
    let cliType = 'yarn';
    const [hasYarnLock, packageLockJson, pnpmLockYaml] = await Promise.all([
        Boolean(yarnLockPath),
        npmLockPath
            ? read_config_file_1.readConfigFile(npmLockPath)
            : null,
        pnpmLockPath
            ? read_config_file_1.readConfigFile(pnpmLockPath)
            : null,
    ]);
    // Priority order is Yarn > pnpm > npm
    if (hasYarnLock) {
        cliType = 'yarn';
    }
    else if (pnpmLockYaml) {
        cliType = 'pnpm';
        // just ensure that it is read as a number and not a string
        lockfileVersion = Number(pnpmLockYaml.lockfileVersion);
    }
    else if (packageLockJson) {
        cliType = 'npm';
        lockfileVersion = packageLockJson.lockfileVersion;
    }
    const packageJsonPath = pkgJsonPath || undefined;
    return { cliType, packageJson, lockfileVersion, packageJsonPath };
}
exports.scanParentDirs = scanParentDirs;
async function walkParentDirs({ base, start, filename, }) {
    assert_1.default(path_1.default.isAbsolute(base), 'Expected "base" to be absolute path');
    assert_1.default(path_1.default.isAbsolute(start), 'Expected "start" to be absolute path');
    let parent = '';
    for (let current = start; base.length <= current.length; current = parent) {
        const fullPath = path_1.default.join(current, filename);
        // eslint-disable-next-line no-await-in-loop
        if (await fs_extra_1.default.pathExists(fullPath)) {
            return fullPath;
        }
        parent = path_1.default.dirname(current);
        if (parent === current) {
            // Reached root directory of the filesystem
            break;
        }
    }
    return null;
}
exports.walkParentDirs = walkParentDirs;
async function walkParentDirsMulti({ base, start, filenames, }) {
    let parent = '';
    for (let current = start; base.length <= current.length; current = parent) {
        const fullPaths = filenames.map(f => path_1.default.join(current, f));
        const existResults = await Promise.all(fullPaths.map(f => fs_extra_1.default.pathExists(f)));
        const foundOneOrMore = existResults.some(b => b);
        if (foundOneOrMore) {
            return fullPaths.map((f, i) => (existResults[i] ? f : undefined));
        }
        parent = path_1.default.dirname(current);
        if (parent === current) {
            // Reached root directory of the filesystem
            break;
        }
    }
    return [];
}
function isSet(v) {
    return v?.constructor?.name === 'Set';
}
async function runNpmInstall(destPath, args = [], spawnOpts, meta, nodeVersion) {
    if (meta?.isDev) {
        debug_1.default('Skipping dependency installation because dev mode is enabled');
        return false;
    }
    assert_1.default(path_1.default.isAbsolute(destPath));
    try {
        await runNpmInstallSema.acquire();
        const { cliType, packageJsonPath, lockfileVersion } = await scanParentDirs(destPath);
        // Only allow `runNpmInstall()` to run once per `package.json`
        // when doing a default install (no additional args)
        if (meta && packageJsonPath && args.length === 0) {
            if (!isSet(meta.runNpmInstallSet)) {
                meta.runNpmInstallSet = new Set();
            }
            if (isSet(meta.runNpmInstallSet)) {
                if (meta.runNpmInstallSet.has(packageJsonPath)) {
                    return false;
                }
                else {
                    meta.runNpmInstallSet.add(packageJsonPath);
                }
            }
        }
        const installTime = Date.now();
        console.log('Installing dependencies...');
        debug_1.default(`Installing to ${destPath}`);
        const opts = { cwd: destPath, ...spawnOpts };
        const env = opts.env ? { ...opts.env } : { ...process.env };
        delete env.NODE_ENV;
        opts.env = getEnvForPackageManager({
            cliType,
            lockfileVersion,
            nodeVersion,
            env,
        });
        let commandArgs;
        if (cliType === 'npm') {
            opts.prettyCommand = 'npm install';
            commandArgs = args
                .filter(a => a !== '--prefer-offline')
                .concat(['install', '--no-audit', '--unsafe-perm']);
        }
        else if (cliType === 'pnpm') {
            // PNPM's install command is similar to NPM's but without the audit nonsense
            // @see options https://pnpm.io/cli/install
            opts.prettyCommand = 'pnpm install';
            commandArgs = args
                .filter(a => a !== '--prefer-offline')
                .concat(['install', '--unsafe-perm']);
        }
        else {
            opts.prettyCommand = 'yarn install';
            commandArgs = ['install', ...args];
        }
        if (process.env.NPM_ONLY_PRODUCTION) {
            commandArgs.push('--production');
        }
        await spawnAsync(cliType, commandArgs, opts);
        debug_1.default(`Install complete [${Date.now() - installTime}ms]`);
        return true;
    }
    finally {
        runNpmInstallSema.release();
    }
}
exports.runNpmInstall = runNpmInstall;
function getEnvForPackageManager({ cliType, lockfileVersion, nodeVersion, env, }) {
    const newEnv = { ...env };
    const oldPath = env.PATH + '';
    const npm7 = '/node16/bin-npm7';
    const pnpm7 = '/pnpm7/node_modules/.bin';
    const corepackEnabled = env.ENABLE_EXPERIMENTAL_COREPACK === '1';
    if (cliType === 'npm') {
        if (typeof lockfileVersion === 'number' &&
            lockfileVersion >= 2 &&
            (nodeVersion?.major || 0) < 16 &&
            !oldPath.includes(npm7) &&
            !corepackEnabled) {
            // Ensure that npm 7 is at the beginning of the `$PATH`
            newEnv.PATH = `${npm7}${path_1.default.delimiter}${oldPath}`;
            console.log('Detected `package-lock.json` generated by npm 7+...');
        }
    }
    else if (cliType === 'pnpm') {
        if (typeof lockfileVersion === 'number' &&
            lockfileVersion === 5.4 &&
            !oldPath.includes(pnpm7) &&
            !corepackEnabled) {
            // Ensure that pnpm 7 is at the beginning of the `$PATH`
            newEnv.PATH = `${pnpm7}${path_1.default.delimiter}${oldPath}`;
            console.log('Detected `pnpm-lock.yaml` generated by pnpm 7...');
        }
    }
    else {
        // Yarn v2 PnP mode may be activated, so force "node-modules" linker style
        if (!env.YARN_NODE_LINKER) {
            newEnv.YARN_NODE_LINKER = 'node-modules';
        }
    }
    return newEnv;
}
exports.getEnvForPackageManager = getEnvForPackageManager;
async function runCustomInstallCommand({ destPath, installCommand, nodeVersion, spawnOpts, }) {
    console.log(`Running "install" command: \`${installCommand}\`...`);
    const { cliType, lockfileVersion } = await scanParentDirs(destPath);
    const env = getEnvForPackageManager({
        cliType,
        lockfileVersion,
        nodeVersion,
        env: spawnOpts?.env || {},
    });
    debug_1.default(`Running with $PATH:`, env?.PATH || '');
    await execCommand(installCommand, {
        ...spawnOpts,
        env,
        cwd: destPath,
    });
}
exports.runCustomInstallCommand = runCustomInstallCommand;
async function runPackageJsonScript(destPath, scriptNames, spawnOpts) {
    assert_1.default(path_1.default.isAbsolute(destPath));
    const { packageJson, cliType, lockfileVersion } = await scanParentDirs(destPath, true);
    const scriptName = getScriptName(packageJson, typeof scriptNames === 'string' ? [scriptNames] : scriptNames);
    if (!scriptName)
        return false;
    debug_1.default('Running user script...');
    const runScriptTime = Date.now();
    const opts = {
        cwd: destPath,
        ...spawnOpts,
        env: getEnvForPackageManager({
            cliType,
            lockfileVersion,
            nodeVersion: undefined,
            env: {
                ...process.env,
                ...spawnOpts?.env,
            },
        }),
    };
    if (cliType === 'npm') {
        opts.prettyCommand = `npm run ${scriptName}`;
    }
    else if (cliType === 'pnpm') {
        opts.prettyCommand = `pnpm run ${scriptName}`;
    }
    else {
        opts.prettyCommand = `yarn run ${scriptName}`;
    }
    console.log(`Running "${opts.prettyCommand}"`);
    await spawnAsync(cliType, ['run', scriptName], opts);
    debug_1.default(`Script complete [${Date.now() - runScriptTime}ms]`);
    return true;
}
exports.runPackageJsonScript = runPackageJsonScript;
async function runBundleInstall(destPath, args = [], spawnOpts, meta) {
    if (meta && meta.isDev) {
        debug_1.default('Skipping dependency installation because dev mode is enabled');
        return;
    }
    assert_1.default(path_1.default.isAbsolute(destPath));
    const opts = { ...spawnOpts, cwd: destPath, prettyCommand: 'bundle install' };
    await spawnAsync('bundle', args.concat(['install']), opts);
}
exports.runBundleInstall = runBundleInstall;
async function runPipInstall(destPath, args = [], spawnOpts, meta) {
    if (meta && meta.isDev) {
        debug_1.default('Skipping dependency installation because dev mode is enabled');
        return;
    }
    assert_1.default(path_1.default.isAbsolute(destPath));
    const opts = { ...spawnOpts, cwd: destPath, prettyCommand: 'pip3 install' };
    await spawnAsync('pip3', ['install', '--disable-pip-version-check', ...args], opts);
}
exports.runPipInstall = runPipInstall;
function getScriptName(pkg, possibleNames) {
    if (pkg?.scripts) {
        for (const name of possibleNames) {
            if (name in pkg.scripts) {
                return name;
            }
        }
    }
    return null;
}
exports.getScriptName = getScriptName;
/**
 * @deprecate installDependencies() is deprecated.
 * Please use runNpmInstall() instead.
 */
exports.installDependencies = util_1.deprecate(runNpmInstall, 'installDependencies() is deprecated. Please use runNpmInstall() instead.');
