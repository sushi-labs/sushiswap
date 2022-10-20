const _ = require('lodash')

module.exports = {
  from(configVals) {
    return _.assign(configVals, this)
  },

  getNumberByPath(path, defaultValue) {
    const configVal = _.get(this, path)
    return _.isNumber(configVal) && configVal > 0 ? configVal : defaultValue
  },

  getStringByPath(path, defaultValue) {
    const configVal = _.get(this, path)
    return _.isString(configVal) ? configVal : defaultValue
  },

  getNumber(ruleName, defaultValue) {
    return this.getNumberByPath(`rules["${ruleName}"][1]`, defaultValue)
  },

  getObjectPropertyNumber(ruleName, ruleProperty, defaultValue) {
    return this.getNumberByPath(`rules["${ruleName}"][1][${ruleProperty}]`, defaultValue)
  },

  getString(ruleName, defaultValue) {
    return this.getStringByPath(`rules["${ruleName}"][1]`, defaultValue)
  }
}
