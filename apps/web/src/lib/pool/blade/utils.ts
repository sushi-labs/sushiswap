import type { BladeChainId, BladePool } from '@sushiswap/graph-client/data-api'
import { Native, Token, type Type } from 'sushi/currency'
import { BLADE_STABLES } from './stables'
import type { BladePoolAsset } from './types'

export type BladePoolTokensGrouped = {
  tokens: Type[]
  stablecoinUsdTokens: Type[]
}

export function getPoolTokensGrouped(pool: BladePool): BladePoolTokensGrouped {
  const chainId = pool.chainId as BladeChainId
  const stablecoinSet = new Set<string>(
    BLADE_STABLES[chainId]?.map((s) => s.address.toLowerCase()) || [],
  )

  return pool.tokens.reduce<BladePoolTokensGrouped>(
    (acc, tokenData) => {
      if (tokenData.targetWeight === 0) return acc
      const token =
        tokenData.token.address.toLowerCase() ===
        Native.onChain(chainId).wrapped.address.toLowerCase()
          ? Native.onChain(chainId)
          : new Token({
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

export function getPoolAssets(
  pool: BladePool,
  options?: {
    showStableCoins?: boolean
  },
): BladePoolAsset[] {
  const { showStableCoins = true } = options ?? {}
  const chainId = pool.chainId as BladeChainId
  const stablecoinSet = new Set<string>(
    BLADE_STABLES[chainId]?.map((s) => s.address.toLowerCase()) || [],
  )

  const assets: BladePoolAsset[] = []
  const stablecoinAssetMap = new Map<'USD', BladePoolAsset>()

  for (const { token: tokenData, ...rest } of pool.tokens) {
    if (
      !showStableCoins &&
      stablecoinSet.has(tokenData.address.toLowerCase())
    ) {
      let stablecoinAsset = stablecoinAssetMap.get('USD')
      if (!stablecoinAsset) {
        stablecoinAsset = {
          ...rest,
          stablecoin: 'USD',
        }
      } else {
        stablecoinAsset.liquidityUSD += rest.liquidityUSD
        stablecoinAsset.targetWeight += rest.targetWeight
        stablecoinAsset.weight += rest.weight
      }
      stablecoinAssetMap.set('USD', stablecoinAsset)
    } else {
      const token =
        tokenData.address.toLowerCase() ===
        Native.onChain(chainId).wrapped.address.toLowerCase()
          ? Native.onChain(chainId)
          : new Token({
              chainId,
              address: tokenData.address,
              decimals: tokenData.decimals,
              symbol: tokenData.symbol,
              name: tokenData.name,
            })
      assets.push({
        ...rest,
        token,
      })
    }
  }

  return [...assets, ...stablecoinAssetMap.values()]
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
