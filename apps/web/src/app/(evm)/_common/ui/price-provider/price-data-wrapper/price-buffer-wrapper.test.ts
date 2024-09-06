import { randomBytes } from 'crypto'
import type { Address } from 'viem'
import { describe, expect, it } from 'vitest'
import {
  PriceBufferWrapper,
  PriceStructSizes,
  ReadOnlyPriceBufferWrapper,
} from './price-buffer-wrapper'

function generateRandomAddress<T extends 'hex' | 'bigint'>(
  type: T,
): T extends 'bigint' ? bigint : Address {
  const string = `0x${randomBytes(20).toString('hex')}`

  if (type === 'bigint') {
    return BigInt(string) as T extends 'bigint' ? bigint : Address
  }

  return string as T extends 'bigint' ? bigint : Address
}

function generateRandomAddresses<T extends 'hex' | 'bigint'>(
  type: T,
  count: number,
) {
  return Array.from({ length: count }, () => generateRandomAddress(type)).sort(
    (a, b) => Number(BigInt(a) - BigInt(b)),
  )
}

function writeAddressesToBuffer(
  buffer: Buffer,
  _addresses: (bigint | Address)[],
): void {
  const addresses = _addresses.map((address) => BigInt(address))

  addresses.forEach((address, i) => {
    buffer.write(
      address.toString(16).padStart(40, '0'),
      i * PriceStructSizes.ENTRY_SIZE,
      PriceStructSizes.ADDRESS_SIZE,
      'hex',
    )
  })
}

describe('ReadOnlyPriceBufferWrapper', { concurrent: true }, () => {
  it('should accept and set an existing buffer', () => {
    const buffer = Buffer.alloc(10 * PriceStructSizes.ENTRY_SIZE)

    const wrapper = new ReadOnlyPriceBufferWrapper({ priceBuffer: buffer })
    expect(wrapper['priceBuffer']).toBe(buffer)
  })

  it('should throw if the buffer is not big enough to contain the specified number of prices', () => {
    const priceCount = 10
    const buffer = Buffer.alloc(priceCount * PriceStructSizes.ENTRY_SIZE)

    expect(
      () =>
        new ReadOnlyPriceBufferWrapper({
          priceBuffer: buffer,
          priceCount: priceCount + 1,
        }),
    ).toThrow()
  })

  it('should throw if the we ask for an address at an index that is out of bounds', () => {
    const priceCount = 10
    const buffer = Buffer.alloc(priceCount * PriceStructSizes.ENTRY_SIZE)

    const wrapper = new ReadOnlyPriceBufferWrapper({
      priceBuffer: buffer,
      priceCount,
    })

    expect(() =>
      wrapper.addressAt('hex', priceCount * PriceStructSizes.ENTRY_SIZE),
    ).toThrow()
  })

  it('should return the address at the specified index', () => {
    const address = generateRandomAddress('hex')

    const buffer = Buffer.alloc(PriceStructSizes.ENTRY_SIZE)

    // Write the address to the buffer
    buffer.write(address.slice(2), 0, PriceStructSizes.ADDRESS_SIZE, 'hex')

    const wrapper = new ReadOnlyPriceBufferWrapper({
      priceBuffer: buffer,
      priceCount: 1,
    })

    expect(wrapper.addressAt('hex', 0)).toBe(address)
    expect(wrapper.addressAt('bigint', 0)).toBe(BigInt(address))
  })

  it(`should return the correct potential offset of an address if doesn't exist`, () => {
    const priceCount = 10
    const addresses = generateRandomAddresses('bigint', priceCount)

    const buffer = Buffer.alloc(priceCount * PriceStructSizes.ENTRY_SIZE)

    writeAddressesToBuffer(buffer, addresses)

    const wrapper = new ReadOnlyPriceBufferWrapper({
      priceBuffer: buffer,
      priceCount,
    })

    const testedIndex = 5
    const testedAddress = addresses[testedIndex]

    // When the address is smaller than the existing address, it would be inserted at the existing address's index
    expect(wrapper.potentialOffsetOf(testedAddress - 1n)).toBe(
      (testedIndex + 0) * PriceStructSizes.ENTRY_SIZE,
    )
    // When the address is bigger than the existing address, it would be right after the existing address's index
    expect(wrapper.potentialOffsetOf(testedAddress + 1n)).toBe(
      (testedIndex + 1) * PriceStructSizes.ENTRY_SIZE,
    )
  })

  it(`should return the correct offset of an address if it exists, -1 if it doesn't`, () => {
    const priceCount = 10
    const addresses = generateRandomAddresses('bigint', priceCount)

    const buffer = Buffer.alloc(priceCount * PriceStructSizes.ENTRY_SIZE)

    writeAddressesToBuffer(buffer, addresses)

    const wrapper = new ReadOnlyPriceBufferWrapper({
      priceBuffer: buffer,
      priceCount,
    })

    const testedIndex = 5
    const testedAddress = addresses[testedIndex]

    expect(wrapper.offsetOf(testedAddress)).toBe(
      testedIndex * PriceStructSizes.ENTRY_SIZE,
    )

    // Would be pretty unlucky if we had a collision :D
    const missingAddress = generateRandomAddress('bigint')

    expect(wrapper.offsetOf(missingAddress)).toBe(-1)
  })

  it('should return whether an address exists in the buffer', () => {
    const priceCount = 10
    const addresses = generateRandomAddresses('bigint', priceCount)

    const buffer = Buffer.alloc(priceCount * PriceStructSizes.ENTRY_SIZE)

    writeAddressesToBuffer(buffer, addresses)

    const wrapper = new ReadOnlyPriceBufferWrapper({
      priceBuffer: buffer,
      priceCount,
    })

    const testedIndex = 5
    const testedAddress = addresses[testedIndex]

    expect(wrapper.hasAddress(testedAddress)).toBe(true)

    // Would be pretty unlucky if we had a collision :D
    const missingAddress = generateRandomAddress('bigint')

    expect(wrapper.hasAddress(missingAddress)).toBe(false)
  })

  it('should return the price at the specified index', () => {
    const price = Math.random()

    const buffer = Buffer.alloc(PriceStructSizes.ENTRY_SIZE)

    // Write the price to the buffer
    buffer.writeFloatBE(price, PriceStructSizes.ADDRESS_SIZE)

    const wrapper = new ReadOnlyPriceBufferWrapper({
      priceBuffer: buffer,
      priceCount: 1,
    })

    expect(wrapper.priceAtOffset(0)).to.be.approximately(price, 0.0001)
  })

  it(`should return the price of the specified address, undefined if the address doesn't exist`, () => {
    const price = Math.random()
    const priceCount = 10
    const addresses = generateRandomAddresses('bigint', priceCount)

    const buffer = Buffer.alloc(priceCount * PriceStructSizes.ENTRY_SIZE)

    writeAddressesToBuffer(buffer, addresses)

    const testedIndex = 5
    const testedAddress = addresses[testedIndex]

    // Write the price to the buffer
    buffer.writeFloatBE(
      price,
      PriceStructSizes.ENTRY_SIZE * testedIndex + PriceStructSizes.ADDRESS_SIZE,
    )

    const wrapper = new ReadOnlyPriceBufferWrapper({
      priceBuffer: buffer,
      priceCount,
    })

    expect(wrapper.priceOf(testedAddress)).to.be.approximately(price, 0.0001)

    expect(wrapper.priceOf(generateRandomAddress('bigint'))).toBe(undefined)
  })
})

