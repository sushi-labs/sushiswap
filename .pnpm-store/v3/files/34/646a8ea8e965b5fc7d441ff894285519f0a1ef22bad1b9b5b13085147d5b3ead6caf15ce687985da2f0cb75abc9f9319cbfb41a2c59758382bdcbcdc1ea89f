"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const chokidar_1 = __importDefault(require("chokidar"));
require("./type-extensions");
config_1.extendConfig((config, userConfig) => {
    var _a;
    let w = (_a = userConfig.watcher) !== null && _a !== void 0 ? _a : {};
    const normalizedWatcher = {};
    Object.entries(w).forEach(([name, task]) => {
        var _a, _b, _c, _d;
        normalizedWatcher[name] = {
            tasks: ((_a = task === null || task === void 0 ? void 0 : task.tasks) !== null && _a !== void 0 ? _a : []).map(t => {
                var _a;
                if (typeof t === 'string') {
                    return {
                        command: t,
                        params: {},
                    };
                }
                else {
                    return {
                        command: t.command,
                        params: (_a = t.params) !== null && _a !== void 0 ? _a : {},
                    };
                }
            }),
            files: (_b = task.files) !== null && _b !== void 0 ? _b : [config.paths.sources],
            ignoredFiles: (_c = task.ignoredFiles) !== null && _c !== void 0 ? _c : [],
            verbose: (_d = task.verbose) !== null && _d !== void 0 ? _d : false,
        };
    });
    config.watcher = normalizedWatcher;
});
config_1.task('watch', 'Start the file watcher')
    .addPositionalParam('watcherTask', 'watcher task to run (as defined in hardhat config)')
    .setAction(async ({ watcherTask }, { run, tasks, config: { watcher, paths } }) => {
    if (!(watcherTask in watcher)) {
        console.log(`Watcher task "${watcherTask}" was not found in hardhat config.`);
        process.exit(1);
    }
    const taskConfig = watcher[watcherTask];
    const logVerbose = (...messages) => {
        if (taskConfig.verbose)
            console.log(...messages);
    };
    logVerbose('Starting file watcher', taskConfig.files);
    const templateReplace = (value, pattern, replace) => {
        if (Array.isArray(value)) {
            return value.map(v => v.replace(pattern, replace));
        }
        else if (typeof value === 'string') {
            return value.replace(pattern, replace);
        }
        else {
            return value;
        }
    };
    const paramsTemplateReplace = (params, pattern, replace) => {
        const newParams = {};
        Object.keys(params).forEach(k => {
            newParams[k] = templateReplace(params[k], pattern, replace);
        });
        return newParams;
    };
    // Validate tasks
    taskConfig.tasks.forEach(task => {
        if (!(task.command in tasks)) {
            console.log(`Watcher error: task "${task.command}" is not supported by hardhat runtime.`);
            console.log(`Found tasks: ${JSON.stringify(Object.keys(tasks))}`);
            process.exit(1);
        }
    });
    chokidar_1.default
        .watch(taskConfig.files, {
        ignored: taskConfig.ignoredFiles,
        ignoreInitial: true,
        usePolling: true,
        interval: 250,
    })
        .on('change', async (path) => {
        for (let i = 0; i < taskConfig.tasks.length; i++) {
            const task = taskConfig.tasks[i];
            // Replace template pattern with the changed file
            const newParams = paramsTemplateReplace(task.params, '{path}', path);
            logVerbose(`Running task "${task.command}" with params ${JSON.stringify(newParams)}`);
            try {
                await run(task.command, newParams);
                // This hack is required to allow running Mocha commands. Check out https://github.com/mochajs/mocha/issues/1938 for more details.
                Object.keys(require.cache).forEach(function (key) {
                    if (key.startsWith(paths.tests)) {
                        delete require.cache[key];
                    }
                });
            }
            catch (err) {
                console.log(`Task "${task.command}" failed.`);
                console.log(err);
            }
        }
    })
        .on('error', (error) => {
        console.log(`Watcher error: ${error}`);
        process.exit(1);
    });
    console.log('File watcher started.');
    await new Promise(resolve => setTimeout(resolve, 2000000000));
});
//# sourceMappingURL=index.js.map