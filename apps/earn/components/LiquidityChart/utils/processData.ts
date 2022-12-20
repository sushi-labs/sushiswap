import { tickToPrice } from '@muffinfi/muffin-sdk'
import { Token } from '@sushiswap/currency'
import type { TickData } from 'hooks/usePoolTickData'

import { Datum } from './types'

/*
  Terminology:
  - datum:    a point
  - data:     a series of datum
  - dataList: a list of data
*/

/**
 * Workflow:
 * - sort ticks from lower price to upper price
 * - cumulative-sum the liquidityNet to become liquidity
 * - merge data of different time series into one time series
 * - convert tick to price
 */
export const processTicksData = (rawData: TickData, baseToken: Token, quoteToken: Token, invertPrice: boolean) => {
  const ascendingTick = !invertPrice

  // sort and convert liquidityNet to liquidity
  const tickLiqDataList = rawData.tiers.map((tier) => {
    const sortedTicks = [...tier.ticks].sort((a, b) => (a.tickIdx < b.tickIdx ? -1 : 1) * (ascendingTick ? 1 : -1))
    let memo = 0
    return sortedTicks.map((tick): Datum => {
      memo += parseFloat(tick.liquidityNet) * (ascendingTick ? 1 : -1)
      return {
        vx: tick.tickIdx,
        vy: memo,
      }
    })
  })

  // sort and merge data into same length
  const mergedTickLiqDataList = sortAndMergeDataList(tickLiqDataList, ascendingTick)

  // convert tick to price
  const pricesByTick: Record<number, number> = {}
  const mergedPriceLiqDataList = mergedTickLiqDataList.map((tickLiqData) => {
    return tickLiqData.map(({ vx, vy }) => {
      if (pricesByTick[vx] == null) {
        const price = tickToPrice(baseToken, quoteToken, vx)
        pricesByTick[vx] = parseFloat((invertPrice ? price.invert() : price).toSignificant(12))
      }
      return { vx: pricesByTick[vx], vy }
    })
  })

  return mergedPriceLiqDataList
}

/**
 * Trasnform a list of data into same array length. For example:
 *
 * Before:
 * - dataList[0] ────●───────────────●───────────▶
 * - dataList[1] ────────●────●────────────●─────▶
 *
 * After:
 * - dataList[0] ────●───●────●──────●─────●─────▶
 * - dataList[1] ────●───●────●──────●─────●─────▶
 *
 */
const sortAndMergeDataList = (dataList: Datum[][], ascending: boolean, initialEmptyValue = 0) => {
  const sortedDataList = dataList.map((data) => [...data].sort((a, b) => (a.vx < b.vx ? -1 : 1) * (ascending ? 1 : -1)))

  const indexes = sortedDataList.map(() => -1)
  const newDataList = sortedDataList.map((): Datum[] => [])

  while (true) {
    const nextVXs = sortedDataList.map((data, j) => data[indexes[j] + 1]?.vx)

    const nextVXsNonNull = nextVXs.filter((vx) => vx != null)
    if (nextVXsNonNull.length === 0) break

    const nextVX = ascending ? Math.min(...nextVXsNonNull) : Math.max(...nextVXsNonNull)
    nextVXs.forEach((vx, j) => {
      if (vx === nextVX) indexes[j] += 1
    })

    newDataList.forEach((patchedData, j) => {
      const i = indexes[j]
      const vy = i === -1 ? initialEmptyValue : sortedDataList[j][i].vy
      patchedData.push({ vx: nextVX, vy })
    })
  }
  return newDataList
}

/**
 * Stack data, i.e. cum-sum the y-values. For example:
 *
 * Before:
 * - dataList[0]: [0, 1, 2, 3]
 * - dataList[1]: [1, 1, 1, 1]
 * - dataList[2]: [3, 2, 1, 0]
 *
 * After:
 * - dataList[0]: [0, 1, 2, 3]
 * - dataList[1]: [1, 2, 3, 4]
 * - dataList[2]: [4, 4, 4, 4]
 */
export const stackDataList = (dataList: Datum[][]) => {
  if (dataList.length === 0) return []

  const res: Datum[][] = new Array(dataList.length)
  res[0] = dataList[0]

  const len = dataList[0]?.length

  for (let k = 1; k < dataList.length; k++) {
    const data = dataList[k]
    if (data.length !== len) throw new Error('Data list are not the same size')
    res[k] = data.map((datum, i) => ({
      vx: datum.vx,
      vy: res[k - 1][i].vy + datum.vy,
    }))
  }
  return res
}

/**
 * Clip data into a range
 * Before:  ───1────2────3────────────4─────▶
 * Clip:         │                │
 * After:   ─────1──2────3────────3─────────▶
 *
 * Data are clipped for step-after area chart.
 * The chart will be like this:
 *               │                │
 *               │       3────────┼───┐
 *               │  2────┘        │   4─────
 *          ───1─┼──┘             │
 *          ─────┼────────────────┼─────────▶
 *             start             end
 */
export const clipData = (originalData: Datum[], domain: [number, number]) => {
  let iStart: number | undefined
  let iEnd: number | undefined

  for (let i = 0; i < originalData.length; i++) {
    const { vx } = originalData[i]
    if (iStart == null && vx > domain[0]) iStart = i - 1
    if (iEnd == null && vx > domain[1]) iEnd = i
    if (iStart != null && iEnd != null) break
  }

  // return empty array if all data greater than end domain
  if (iEnd === 0) return []

  // patch end datum
  if (iEnd == null) iEnd = originalData.length
  let data = originalData.slice(0, iEnd)
  data.push({ vx: domain[1], vy: originalData[iEnd - 1].vy })

  // patch start datum
  if (iStart != null && iStart !== -1) {
    data = data.slice(iStart)
    data[0] = { vx: domain[0], vy: originalData[iStart].vy }
  }

  return data
}

/**
 * Format number to string without scientic notation.
 * Round down, since it uses `.toString()`
 */
export const toFixed = (x: number) => {
  if (Math.abs(x) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1])
    if (e) {
      x *= 10 ** (e - 1)
      return (x < 0 ? '-' : '') + '0.' + '0'.repeat(e - 1) + Math.abs(x).toString().substring(2)
    }
  } else {
    let e = parseInt(x.toString().split('+')[1])
    if (e > 20) {
      e -= 20
      x /= 10 ** e
      return x + '0'.repeat(e)
    }
  }
  return `${x}`
}
