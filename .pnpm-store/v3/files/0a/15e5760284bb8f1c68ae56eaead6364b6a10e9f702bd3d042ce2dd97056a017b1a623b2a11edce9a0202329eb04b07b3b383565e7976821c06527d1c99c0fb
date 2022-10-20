'use strict'

/** @typedef {import('./generated-types').ConstantCodeMap} ConstantCodeMap */
/** @typedef {import('./generated-types').NameUint8ArrayMap} NameUint8ArrayMap */
/** @typedef {import('./generated-types').CodeNameMap} CodeNameMap */
/** @typedef {import('./generated-types').CodecName} CodecName */
/** @typedef {import('./generated-types').CodecConstant} CodecConstant */

const { baseTable } = require('./generated-table')
const varintEncode = require('./util').varintEncode

const nameToVarint = /** @type {NameUint8ArrayMap} */ ({})
const constantToCode = /** @type {ConstantCodeMap} */({})
const codeToName = /** @type {CodeNameMap} */({})

// eslint-disable-next-line guard-for-in
for (const name in baseTable) {
  const codecName = /** @type {CodecName} */(name)
  const code = baseTable[codecName]
  nameToVarint[codecName] = varintEncode(code)

  const constant = /** @type {CodecConstant} */(codecName.toUpperCase().replace(/-/g, '_'))
  constantToCode[constant] = code

  if (!codeToName[code]) {
    codeToName[code] = codecName
  }
}

Object.freeze(nameToVarint)
Object.freeze(constantToCode)
Object.freeze(codeToName)
const nameToCode = Object.freeze(baseTable)
module.exports = {
  nameToVarint,
  constantToCode,
  nameToCode,
  codeToName
}
