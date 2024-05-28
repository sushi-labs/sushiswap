import type { ResultOf } from 'gql.tada'
import type { PoolFieldsFragment } from 'src/subgraphs/sushi-v2/fragments/pool-fields'
import { withoutScientificNotation } from 'sushi/format'

type RequiredBase = Pick<
  ResultOf<typeof PoolFieldsFragment>,
  | 'token0'
  | 'token1'
  | 'reserve0'
  | 'reserve1'
  | 'totalSupply'
  | 'reserveETH'
  | 'reserveUSD'
  | 'volumeUSD'
>

export function transformPoolV2ToV3<T extends RequiredBase>(pool: T) {
  return {
    ...pool,
    swapFee: 30,
    twapEnabled: true,
    reserve0: withoutScientificNotation(
      (Number(pool.reserve0) * 10 ** Number(pool.token0.decimals)).toFixed(),
    )!
      .toString()
      .split('.')[0],
    reserve1: withoutScientificNotation(
      (Number(pool.reserve1) * 10 ** Number(pool.token1.decimals)).toFixed(),
    )!
      .toString()
      .split('.')[0],
    name: `${pool.token0.symbol}-${pool.token1.symbol}`,
    source: 'SUSHISWAP_V2',
    liquidity: withoutScientificNotation(
      (Number(pool.totalSupply) * 10 ** 18).toFixed(),
    )!
      .toString()
      .split('.')[0],
    liquidityUSD: pool.reserveUSD,
    liquidityNative: pool.reserveETH,
    apr: 0,
    aprUpdatedAtTimestamp: 0,
    feesUSD: Number(pool.volumeUSD) * 0.003,
  }
}
