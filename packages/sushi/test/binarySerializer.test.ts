import { describe, expect, it } from 'vitest'
import {
  BinReadStream,
  BinWriteStream,
} from '../src/serializer/BinarySerialization'

const uint32TestValues = [0, 256, 0x2a3b4c5d]
const uint24TestValues = [0, 256, 0x2a3b4c]
const int24TestValues = [0, 256, 0x2a3b4c, -1, -256, 1 << (23 - 1), -(1 << 23)]
const float64TestValues = [0, 256, 0x2a3b4c5d, 23423.654645e234, -1, -23432e-32]
const bigUIntTestValues = [
  0n,
  1n,
  255n,
  256n,
  1n << 15n,
  0x2a3b4c5dn,
  89758046378569170218934721n,
]
const bigIntTestValues = [
  0n,
  1n,
  255n,
  256n,
  1n << 15n,
  0x2a3b4c5dn,
  89758046378569170218934721n,
  -1n,
  -256n,
  -876347896796535897493567893465n,
]
const stringTestValues = [
  '123',
  '',
  '小拳头',
  '1💋1',
  '💋💋💋💋💋💋💋',
  'все на борт!',
  'a long string rwkjfhrkjghkergfkksgdhjkfgshjkdgfkhjsdgfjhkgjfkhgdjhskjhekrhfjksbdfm💋hvbdmhvbdfh,vbfr',
]
const addressTestValues = [
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
]

