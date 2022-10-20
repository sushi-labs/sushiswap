/**
 * Implementation of the multicodec specification.
 *
 * @module multicodec
 * @example
 * const multicodec = require('multicodec')
 *
 * const prefixedProtobuf = multicodec.addPrefix('protobuf', protobufBuffer)
 * // prefixedProtobuf 0x50...
 *
 */
'use strict'

/** @typedef {import('./generated-types').CodecName} CodecName */
/** @typedef {import('./generated-types').CodecCode} CodecCode */

const varint = require('varint')
const { concat: uint8ArrayConcat } = require('uint8arrays/concat')
const util = require('./util')
const { nameToVarint, constantToCode, nameToCode, codeToName } = require('./maps')

/**
 * Prefix a buffer with a multicodec-packed.
 *
 * @param {CodecName|Uint8Array} multicodecStrOrCode
 * @param {Uint8Array} data
 * @returns {Uint8Array}
 */
function addPrefix (multicodecStrOrCode, data) {
  let prefix

  if (multicodecStrOrCode instanceof Uint8Array) {
    prefix = util.varintUint8ArrayEncode(multicodecStrOrCode)
  } else {
    if (nameToVarint[multicodecStrOrCode]) {
      prefix = nameToVarint[multicodecStrOrCode]
    } else {
      throw new Error('multicodec not recognized')
    }
  }

  return uint8ArrayConcat([prefix, data], prefix.length + data.length)
}

/**
 * Decapsulate the multicodec-packed prefix from the data.
 *
 * @param {Uint8Array} data
 * @returns {Uint8Array}
 */
function rmPrefix (data) {
  varint.decode(/** @type {Buffer} */(data))
  return data.slice(varint.decode.bytes)
}

/**
 * Get the codec name of the prefixed data.
 *
 * @param {Uint8Array} prefixedData
 * @returns {CodecName}
 */
function getNameFromData (prefixedData) {
  const code = /** @type {CodecCode} */(varint.decode(/** @type {Buffer} */(prefixedData)))
  const name = codeToName[code]
  if (name === undefined) {
    throw new Error(`Code "${code}" not found`)
  }
  return name
}

/**
 * Get the codec name from a code.
 *
 * @param {CodecCode} codec
 * @returns {CodecName}
 */
function getNameFromCode (codec) {
  return codeToName[codec]
}

/**
 * Get the code of the codec
 *
 * @param {CodecName} name
 * @returns {CodecCode}
 */
function getCodeFromName (name) {
  const code = nameToCode[name]
  if (code === undefined) {
    throw new Error(`Codec "${name}" not found`)
  }
  return code
}

/**
 * Get the code of the prefixed data.
 *
 * @param {Uint8Array} prefixedData
 * @returns {CodecCode}
 */
function getCodeFromData (prefixedData) {
  return /** @type {CodecCode} */(varint.decode(/** @type {Buffer} */(prefixedData)))
}

/**
 * Get the code as varint of a codec name.
 *
 * @param {CodecName} name
 * @returns {Uint8Array}
 */
function getVarintFromName (name) {
  const code = nameToVarint[name]
  if (code === undefined) {
    throw new Error(`Codec "${name}" not found`)
  }
  return code
}

/**
 * Get the varint of a code.
 *
 * @param {CodecCode} code
 * @returns {Uint8Array}
 */
function getVarintFromCode (code) {
  return util.varintEncode(code)
}

/**
 * Get the codec name of the prefixed data.
 *
 * @deprecated use getNameFromData instead.
 * @param {Uint8Array} prefixedData
 * @returns {CodecName}
 */
function getCodec (prefixedData) {
  return getNameFromData(prefixedData)
}

/**
 * Get the codec name from a code.
 *
 * @deprecated use getNameFromCode instead.
 * @param {CodecCode} codec
 * @returns {CodecName}
 */
function getName (codec) {
  return getNameFromCode(codec)
}

/**
 * Get the code of the codec
 *
 * @deprecated use getCodeFromName instead.
 * @param {CodecName} name
 * @returns {CodecCode}
 */
function getNumber (name) {
  return getCodeFromName(name)
}

/**
 * Get the code of the prefixed data.
 *
 * @deprecated use getCodeFromData instead.
 * @param {Uint8Array} prefixedData
 * @returns {CodecCode}
 */
function getCode (prefixedData) {
  return getCodeFromData(prefixedData)
}

/**
 * Get the code as varint of a codec name.
 *
 * @deprecated use getVarintFromName instead.
 * @param {CodecName} name
 * @returns {Uint8Array}
 */
function getCodeVarint (name) {
  return getVarintFromName(name)
}

/**
 * Get the varint of a code.
 *
 * @deprecated use getVarintFromCode instead.
 * @param {CodecCode} code
 * @returns {Array.<number>}
 */
function getVarint (code) {
  return Array.from(getVarintFromCode(code))
}

module.exports = {
  addPrefix,
  rmPrefix,
  getNameFromData,
  getNameFromCode,
  getCodeFromName,
  getCodeFromData,
  getVarintFromName,
  getVarintFromCode,
  // Deprecated
  getCodec,
  getName,
  getNumber,
  getCode,
  getCodeVarint,
  getVarint,
  // Make the constants top-level constants
  ...constantToCode,
  // Export the maps
  nameToVarint,
  nameToCode,
  codeToName
}
