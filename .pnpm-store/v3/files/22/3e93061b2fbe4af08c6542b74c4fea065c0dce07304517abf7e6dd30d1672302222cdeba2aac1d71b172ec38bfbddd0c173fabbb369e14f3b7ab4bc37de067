import varint from '../vendor/varint.js'

/**
 * @param {Uint8Array} data
 * @returns {[number, number]}
 */
export const decode = (data) => {
  const code = varint.decode(data)
  return [code, varint.decode.bytes]
}

/**
 * @param {number} int
 * @param {Uint8Array} target
 * @param {number} [offset=0]
 */
export const encodeTo = (int, target, offset = 0) => {
  varint.encode(int, target, offset)
  return target
}

/**
 * @param {number} int
 * @returns {number}
 */
export const encodingLength = (int) => {
  return varint.encodingLength(int)
}
