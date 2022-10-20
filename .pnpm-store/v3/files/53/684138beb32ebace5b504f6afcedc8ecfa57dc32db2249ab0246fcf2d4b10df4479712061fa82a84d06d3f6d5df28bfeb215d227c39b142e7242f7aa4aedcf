'use strict'

const mh = require('multihashes')
const multibase = require('multibase')
const multicodec = require('multicodec')
const CIDUtil = require('./cid-util')
const { concat: uint8ArrayConcat } = require('uint8arrays/concat')
const { toString: uint8ArrayToString } = require('uint8arrays/to-string')
const { equals: uint8ArrayEquals } = require('uint8arrays/equals')

const codecs = multicodec.nameToCode
const codecInts = /** @type {CodecName[]} */(Object.keys(codecs)).reduce((p, name) => {
  p[codecs[name]] = name
  return p
}, /** @type {Record<CodecCode, CodecName>} */({}))

const symbol = Symbol.for('@ipld/js-cid/CID')

/**
 * @typedef {Object} SerializedCID
 * @property {string} codec
 * @property {number} version
 * @property {Uint8Array} hash
 */
/**
 * @typedef {0|1} CIDVersion
 * @typedef {import('multibase').BaseNameOrCode} BaseNameOrCode
 * @typedef {import('multicodec').CodecName} CodecName
 * @typedef {import('multicodec').CodecCode} CodecCode
 */

/**
 * Class representing a CID `<mbase><version><mcodec><mhash>`
 * , as defined in [ipld/cid](https://github.com/multiformats/cid).
 *
 * @class CID
 */
class CID {
  /**
   * Create a new CID.
   *
   * The algorithm for argument input is roughly:
   * ```
   * if (cid)
   *   -> create a copy
   * else if (str)
   *   if (1st char is on multibase table) -> CID String
   *   else -> bs58 encoded multihash
   * else if (Uint8Array)
   *   if (1st byte is 0 or 1) -> CID
   *   else -> multihash
   * else if (Number)
   *   -> construct CID by parts
   * ```
   *
   * @param {CIDVersion | string | Uint8Array | CID} version
   * @param {string|number} [codec]
   * @param {Uint8Array} [multihash]
   * @param {string} [multibaseName]
   *
   * @example
   * new CID(<version>, <codec>, <multihash>, <multibaseName>)
   * new CID(<cidStr>)
   * new CID(<cid.bytes>)
   * new CID(<multihash>)
   * new CID(<bs58 encoded multihash>)
   * new CID(<cid>)
   */
  constructor (version, codec, multihash, multibaseName) {
    // We have below three blank field accessors only because
    // otherwise TS will not pick them up if done after assignemnts

    /**
     * The version of the CID.
     *
     * @type {CIDVersion}
     */
    // eslint-disable-next-line no-unused-expressions
    this.version

    /**
     * The codec of the CID.
     *
     * @deprecated
     * @type {CodecName}
     */
    // eslint-disable-next-line no-unused-expressions
    this.codec

    /**
     * The multihash of the CID.
     *
     * @type {Uint8Array}
     */
    // eslint-disable-next-line no-unused-expressions
    this.multihash

    Object.defineProperty(this, symbol, { value: true })
    if (CID.isCID(version)) {
      // version is an exising CID instance
      const cid = /** @type {CID} */(version)
      this.version = cid.version
      this.codec = cid.codec
      this.multihash = cid.multihash
      // Default guard for when a CID < 0.7 is passed with no multibaseName
      // @ts-ignore
      this.multibaseName = cid.multibaseName || (cid.version === 0 ? 'base58btc' : 'base32')
      return
    }

    if (typeof version === 'string') {
      // e.g. 'base32' or false
      const baseName = multibase.isEncoded(version)
      if (baseName) {
        // version is a CID String encoded with multibase, so v1
        const cid = multibase.decode(version)
        this.version = /** @type {CIDVersion} */(parseInt(cid[0].toString(), 16))
        this.codec = multicodec.getCodec(cid.slice(1))
        this.multihash = multicodec.rmPrefix(cid.slice(1))
        this.multibaseName = baseName
      } else {
        // version is a base58btc string multihash, so v0
        this.version = 0
        this.codec = 'dag-pb'
        this.multihash = mh.fromB58String(version)
        this.multibaseName = 'base58btc'
      }
      CID.validateCID(this)
      Object.defineProperty(this, 'string', { value: version })
      return
    }

    if (version instanceof Uint8Array) {
      const v = parseInt(version[0].toString(), 16)
      if (v === 1) {
        // version is a CID Uint8Array
        const cid = version
        this.version = v
        this.codec = multicodec.getCodec(cid.slice(1))
        this.multihash = multicodec.rmPrefix(cid.slice(1))
        this.multibaseName = 'base32'
      } else {
        // version is a raw multihash Uint8Array, so v0
        this.version = 0
        this.codec = 'dag-pb'
        this.multihash = version
        this.multibaseName = 'base58btc'
      }
      CID.validateCID(this)
      return
    }

    // otherwise, assemble the CID from the parameters

    this.version = version

    if (typeof codec === 'number') {
      // @ts-ignore
      codec = codecInts[codec]
    }

    this.codec = /** @type {CodecName} */ (codec)

    this.multihash = /** @type {Uint8Array} */ (multihash)

    /**
     * Multibase name as string.
     *
     * @deprecated
     * @type {string}
     */
    this.multibaseName = multibaseName || (version === 0 ? 'base58btc' : 'base32')

    CID.validateCID(this)
  }

