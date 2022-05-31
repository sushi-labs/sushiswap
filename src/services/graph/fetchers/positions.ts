import { ChainId, Token } from '@sushiswap/core-sdk'
import { PoolType } from '@sushiswap/trident-sdk'
import { fetcher, TridentPoolData } from 'app/services/graph'
import { getTridentPositionsQuery } from 'app/services/graph/queries'

interface TridentPositionQueryResult {
  liquidityPositions?: TridentPosition[]
}

interface TridentPosition {
  balance: string
  id: string
  pool: TridentPoolData
}

export interface TridentPositionRow {
  id: string
  assets: Token[]
  type: PoolType
  swapFeePercent: number
  twapEnabled: boolean
  value: number
  apy: string
  legacy?: boolean
}

const formatPositions = (chainId: ChainId, { liquidityPositions }: TridentPositionQueryResult) => {
  return (liquidityPositions || []).map(({ balance, pool }) => {
    const tokens = pool.assets.map(
      ({ token: { id, name, symbol, decimals } }) => new Token(chainId, id, Number(decimals), symbol, name)
    )

    const type =
      pool.__typename === 'ConstantProductPool'
        ? PoolType.ConstantProduct
        : pool.__typename === 'ConcentratedLiquidityPool'
        ? PoolType.ConcentratedLiquidity
        : pool.__typename === 'HybridPool'
        ? PoolType.Hybrid
        : pool.__typename === 'IndexPool'
        ? PoolType.Weighted
        : undefined

    if (!type) {
      throw new Error('Pool type not recognized')
    }

    return {
      id: pool.id,
      assets: tokens,
      type,
      swapFeePercent: Number(pool.swapFee) / 100,
      twapEnabled: Boolean(pool.twapEnabled),
      value: (Number(balance) / Number(pool.kpi.liquidity)) * Number(pool.kpi.liquidityUSD),
      apy: '',
    }
  })
}

export const getTridentPositions = async (
  chainId: ChainId = ChainId.ETHEREUM,
  variables: undefined
): Promise<TridentPositionRow[]> => {
  const result: TridentPositionQueryResult = await fetcher(chainId, getTridentPositionsQuery, variables)
  return formatPositions(chainId, result)
}
