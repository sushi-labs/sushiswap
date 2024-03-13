export class HEXer {
  private hex: string

  constructor() {
    this.hex = ''
  }

  toString() {
    return this.hex
  }

  toHexString(): `0x${string}` {
    return `0x${this.hex}`
  }

  toString0x() {
    // for backwards compatibility for now
    return this.toHexString()
  }

  uint8(data: number): HEXer {
    if (data > 255 || data < 0 || data !== Math.round(data)) {
      throw new Error(`Wrong uint8: ${data}`)
    }
    this.hex += data.toString(16).padStart(2, '0')

    return this
  }

  bool(data: boolean): HEXer {
    return this.uint8(data ? 1 : 0)
  }

  uint16(data: number): HEXer {
    if (data >= 256 * 256 || data < 0 || data !== Math.round(data)) {
      throw new Error(`Wrong uint16: ${data}`)
    }
    this.hex += data.toString(16).padStart(4, '0')

    return this
  }

  uint24(data: number): HEXer {
    if (data >= 256 * 256 * 256 || data < 0 || data !== Math.round(data)) {
      throw new Error(`Wrong uint24: ${data}`)
    }
    this.hex += data.toString(16).padStart(6, '0')

    return this
  }

  share16(share: number): HEXer {
    return this.uint16(Math.round(share * 65535))
  }

  uint32(data: number): HEXer {
    if (
      data >= 256 * 256 * 256 * 256 ||
      data < 0 ||
      data !== Math.round(data)
    ) {
      throw new Error(`Wrong uint32: ${data}`)
    }
    this.hex += data.toString(16).padStart(8, '0')

    return this
  }

  uint256(data: bigint | number): HEXer {
    if (typeof data === 'number') {
      if (
        data > Number.MAX_SAFE_INTEGER ||
        data < 0 ||
        data !== Math.round(data)
      ) {
        throw new Error(`Wrong uint256: ${data}`)
      }
      this.hex += data.toString(16).padStart(64, '0')

      return this
    } else {
      const hex = data.toString(16).padStart(64, '0')
      if (data < 0n || hex.length > 64) {
        throw new Error(`Wrong uin256: ${data.toString()}`)
      }
      this.hex += hex

      return this
    }
  }

  uint(data: bigint | number): HEXer {
    return this.uint256(data)
  }

  address(addr: string): HEXer {
    if (addr.length > 42 || addr === 'RouteProcessor') {
      throw new Error(`Wrong address: ${addr}`)
    }
    // 0xabcd => 0000abcd
    this.hex += addr.slice(2).padStart(40, '0')

    return this
  }

  hexData(data: string): HEXer {
    if (data.length % 2 !== 0) {
      throw new Error(`Wrong hex data length: ${data.length}`)
    }

    if (data.startsWith('0x')) data = data.slice(2)
    this.hex += data

    return this
  }

  bytes(data: string): HEXer {
    if (data.length % 2 !== 0) {
      throw new Error(`Wrong bytes length: ${data.length}`)
    }
    if (data.startsWith('0x')) data = data.slice(2)
    this.uint(data.length / 2)
    this.hex += data

    return this
  }

  bytes32(data: string): HEXer {
    if (data.startsWith('0x')) data = data.slice(2)
    if (data.length > 64) {
      throw new Error(`Wrong bytes32 length: ${data.length}`)
    }

    this.hex += data.padEnd(64, '0')
    return this
  }
}
