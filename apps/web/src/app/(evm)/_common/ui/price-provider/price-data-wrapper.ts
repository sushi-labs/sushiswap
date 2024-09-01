import type { Address } from 'viem'

export class ReadOnlyPriceBufferWrapper {
  protected priceBuffer: Buffer
  protected priceCount: number

  constructor({
    priceBuffer,
    priceCount = 0,
  }: { priceBuffer: Buffer; priceCount?: number }) {
    this.priceBuffer = priceBuffer
    this.priceCount = priceCount
  }

  /**
   * @brief The used buffer size
   */
  public get bufferSize() {
    return this.priceCount * 24
  }

  /**
   * @brief The number of prices stored
   */
  public get size() {
    return this.priceCount
  }

  public addressAt<T extends 'bigint' | 'hex'>(
    type: T,
    i: number,
  ): T extends 'bigint' ? bigint : Address {
    const part1 = this.priceBuffer.readBigUInt64BE(i + 0) // Read first 8 bytes as BigInt
    const part2 = this.priceBuffer.readBigUInt64BE(i + 8) // Read next 8 bytes as BigInt
    const part3 = BigInt(this.priceBuffer.readUInt32BE(i + 16)) // Read the last 4 bytes as a BigInt

    // Combine them into a single BigInt
    const address = (part1 << 96n) | (part2 << 32n) | part3

    if (type === 'bigint') {
      return address as T extends 'bigint' ? bigint : Address
    }

    return `0x${address
      .toString(16)
      .padStart(40, '0')}` as const as T extends 'bigint' ? bigint : Address
  }

  /**
   * @param _address
   * @returns Either the index of the address or the index where the address should be inserted
   */
  public potentialIndexOf(_address: bigint | Address) {
    const address = BigInt(_address)

    let leftBorder = 0
    let rightBorder = this.priceCount

    while (leftBorder < rightBorder) {
      const i = Math.floor((leftBorder + rightBorder) / 2)
      const currentAddress = this.addressAt('bigint', i * 24)

      if (currentAddress < address) {
        leftBorder = i + 1
      } else {
        rightBorder = i
      }
    }

    return leftBorder * 24
  }

  public indexOf(_address: bigint | Address) {
    const address = BigInt(_address)

    const leftBorder = this.potentialIndexOf(address)

    if (leftBorder === this.bufferSize) {
      return -1
    }

    if (this.addressAt('bigint', leftBorder) === address) {
      return leftBorder
    }

    return -1
  }

  public hasAddress(_address: bigint | Address) {
    const address = BigInt(_address)

    return this.indexOf(address) !== -1
  }

  public priceAt(i: number) {
    return this.priceBuffer.readFloatBE(i + 20)
  }

  public priceOf(_address: bigint | Address) {
    const address = BigInt(_address)

    const i = this.indexOf(address)

    if (i === -1) {
      return undefined
    }

    return this.priceAt(i)
  }

  public toJSON() {
    const prices: Record<string, number> = {}

    if (this.priceCount === 0) {
      return prices
    }

    for (let i = 0; i < this.bufferSize; i += 24) {
      const address = this.addressAt('hex', i)
      const price = this.priceAt(i)

      prices[address] = price
    }

    return prices
  }
}

export class PriceBufferWrapper extends ReadOnlyPriceBufferWrapper {
  protected priceArrayBuffer: SharedArrayBuffer | ArrayBuffer

  private static createArrayBuffer(size: number, isShared: boolean) {
    if (isShared) {
      return new SharedArrayBuffer(size)
    }
    return new ArrayBuffer(size)
  }

  constructor({
    useSharedMemory,
    initialSize = 0,
  }: { useSharedMemory: boolean; initialSize?: number }) {
    const priceArrayBuffer = PriceBufferWrapper.createArrayBuffer(
      initialSize,
      useSharedMemory,
    )

    super({ priceBuffer: Buffer.from(priceArrayBuffer) })
    this.priceArrayBuffer = priceArrayBuffer
  }

  public set(_address: bigint | Address, value: number) {
    const address = BigInt(_address)

    const existingIndex = this.indexOf(address)

    // Exists
    if (existingIndex !== -1) {
      // Update
      this.priceBuffer.writeFloatBE(value, existingIndex + 20)
    } else {
      // Resize if necessary
      if (this.bufferSize + 24 > this.priceBuffer.length) {
        this.resize()
      }
      // Get the index where the address should be inserted
      const index = this.potentialIndexOf(address)
      // Move the data to the right
      this.priceBuffer.copyWithin(index + 24, index)
      // Write the address
      const hex = address.toString(16).padStart(40, '0')
      this.priceBuffer.write(hex, index, 20, 'hex')
      // Write the price
      this.priceBuffer.writeFloatBE(value, index + 20)

      this.priceCount++
    }
  }

  public delete(_address: bigint | Address) {
    const address = BigInt(_address)

    const existingIndex = this.indexOf(address)

    if (existingIndex === -1) {
      return false
    }

    this.priceBuffer.copyWithin(existingIndex, existingIndex + 24)
    this.priceCount--

    return true
  }

  /**
   * @brief Doubles the size of the buffer
   */
  private resize() {
    const oldPriceBuffer = this.priceBuffer
    const oldPriceArrayBuffer = this.priceArrayBuffer

    // Create a new buffer with double the size
    const newPriceArrayBuffer = PriceBufferWrapper.createArrayBuffer(
      Math.max(oldPriceArrayBuffer.byteLength * 2, 24),
      !(oldPriceArrayBuffer instanceof ArrayBuffer),
    )

    // Copy the old data into the new buffer
    const newPriceBuffer = Buffer.from(newPriceArrayBuffer)
    oldPriceBuffer.copy(newPriceBuffer)

    this.priceBuffer = newPriceBuffer
    this.priceArrayBuffer = newPriceArrayBuffer
  }

  public get arrayBuffer() {
    return this.priceArrayBuffer
  }
}
