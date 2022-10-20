const chalk = require('chalk')
const _ = require('lodash')
const security = require('./security/index')
const naming = require('./naming/index')
const order = require('./order/index')
const align = require('./align/index')
const bestPractises = require('./best-practises/index')
const deprecations = require('./deprecations/index')
const miscellaneous = require('./miscellaneous/index')
const configObject = require('./../config')
const { validSeverityMap } = require('../config/config-validator')

module.exports = function checkers(reporter, configVals, inputSrc, fileName) {
  const config = configObject.from(configVals)
  const { rules = {} } = config
  const meta = {
    reporter,
    config,
    inputSrc,
    fileName
  }
  const plugins = config.plugins || []

  const allRules = [...coreRules(meta), ...pluginsRules(plugins, meta)]

  const enabledRules = allRules.filter(coreRule => ruleEnabled(coreRule, rules))

  // show warnings for deprecated rules
  for (const rule of enabledRules) {
    if (rule.meta && rule.meta.deprecated) {
      console.warn(chalk.yellow(`[solhint] Warning: rule '${rule.ruleId}' is deprecated.`))
    }
  }

  return enabledRules
}

function coreRules(meta) {
  const { reporter, config, inputSrc, fileName } = meta

  return [
    ...align(reporter, config),
    ...bestPractises(reporter, config),
    ...deprecations(reporter, config),
    ...miscellaneous(reporter, config, inputSrc, fileName),
    ...naming(reporter, config),
    ...order(reporter, config),
    ...security(reporter, config)
  ]
}

function loadPlugin(pluginName, { reporter, config, inputSrc, fileName }) {
  const plugins = require(`solhint-plugin-${pluginName}`)

  return plugins.map(Plugin => new Plugin(reporter, config, inputSrc, fileName)).map(plugin => {
    plugin.ruleId = `${pluginName}/${plugin.ruleId}`
    return plugin
  })
}

function pluginsRules(configPlugins, meta) {
  const plugins = Array.isArray(configPlugins) ? configPlugins : [configPlugins]

  return _(plugins)
    .map(name => loadPlugin(name, meta))
    .flatten()
    .value()
}

function ruleEnabled(coreRule, rules) {
  let ruleValue
  if (rules && !Array.isArray(rules[coreRule.ruleId])) {
    ruleValue = rules[coreRule.ruleId]
  } else if (rules && Array.isArray(rules[coreRule.ruleId])) {
    ruleValue = rules[coreRule.ruleId][0]
  }

  if (
    rules &&
    rules[coreRule.ruleId] !== undefined &&
    ruleValue &&
    validSeverityMap.includes(ruleValue)
  ) {
    return coreRule
  }
}
