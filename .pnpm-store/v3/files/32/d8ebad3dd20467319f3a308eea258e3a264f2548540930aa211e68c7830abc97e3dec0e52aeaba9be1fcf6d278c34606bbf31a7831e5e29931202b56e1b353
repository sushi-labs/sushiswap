const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const cosmiconfig = require('cosmiconfig')
const { ConfigMissingError } = require('../common/errors')
const packageJson = require('../../package.json')

const getSolhintCoreConfigPath = name => {
  if (name === 'solhint:recommended') {
    return path.resolve(__dirname, '../../conf/rulesets/solhint-recommended.js')
  }

  if (name === 'solhint:all') {
    return path.resolve(__dirname, '../../conf/rulesets/solhint-all.js')
  }

  if (name === 'solhint:default') {
    return path.resolve(__dirname, '../../conf/rulesets/solhint-default.js')
  }

  throw new ConfigMissingError(name)
}

const createEmptyConfig = () => ({
  excludedFiles: {},
  extends: {},
  globals: {},
  env: {},
  rules: {},
  parserOptions: {}
})

const loadConfig = configFile => {
  if (configFile && !fs.existsSync(configFile)) {
    throw new Error(`The config file passed as a parameter does not exist`)
  }

  // Use cosmiconfig to get the config from different sources
  const appDirectory = fs.realpathSync(process.cwd())
  const moduleName = packageJson.name
  const cosmiconfigOptions = {
    searchPlaces: [
      'package.json',
      `.${moduleName}.json`,
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yaml`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `${moduleName}.config.js`
    ]
  }

  const explorer = cosmiconfig(moduleName, cosmiconfigOptions)

  // if a specific path was specified, just load it and ignore default paths
  if (configFile) {
    return explorer.loadSync(configFile).config
  }

  const searchedFor = explorer.searchSync(appDirectory)
  if (!searchedFor) {
    throw new ConfigMissingError()
  }
  return searchedFor.config || createEmptyConfig()
}

const configGetter = path => {
  let extensionPath = null

  if (path.startsWith('solhint:')) {
    extensionPath = getSolhintCoreConfigPath(path)
  } else {
    // Load packages with rules
    extensionPath = `solhint-config-${path}`
  }

  const extensionConfig = require(extensionPath)

  return extensionConfig
}

const applyExtends = (config, getter = configGetter) => {
  if (!Array.isArray(config.extends)) {
    config.extends = [config.extends]
  }

  return config.extends.reduceRight((previousValue, parentPath) => {
    try {
      const extensionConfig = getter(parentPath)
      return _.merge({}, extensionConfig, previousValue)
    } catch (e) {
      throw new ConfigMissingError(parentPath)
    }
  }, config)
}

module.exports = {
  applyExtends,
  configGetter,
  loadConfig
}