describe('PriceBufferWrapper', { concurrent: true }, () => {
  it('should sort the inserted addresses', () => {
    const buffer = new PriceBufferWrapper({ useSharedMemory: false })

    buffer.set(5n, 5)
    buffer.set(1n, 1)
    buffer.set(16n, 16)
    buffer.set(3n, 3)

    expect(buffer.addressAt('bigint', 0 * PriceStructSizes.ENTRY_SIZE)).toBe(1n)
    expect(buffer.addressAt('bigint', 1 * PriceStructSizes.ENTRY_SIZE)).toBe(3n)
    expect(buffer.addressAt('bigint', 2 * PriceStructSizes.ENTRY_SIZE)).toBe(5n)
    expect(buffer.addressAt('bigint', 3 * PriceStructSizes.ENTRY_SIZE)).toBe(
      16n,
    )
  })

  it('should insert a new address and update an existing address', () => {
    const buffer = new PriceBufferWrapper({ useSharedMemory: false })

    buffer.set(5n, 5)
    buffer.set(1n, 1)
    buffer.set(16n, 16)
    buffer.set(3n, 3)

    expect(buffer.priceOf(5n)).to.be.approximately(5, 0.0001)
    expect(buffer.priceOf(1n)).to.be.approximately(1, 0.0001)

    buffer.set(5n, 10)
    buffer.set(1n, 2)

    expect(buffer.priceOf(5n)).to.be.approximately(10, 0.0001)
    expect(buffer.priceOf(1n)).to.be.approximately(2, 0.0001)
  })

  it('should increase the price count only when inserting a new address', () => {
    const buffer = new PriceBufferWrapper({ useSharedMemory: false })

    buffer.set(5n, 5)
    buffer.set(1n, 1)
    buffer.set(16n, 16)
    buffer.set(3n, 3)

    expect(buffer['priceCount']).toBe(4)

    buffer.set(5n, 10)
    buffer.set(1n, 2)

    expect(buffer['priceCount']).toBe(4)

    buffer.set(2n, 2)

    expect(buffer['priceCount']).toBe(5)
  })

  it('should decrease the price count only when deleting an existing address', () => {
    const buffer = new PriceBufferWrapper({ useSharedMemory: false })

    buffer.set(5n, 5)
    buffer.set(1n, 1)
    buffer.set(16n, 16)
    buffer.set(3n, 3)

    expect(buffer['priceCount']).toBe(4)

    buffer.delete(5n)
    buffer.delete(1n)

    expect(buffer['priceCount']).toBe(2)

    buffer.delete(2n)

    expect(buffer['priceCount']).toBe(2)
  })

  it('should keep the type of the array buffer', () => {
    const sharedArrayBuffer = new PriceBufferWrapper({ useSharedMemory: true })
    expect(sharedArrayBuffer['priceArrayBuffer']).toBeInstanceOf(
      SharedArrayBuffer,
    )
    sharedArrayBuffer['resize']()
    expect(sharedArrayBuffer['priceArrayBuffer']).toBeInstanceOf(
      SharedArrayBuffer,
    )

    const arrayBuffer = new PriceBufferWrapper({ useSharedMemory: false })
    expect(arrayBuffer['priceArrayBuffer']).toBeInstanceOf(ArrayBuffer)
    arrayBuffer['resize']()
    expect(arrayBuffer['priceArrayBuffer']).toBeInstanceOf(ArrayBuffer)
  })
})
