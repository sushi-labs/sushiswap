import { chainShortName } from '@sushiswap/chain'

import { Farm, Pair } from '../.graphclient'
import { transformFarm } from './transformFarm'

export function transformPair({
  pair,
  pair1d,
  pair2d,
  pair1w,
  farm,
}: {
  pair: Pair
  pair1d?: Pair
  pair2d?: Pair
  pair1w?: Pair
  farm?: Farm
}) {
  const volume1d = pair1d ? Number(pair.volumeUSD) - Number(pair1d.volumeUSD) : 0
  const volume2d = pair1d && pair2d ? Number(pair1d.volumeUSD) - Number(pair2d.volumeUSD) : 0
  const volume1w = pair1w ? Number(pair.volumeUSD) - Number(pair1w.volumeUSD) : 0
  const fees1d = pair1d ? Number(pair.feesUSD) - Number(pair1d.feesUSD) : 0
  const fees2d = pair1d && pair2d ? Number(pair1d.feesUSD) - Number(pair2d.feesUSD) : 0
  const fees1w = pair1w ? Number(pair.feesUSD) - Number(pair1w.feesUSD) : 0
  const feeApr = pair?.apr
  const incentiveApr =
    farm?.incentives?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.apr), 0) ?? 0
  const apr = Number(feeApr) + Number(incentiveApr)
  return {
    ...pair,
    id: `${chainShortName[pair.chainId]}:${pair.id}`,
    // _id: `${pool.chainId}:${pool.id}`,
    address: pair.id,
    // address: pool.id,
    volume1d,
    volume1w,
    fees1w,
    fees1d,
    apr,
    feeApr,
    incentiveApr,
    farm: transformFarm(farm),
  }
}