  /**
   * The CID as a `Uint8Array`
   *
   * @returns {Uint8Array}
   *
   */
  get bytes () {
    // @ts-ignore
    let bytes = this._bytes

    if (!bytes) {
      if (this.version === 0) {
        bytes = this.multihash
      } else if (this.version === 1) {
        const codec = multicodec.getCodeVarint(this.codec)
        bytes = uint8ArrayConcat([
          [1], codec, this.multihash
        ], 1 + codec.byteLength + this.multihash.byteLength)
      } else {
        throw new Error('unsupported version')
      }

      // Cache this Uint8Array so it doesn't have to be recreated
      Object.defineProperty(this, '_bytes', { value: bytes })
    }

    return bytes
  }

  /**
   * The prefix of the CID.
   *
   * @returns {Uint8Array}
   */
  get prefix () {
    const codec = multicodec.getCodeVarint(this.codec)
    const multihash = mh.prefix(this.multihash)
    const prefix = uint8ArrayConcat([
      [this.version], codec, multihash
    ], 1 + codec.byteLength + multihash.byteLength)

    return prefix
  }

  /**
   * The codec of the CID in its number form.
   *
   * @returns {CodecCode}
   */
  get code () {
    return codecs[this.codec]
  }

  /**
   * Convert to a CID of version `0`.
   *
   * @returns {CID}
   */
  toV0 () {
    if (this.codec !== 'dag-pb') {
      throw new Error('Cannot convert a non dag-pb CID to CIDv0')
    }

    const { name, length } = mh.decode(this.multihash)

    if (name !== 'sha2-256') {
      throw new Error('Cannot convert non sha2-256 multihash CID to CIDv0')
    }

    if (length !== 32) {
      throw new Error('Cannot convert non 32 byte multihash CID to CIDv0')
    }

    return new CID(0, this.codec, this.multihash)
  }

  /**
   * Convert to a CID of version `1`.
   *
   * @returns {CID}
   */
  toV1 () {
    return new CID(1, this.codec, this.multihash, this.multibaseName)
  }

  /**
   * Encode the CID into a string.
   *
   * @param {BaseNameOrCode} [base=this.multibaseName] - Base encoding to use.
   * @returns {string}
   */
  toBaseEncodedString (base = this.multibaseName) {
    // @ts-ignore non enumerable cache property
    if (this.string && this.string.length !== 0 && base === this.multibaseName) {
      // @ts-ignore non enumerable cache property
      return this.string
    }
    let str
    if (this.version === 0) {
      if (base !== 'base58btc') {
        throw new Error('not supported with CIDv0, to support different bases, please migrate the instance do CIDv1, you can do that through cid.toV1()')
      }
      str = mh.toB58String(this.multihash)
    } else if (this.version === 1) {
      str = uint8ArrayToString(multibase.encode(base, this.bytes))
    } else {
      throw new Error('unsupported version')
    }
    if (base === this.multibaseName) {
      // cache the string value
      Object.defineProperty(this, 'string', { value: str })
    }
    return str
  }

  /**
   * CID(QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n)
   *
   * @returns {string}
   */
  [Symbol.for('nodejs.util.inspect.custom')] () {
    return 'CID(' + this.toString() + ')'
  }

  /**
   * Encode the CID into a string.
   *
   * @param {BaseNameOrCode} [base=this.multibaseName] - Base encoding to use.
   * @returns {string}
   */
  toString (base) {
    return this.toBaseEncodedString(base)
  }

  /**
   * Serialize to a plain object.
   *
   * @returns {SerializedCID}
   */
  toJSON () {
    return {
      codec: this.codec,
      version: this.version,
      hash: this.multihash
    }
  }

  /**
   * Compare equality with another CID.
   *
   * @param {CID} other
   * @returns {boolean}
   */
  equals (other) {
    return this.codec === other.codec &&
      this.version === other.version &&
      uint8ArrayEquals(this.multihash, other.multihash)
  }

  /**
   * Test if the given input is a valid CID object.
   * Throws if it is not.
   *
   * @param {any} other - The other CID.
   * @returns {void}
   */
  static validateCID (other) {
    const errorMsg = CIDUtil.checkCIDComponents(other)
    if (errorMsg) {
      throw new Error(errorMsg)
    }
  }

  /**
   * Check if object is a CID instance
   *
   * @param {any} value
   * @returns {value is CID}
   */
  static isCID (value) {
    return value instanceof CID || Boolean(value && value[symbol])
  }
}

CID.codecs = codecs

module.exports = CID
