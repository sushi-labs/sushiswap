import type { Address } from 'viem'

const ADDRESS_SIZE = 20
const PRICE_SIZE = 4
const ENTRY_SIZE = ADDRESS_SIZE + PRICE_SIZE

export const PriceStructSizes = {
  ADDRESS_SIZE,
  PRICE_SIZE,
  ENTRY_SIZE,
}

export class ReadOnlyPriceBufferWrapper {
  protected priceBuffer: Buffer
  protected priceCount: number

  constructor({
    priceBuffer,
    priceCount = 0,
  }: { priceBuffer: Buffer; priceCount?: number }) {
    this.priceBuffer = priceBuffer
    this.priceCount = priceCount

    if (priceBuffer.length < this.bufferSize) {
      throw new Error('The buffer is too small for the given price count')
    }
  }

  /**
   * @brief The used buffer size
   */
  public get bufferSize() {
    return this.priceCount * ENTRY_SIZE
  }

  /**
   * @brief The number of prices stored
   */
  public get size() {
    return this.priceCount
  }

  /**
   * @warning Only throws if the offset is out of bounds of the Buffer, not the used buffer size
   */
  public addressAt<T extends 'bigint' | 'hex'>(
    type: T,
    offset: number,
  ): T extends 'bigint' ? bigint : Address {
    const part1 = this.priceBuffer.readBigUInt64BE(offset + 0) // Read first 8 bytes as BigInt
    const part2 = this.priceBuffer.readBigUInt64BE(offset + 8) // Read next 8 bytes as BigInt
    const part3 = BigInt(this.priceBuffer.readUInt32BE(offset + 16)) // Read the last 4 bytes as a BigInt

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
   * @returns Either the offset of the address or the offset where the address should be inserted
   */
  public potentialOffsetOf(_address: bigint | Address) {
    const address = BigInt(_address)

    let leftBorder = 0
    let rightBorder = this.priceCount

    while (leftBorder < rightBorder) {
      const i = Math.floor((leftBorder + rightBorder) / 2)
      const currentAddress = this.addressAt('bigint', i * ENTRY_SIZE)

      if (currentAddress < address) {
        leftBorder = i + 1
      } else {
        rightBorder = i
      }
    }

    return leftBorder * ENTRY_SIZE
  }

  public offsetOf(_address: bigint | Address) {
    const address = BigInt(_address)

    const leftBorder = this.potentialOffsetOf(address)

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

    return this.offsetOf(address) !== -1
  }

  public priceAtOffset(i: number) {
    return this.priceBuffer.readFloatBE(i + ADDRESS_SIZE)
  }

  public priceOf(_address: bigint | Address) {
    const address = BigInt(_address)

    const i = this.offsetOf(address)

    if (i === -1) {
      return undefined
    }

    return this.priceAtOffset(i)
  }

  public toJSON() {
    const prices: Record<string, number> = {}

    if (this.priceCount === 0) {
      return prices
    }

    for (let i = 0; i < this.bufferSize; i += 24) {
      const address = this.addressAt('hex', i)
      const price = this.priceAtOffset(i)

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

    const existingOffset = this.offsetOf(address)

    // Exists
    if (existingOffset !== -1) {
      // Update
      this.priceBuffer.writeFloatBE(value, existingOffset + ADDRESS_SIZE)
    } else {
      // Resize if necessary
      if (this.bufferSize + ENTRY_SIZE > this.priceBuffer.length) {
        this.resize()
      }
      // Get the offset where the address should be inserted
      const offset = this.potentialOffsetOf(address)
      // Move the data to the right
      this.priceBuffer.copyWithin(offset + ENTRY_SIZE, offset)
      // Write the address
      const hex = address.toString(16).padStart(40, '0')
      this.priceBuffer.write(hex, offset, ADDRESS_SIZE, 'hex')
      // Write the price
      this.priceBuffer.writeFloatBE(value, offset + ADDRESS_SIZE)

      this.priceCount++
    }
  }

  public delete(_address: bigint | Address) {
    const address = BigInt(_address)

    const existingOffset = this.offsetOf(address)

    if (existingOffset === -1) {
      return false
    }

    this.priceBuffer.copyWithin(existingOffset, existingOffset + ENTRY_SIZE)
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
      Math.max(oldPriceArrayBuffer.byteLength * 2, ENTRY_SIZE),
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
