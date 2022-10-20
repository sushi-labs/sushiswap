import { extendConfig, task } from 'hardhat/config'
import { HardhatConfig, HardhatUserConfig, WatcherConfig } from 'hardhat/types'
import chokidar from 'chokidar'

import './type-extensions'

extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  let w = userConfig.watcher ?? {}

  const normalizedWatcher: WatcherConfig = {}

  Object.entries(w).forEach(([name, task]) => {
    normalizedWatcher[name] = {
      tasks: (task?.tasks ?? []).map(t => {
        if (typeof t === 'string') {
          return {
            command: t,
            params: {},
          }
        } else {
          return {
            command: t.command,
            params: t.params ?? {},
          }
        }
      }),
      files: task.files ?? [config.paths.sources],
      ignoredFiles: task.ignoredFiles ?? [],
      verbose: task.verbose ?? false,
    }
  })

  config.watcher = normalizedWatcher
})

task('watch', 'Start the file watcher')
  .addPositionalParam('watcherTask', 'watcher task to run (as defined in hardhat config)')
  .setAction(async ({ watcherTask }, { run, tasks, config: { watcher, paths } }) => {
    if (!(watcherTask in watcher)) {
      console.log(`Watcher task "${watcherTask}" was not found in hardhat config.`)
      process.exit(1)
    }

    const taskConfig = watcher[watcherTask]

    const logVerbose = (...messages: any) => {
      if (taskConfig.verbose) console.log(...messages)
    }

    logVerbose('Starting file watcher', taskConfig.files)

    const templateReplace = (value: any, pattern: string, replace: string) => {
      if (Array.isArray(value)) {
        return value.map(v => v.replace(pattern, replace))
      } else if (typeof value === 'string') {
        return value.replace(pattern, replace)
      } else {
        return value
      }
    }

    const paramsTemplateReplace = (params: any, pattern: string, replace: string) => {
      const newParams: any = {}
      Object.keys(params).forEach(k => {
        newParams[k] = templateReplace(params[k], pattern, replace)
      })
      return newParams
    }

    // Validate tasks
    taskConfig.tasks.forEach(task => {
      if (!(task.command in tasks)) {
        console.log(`Watcher error: task "${task.command}" is not supported by hardhat runtime.`)
        console.log(`Found tasks: ${JSON.stringify(Object.keys(tasks))}`)
        process.exit(1)
      }
    })

    chokidar
      .watch(taskConfig.files, {
        ignored: taskConfig.ignoredFiles,
        ignoreInitial: true,
        usePolling: true,
        interval: 250,
      })
      .on('change', async path => {
        for (let i = 0; i < taskConfig.tasks.length; i++) {
          const task = taskConfig.tasks[i]

          // Replace template pattern with the changed file
          const newParams = paramsTemplateReplace(task.params, '{path}', path)

          logVerbose(`Running task "${task.command}" with params ${JSON.stringify(newParams)}`)
          try {
            await run(task.command, newParams)
            // This hack is required to allow running Mocha commands. Check out https://github.com/mochajs/mocha/issues/1938 for more details.
            Object.keys(require.cache).forEach(function (key) {
              if (key.startsWith(paths.tests)) {
                delete require.cache[key]
              }
            })
          } catch (err) {
            console.log(`Task "${task.command}" failed.`)
            console.log(err)
          }
        }
      })
      .on('error', (error: Error) => {
        console.log(`Watcher error: ${error}`)
        process.exit(1)
      })

    console.log('File watcher started.')

    await new Promise(resolve => setTimeout(resolve, 2000000000))
  })
