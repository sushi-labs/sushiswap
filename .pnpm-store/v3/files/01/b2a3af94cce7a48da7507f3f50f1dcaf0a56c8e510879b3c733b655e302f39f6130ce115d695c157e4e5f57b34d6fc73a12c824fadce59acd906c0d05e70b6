'use strict'

const varint = require('varint')
const { toString: uint8ArrayToString } = require('uint8arrays/to-string')
const { fromString: uint8ArrayFromString } = require('uint8arrays/from-string')

module.exports = {
  numberToUint8Array,
  uint8ArrayToNumber,
  varintUint8ArrayEncode,
  varintEncode
}

/**
 * @param {Uint8Array} buf
 */
function uint8ArrayToNumber (buf) {
  return parseInt(uint8ArrayToString(buf, 'base16'), 16)
}

/**
 * @param {number} num
 */
function numberToUint8Array (num) {
  let hexString = num.toString(16)
  if (hexString.length % 2 === 1) {
    hexString = '0' + hexString
  }
  return uint8ArrayFromString(hexString, 'base16')
}

/**
 * @param {Uint8Array} input
 */
function varintUint8ArrayEncode (input) {
  return Uint8Array.from(varint.encode(uint8ArrayToNumber(input)))
}

/**
 * @param {number} num
 */
function varintEncode (num) {
  return Uint8Array.from(varint.encode(num))
}
