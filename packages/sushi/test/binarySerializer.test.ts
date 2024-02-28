import { describe, expect, it } from 'vitest'
import {
  BinReadStream,
  BinWriteStream,
} from '../src/serializer/BinarySerialization'

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

    it('uint32', () => {
      const testValues = [0, 256, 0x2a3b4c5d]
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
      const testValues = [0, 256, 0x2a3b4c5d, 23423.654645e234, -1, -23432e-32]
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

    it('bigint', () => {
      const testValues = [
        0n,
        1n,
        255n,
        256n,
        1n << 15n,
        0x2a3b4c5dn,
        89758046378569170218934721n,
      ]
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

    it('str16UTF8', () => {
      const testValues = [
        '123',
        '',
        '1💋1',
        '💋💋💋💋💋💋💋',
        'все на борт!',
        'a long string rwkjfhrkjghkergfkksgdhjkfgshjkdgfkhjsdgfjhkgjfkhgdjhskjhekrhfjksbdfm💋hvbdmhvbdfh,vbfr',
      ]
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
      const testValues = [
        '123',
        '',
        '1💋1',
        '💋💋💋💋💋💋💋',
        'все на борт!',
        'a long string rwkjfhrkjghkergfkksgdhjkfgshjkdgfkhjsdgfjhkgjfkhgdjhskjhekrhfjksbdfm💋hvbdmhvbdfh,vbfr',
      ]
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
  })
})
