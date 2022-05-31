import Environment from 'jest-environment-jsdom'

/**
 * A custom environment to set the TextDecoder that is required by contenthashToUri.ts.
 */
module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup()
    if (typeof this.global.TextDecoder === 'undefined') {
      const { TextDecoder } = require('util')
      this.global.TextDecoder = TextDecoder
    }
  }
}
