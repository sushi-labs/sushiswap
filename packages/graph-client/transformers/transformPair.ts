import { chainShortName } from 'sushi/chain'

import type { BucketData, Pair } from '../.graphclient/index.js'

export function transformPair({
  pair,
  pair1d,
  pair2d,
  pair1w,
  hourSnapshots,
  daySnapshots,
}: {
  pair: Pair
  pair1d?: Pair
  pair2d?: Pair
  pair1w?: Pair
  hourSnapshots: BucketData[]
  daySnapshots: BucketData[]
}) {
  const liquidity1dChange = pair1d
    ? pair.liquidityUSD / pair1d.liquidityUSD - 1
    : 0
  const liquidity1wChange = pair1w
    ? pair.liquidityUSD / pair1w.liquidityUSD - 1
    : 0

  const volume1d = pair1d
    ? Number(pair.volumeUSD) - Number(pair1d.volumeUSD)
    : Number(pair.volumeUSD)
  const volume2d =
    pair1d && pair2d
      ? Number(pair1d.volumeUSD) - Number(pair2d.volumeUSD)
      : Number(pair.volumeUSD)
  const volume1w = pair1w
    ? Number(pair.volumeUSD) - Number(pair1w.volumeUSD)
    : Number(pair.volumeUSD)
  const volume1dChange = pair1d && pair2d ? volume1d / volume2d - 1 : null

  const fees1d = pair1d
    ? Number(pair.feesUSD) - Number(pair1d.feesUSD)
    : Number(pair.feesUSD)
  const fees2d =
    pair1d && pair2d
      ? Number(pair1d.feesUSD) - Number(pair2d.feesUSD)
      : Number(pair.feesUSD)
  const fees1w = pair1w
    ? Number(pair.feesUSD) - Number(pair1w.feesUSD)
    : Number(pair.feesUSD)
  const fees1dChange = pair1d && pair2d ? fees1d / fees2d - 1 : null

  const txCount1d = pair1d
    ? Number(pair.txCount) - Number(pair1d.txCount)
    : Number(pair.txCount)
  const txCount2d =
    pair1d && pair2d
      ? Number(pair1d.txCount) - Number(pair2d.txCount)
      : Number(pair.txCount)
  const txCount1w = pair1w
    ? Number(pair.txCount) - Number(pair1w.txCount)
    : Number(pair.txCount)
  const txCount1dChange = pair1d && pair2d ? txCount1d / txCount2d - 1 : null

  const utilisation1d = pair1d ? (volume1d / pair.liquidityUSD) * 100 : 0
  const utilisation2d =
    pair1d && pair2d ? (volume2d / pair1d.liquidityUSD) * 100 : 0
  const utilisation1dChange = (utilisation1d / utilisation2d) * 100 - 100

  // TODO: calculate apr
  // const feeApr = pair?.apr
  const feeApr = 0

  return {
    ...pair,
    id: `${chainShortName[pair.chainId]}:${pair.id}`,
    // _id: `${pool.chainId}:${pool.id}`,
    address: pair.id,
    liquidity1dChange,
    liquidity1wChange,
    volume1d,
    volume1dChange,
    volume1w,
    fees1d,
    fees1dChange,
    fees1w,
    txCount1d,
    txCount1dChange,
    txCount1w,
    utilisation1d,
    utilisation2d,
    utilisation1dChange,
    feeApr,
    hourSnapshots,
    daySnapshots,
  }
}
