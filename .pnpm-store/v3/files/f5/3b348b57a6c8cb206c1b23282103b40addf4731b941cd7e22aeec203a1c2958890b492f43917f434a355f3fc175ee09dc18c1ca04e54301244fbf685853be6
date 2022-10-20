const { loadRules } = require('../../lib/load-rules')

const rulesConstants = loadRules()
const enabledRules = {}

rulesConstants.forEach(rule => {
  if (!rule.meta.deprecated && rule.meta.recommended) {
    enabledRules[rule.ruleId] = rule.meta.defaultSetup
  }
})

module.exports = { rules: enabledRules }