describe('Binary Serialization', () => {
  describe('Serialize & deserialize', () => {
    it('uint8', () => {
      const testValues = [0, 5, 255]
      const serializer = new BinWriteStream()
      testValues.forEach((val) => serializer.uint8(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.uint8()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it('uint16', () => {
      const testValues = [0, 5, 256, 1 << 15]
      const serializer = new BinWriteStream()
      testValues.forEach((val) => serializer.uint16(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.uint16()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it('uint24', () => {
      const testValues = uint24TestValues
      const serializer = new BinWriteStream()
      testValues.forEach((val) => serializer.uint24(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.uint24()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it('int24', () => {
      const testValues = int24TestValues
      const serializer = new BinWriteStream()
      testValues.forEach((val) => serializer.int24(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.int24()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it('uint32', () => {
      const testValues = uint32TestValues
      const serializer = new BinWriteStream()
      testValues.forEach((val) => serializer.uint32(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.uint32()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it('float64', () => {
      const testValues = float64TestValues
      const serializer = new BinWriteStream()
      testValues.forEach((val) => serializer.float64(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.float64()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it('float64 not 8-aligned position', () => {
      const testValues = float64TestValues
      const serializer = new BinWriteStream()
      serializer.uint8(123)
      testValues.forEach((val) => serializer.float64(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      deserializer.uint8()
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.float64()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it('bigUInt', () => {
      const testValues = bigUIntTestValues
      const serializer = new BinWriteStream()
      testValues.forEach((val) => serializer.bigUInt(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.bigUInt()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it('bigInt', () => {
      const testValues = bigIntTestValues
      const serializer = new BinWriteStream()
      testValues.forEach((val) => serializer.bigInt(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.bigInt()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it('str16UTF8', () => {
      const testValues = stringTestValues
      const serializer = new BinWriteStream()
      testValues.forEach((val) => serializer.str16UTF8(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.str16UTF8()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it('str16UTF16', () => {
      const testValues = stringTestValues
      const serializer = new BinWriteStream()
      testValues.forEach((val) => serializer.str16UTF16(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.str16UTF16()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it('address', () => {
      const testValues = addressTestValues
      const serializer = new BinWriteStream()
      testValues.forEach((val) => serializer.address(val))
      const deserializer = new BinReadStream(serializer.getSerializedData())
      let i = 0
      for (; deserializer.restBytes() > 0; ++i) {
        const val = deserializer.address()
        expect(val).equals(testValues[i])
      }
      expect(i).equals(testValues.length)
    })

    it.skip('uint32 timing', () => {
      const SAMPLES = 10_000
      const testValues = uint32TestValues
      const serializer = new BinWriteStream()
      const startSer = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        serializer.uint32(testValues[i % testValues.length])
      }
      const timeSer = performance.now() - startSer
      console.log(`Serialization uint32 x${SAMPLES} timing = ${timeSer} ms`)
      const deserializer = new BinReadStream(serializer.getSerializedData())
      const startDes = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        deserializer.uint32()
      }
      const timeDes = performance.now() - startDes
      console.log(`Deserialization uint32 x${SAMPLES} timing = ${timeDes} ms`)
    })

    it.skip('float64 timing', () => {
      const SAMPLES = 10_000
      const testValues = float64TestValues
      const serializer = new BinWriteStream()
      const startSer = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        serializer.float64(testValues[i % testValues.length])
      }
      const timeSer = performance.now() - startSer
      console.log(`Serialization float64 x${SAMPLES} timing = ${timeSer} ms`)
      const deserializer = new BinReadStream(serializer.getSerializedData())
      const startDes = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        deserializer.float64()
      }
      const timeDes = performance.now() - startDes
      console.log(`Deserialization float64 x${SAMPLES} timing = ${timeDes} ms`)
    })

    it.skip('BigUInt timing', () => {
      const SAMPLES = 10_000
      const testValues = bigUIntTestValues
      const serializer = new BinWriteStream()
      const startSer = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        serializer.bigUInt(testValues[i % testValues.length])
      }
      const timeSer = performance.now() - startSer
      console.log(`Serialization bigUInt x${SAMPLES} timing = ${timeSer} ms`)
      const deserializer = new BinReadStream(serializer.getSerializedData())
      const startDes = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        deserializer.bigUInt()
      }
      const timeDes = performance.now() - startDes
      console.log(`Deserialization bigUInt x${SAMPLES} timing = ${timeDes} ms`)
    })

    it.skip('str16UTF8 timing', () => {
      const SAMPLES = 10_000
      const testValues = stringTestValues
      const serializer = new BinWriteStream()
      const startSer = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        serializer.str16UTF8(testValues[i % testValues.length])
      }
      const timeSer = performance.now() - startSer
      console.log(`Serialization str16UTF8 x${SAMPLES} timing = ${timeSer} ms`)
      const deserializer = new BinReadStream(serializer.getSerializedData())
      const startDes = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        deserializer.str16UTF8()
      }
      const timeDes = performance.now() - startDes
      console.log(
        `Deserialization str16UTF8 x${SAMPLES} timing = ${timeDes} ms`,
      )
    })

    it.skip('str16UTF16 timing', () => {
      const SAMPLES = 10_000
      const testValues = stringTestValues
      const serializer = new BinWriteStream()
      const startSer = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        serializer.str16UTF16(testValues[i % testValues.length])
      }
      const timeSer = performance.now() - startSer
      console.log(`Serialization str16UTF16 x${SAMPLES} timing = ${timeSer} ms`)
      const deserializer = new BinReadStream(serializer.getSerializedData())
      const startDes = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        deserializer.str16UTF16()
      }
      const timeDes = performance.now() - startDes
      console.log(
        `Deserialization str16UTF16 x${SAMPLES} timing = ${timeDes} ms`,
      )
    })

    it.skip('address timing', () => {
      const SAMPLES = 10_000
      const testValues = addressTestValues
      const serializer = new BinWriteStream()
      const startSer = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        serializer.address(testValues[i % testValues.length])
      }
      const timeSer = performance.now() - startSer
      console.log(`Serialization address x${SAMPLES} timing = ${timeSer} ms`)
      const deserializer = new BinReadStream(serializer.getSerializedData())
      const startDes = performance.now()
      for (let i = 0; i < SAMPLES; ++i) {
        deserializer.address()
      }
      const timeDes = performance.now() - startDes
      console.log(`Deserialization address x${SAMPLES} timing = ${timeDes} ms`)
    })
  })
})
