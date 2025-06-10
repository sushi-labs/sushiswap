import type { BladeChainId, BladePool } from '@sushiswap/graph-client/data-api'
import { Token } from 'sushi/currency'
import { BLADE_STABLES } from './stables'

export type BladePoolTokensGrouped = {
  tokens: Token[]
  stablecoinUsdTokens: Token[]
}

export function getPoolTokensGrouped(pool: BladePool): BladePoolTokensGrouped {
  const chainId = pool.chainId as BladeChainId
  const stablecoinSet = new Set<string>(
    BLADE_STABLES[chainId]?.map((s) => s.address.toLowerCase()) || [],
  )

  return pool.tokens.reduce<BladePoolTokensGrouped>(
    (acc, tokenData) => {
      const token = new Token({
        chainId,
        address: tokenData.token.address,
        decimals: tokenData.token.decimals,
        symbol: tokenData.token.symbol,
        name: tokenData.token.name,
      })
      if (stablecoinSet.has(tokenData.token.address.toLowerCase())) {
        acc.stablecoinUsdTokens.push(token)
      } else {
        acc.tokens.push(token)
      }
      return acc
    },
    { tokens: [], stablecoinUsdTokens: [] },
  )
}

type GetPoolNameOptions = {
  showStableCoins?: boolean
}

export function getPoolNameFromGroupedTokens(
  groupedTokens: BladePoolTokensGrouped,
  options?: GetPoolNameOptions,
): string {
  const { tokens, stablecoinUsdTokens } = groupedTokens
  const { showStableCoins = true } = options ?? {}
  const hasStablecoin = stablecoinUsdTokens.length > 0
  const poolName = [
    ...tokens.map((token) => token.symbol),
    ...(hasStablecoin && !showStableCoins
      ? ['USD']
      : stablecoinUsdTokens.map((token) => token.symbol)),
  ].join('/')
  return poolName
}

export function getPoolName(
  pool: BladePool,
  options?: GetPoolNameOptions,
): string {
  const { tokens, stablecoinUsdTokens } = getPoolTokensGrouped(pool)
  return getPoolNameFromGroupedTokens({ tokens, stablecoinUsdTokens }, options)
}
