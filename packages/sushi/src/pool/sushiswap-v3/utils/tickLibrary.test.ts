import { describe, expect, it } from 'vitest'
import { TickLibrary } from './tickLibrary.js'

describe('TickLibrary', () => {
  describe('#getFeeGrowthInside', () => {
    it('0', () => {
      const [feeGrowthInside0X128, feeGrowthInside1X128] =
        TickLibrary.getFeeGrowthInside(
          {
            feeGrowthOutside0X128: 0n,
            feeGrowthOutside1X128: 0n,
          },
          {
            feeGrowthOutside0X128: 0n,
            feeGrowthOutside1X128: 0n,
          },
          -1,
          1,
          0,
          0n,
          0n,
        )
      expect(feeGrowthInside0X128).toEqual(0n)
      expect(feeGrowthInside1X128).toEqual(0n)
    })

    it('non-0, all inside', () => {
      const [feeGrowthInside0X128, feeGrowthInside1X128] =
        TickLibrary.getFeeGrowthInside(
          {
            feeGrowthOutside0X128: 0n,
            feeGrowthOutside1X128: 0n,
          },
          {
            feeGrowthOutside0X128: 0n,
            feeGrowthOutside1X128: 0n,
          },
          -1,
          1,
          0,
          2n ** 128n,
          2n ** 128n,
        )
      expect(feeGrowthInside0X128).toEqual(2n ** 128n)
      expect(feeGrowthInside1X128).toEqual(2n ** 128n)
    })

    it('non-0, all outside', () => {
      const [feeGrowthInside0X128, feeGrowthInside1X128] =
        TickLibrary.getFeeGrowthInside(
          {
            feeGrowthOutside0X128: 2n ** 128n,
            feeGrowthOutside1X128: 2n ** 128n,
          },
          {
            feeGrowthOutside0X128: 0n,
            feeGrowthOutside1X128: 0n,
          },
          -1,
          1,
          0,
          2n ** 128n,
          2n ** 128n,
        )
      expect(feeGrowthInside0X128).toEqual(0n)
      expect(feeGrowthInside1X128).toEqual(0n)
    })

    it('non-0, some outside', () => {
      const [feeGrowthInside0X128, feeGrowthInside1X128] =
        TickLibrary.getFeeGrowthInside(
          {
            feeGrowthOutside0X128: 2n ** 127n,
            feeGrowthOutside1X128: 2n ** 127n,
          },
          {
            feeGrowthOutside0X128: 0n,
            feeGrowthOutside1X128: 0n,
          },
          -1,
          1,
          0,
          2n ** 128n,
          2n ** 128n,
        )
      expect(feeGrowthInside0X128).toEqual(2n ** 127n)
      expect(feeGrowthInside1X128).toEqual(2n ** 127n)
    })
  })
})
