/**
 * @typedef {Object} StringifyOptions
 * @property {boolean} [padLeft=true] Whether to pad a space before a token (`boolean`, default: `true`).
 * @property {boolean} [padRight=false] Whether to pad a space after a token (`boolean`, default: `false`).
 */
/**
 * Parse comma separated tokens to an array.
 *
 * @param {string} value
 * @returns {Array.<string>}
 */
export function parse(value: string): Array<string>
/**
 * Serialize an array of strings to comma separated tokens.
 *
 * @param {Array.<string|number>} values
 * @param {StringifyOptions} [options]
 * @returns {string}
 */
export function stringify(
  values: Array<string | number>,
  options?: StringifyOptions
): string
export type StringifyOptions = {
  /**
   * Whether to pad a space before a token (`boolean`, default: `true`).
   */
  padLeft?: boolean
  /**
   * Whether to pad a space after a token (`boolean`, default: `false`).
   */
  padRight?: boolean
}
