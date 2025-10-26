import type { BladeChainId, BladePool } from '@sushiswap/graph-client/data-api'
import {
  type EvmAddress,
  type EvmCurrency,
  EvmNative,
  EvmToken,
} from 'sushi/evm'
import type { Hex } from 'viem'
import { BLADE_STABLES } from './stables'
import type { BladePoolAsset } from './types'

export type BladePoolTokensGrouped = {
  tokens: EvmCurrency[]
  stablecoinUsdTokens: EvmCurrency[]
}

export function getPoolTokensGrouped(pool: BladePool): BladePoolTokensGrouped {
  const chainId = pool.chainId as BladeChainId
  const stablecoinSet = new Set<EvmAddress>(
    BLADE_STABLES[chainId]?.map((s) => s.address) || [],
  )

  return pool.tokens.reduce<BladePoolTokensGrouped>(
    (acc, tokenData) => {
      if (tokenData.targetWeight === 0) return acc
      const token =
        tokenData.token.address.toLowerCase() ===
        EvmNative.fromChainId(chainId).wrap().address
          ? EvmNative.fromChainId(chainId)
          : new EvmToken({
              chainId,
              address: tokenData.token.address as EvmAddress,
              decimals: tokenData.token.decimals,
              symbol: tokenData.token.symbol,
              name: tokenData.token.name,
            })

      if (
        stablecoinSet.has(tokenData.token.address.toLowerCase() as EvmAddress)
      ) {
        acc.stablecoinUsdTokens.push(token)
      } else {
        acc.tokens.push(token)
      }
      return acc
    },
    { tokens: [], stablecoinUsdTokens: [] },
  )
}

/**
 * Return the assets of a pool.
 *
 * If showStableTypes is true, then the assets will include the stablecoin assets.
 * If showStableTypes is false, then the assets will not include the stablecoin assets
 * and the stablecoin assets will be grouped under the USD asset.
 */
export function getPoolAssets(
  pool: BladePool,
  options?: {
    showStableTypes?: boolean
  },
): BladePoolAsset[] {
  const { showStableTypes = true } = options ?? {}
  const chainId = pool.chainId
  const stablecoinSet = new Set<EvmAddress>(
    BLADE_STABLES[chainId]?.map((s) => s.address) || [],
  )

  const assets: BladePoolAsset[] = []
  const stablecoinAssetMap = new Map<'USD', BladePoolAsset>()

  for (const { token: tokenData, priceUSD, ...rest } of pool.tokens) {
    if (
      !showStableTypes &&
      stablecoinSet.has(tokenData.address.toLowerCase() as EvmAddress)
    ) {
      let stablecoinAsset = stablecoinAssetMap.get('USD')
      if (!stablecoinAsset) {
        stablecoinAsset = {
          ...rest,
          stablecoin: 'USD',
          priceUSD,
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
        EvmNative.fromChainId(chainId).wrap().address
          ? EvmNative.fromChainId(chainId)
          : new EvmToken({
              chainId,
              address: tokenData.address as EvmAddress,
              decimals: tokenData.decimals,
              symbol: tokenData.symbol,
              name: tokenData.name,
            })
      assets.push({
        ...rest,
        token,
        priceUSD,
      })
    }
  }

  return [...assets, ...stablecoinAssetMap.values()]
}

type GetPoolNameOptions = {
  showStableTypes?: boolean
}

export function getPoolNameFromGroupedTokens(
  groupedTokens: BladePoolTokensGrouped,
  options?: GetPoolNameOptions,
): string {
  const { tokens, stablecoinUsdTokens } = groupedTokens
  const { showStableTypes = true } = options ?? {}
  const hasStablecoin = stablecoinUsdTokens.length > 0
  const poolName = [
    ...tokens.map((token) => token.symbol),
    ...(hasStablecoin && !showStableTypes
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

/**
 * Convert a value to a 32-byte hex string
 */
export const byte32 = (value: string | bigint): Hex => {
  const bn = typeof value === 'string' ? BigInt(value) : value
  return `0x${bn.toString(16).padStart(64, '0')}`
}

/**
 * Pack amount and address into a single uint256
 * @param amount - Amount as a string, e.g. '123'
 * @param address - Hex address, e.g. 0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0
 * @returns BigInt representation of packed value
 */
export const packAddressAndAmount = (
  amount: string,
  address: EvmAddress,
): bigint => {
  const addressBn = BigInt(address)
  const amountBn = BigInt(amount)

  // amountAndAddress - uint256 - first 24 hexchars are a uint, last 40 are an address.
  // Interpret address as a uint256 and add the amount, leftshifted 160 bits.
  return (amountBn << 160n) + addressBn
}

/**
 * Pack RFQ configuration into a single uint256
 * @param poolTokens - Pool tokens as string
 * @param goodUntil - Good until timestamp
 * @param nDays - Number of days or lock time
 * @param v - Signature v value
 * @returns BigInt representation of packed value
 */
export const packRfqConfig = (
  poolTokens: string,
  goodUntil: number,
  nDays: number,
  v: number,
): bigint => {
  const n1 = BigInt(poolTokens) << 128n
  const n2 = BigInt(goodUntil) << 32n
  const n3 = BigInt(nDays) << 8n
  const n4 = BigInt(v)

  return n1 + n2 + n3 + n4
}

/**
 * Shorten signature by combining s and v values
 * @param s - Signature s value
 * @param v - Signature v value
 * @returns String representation of shortened signature
 */
export const shortenSignature = (s: string, v: number): string => {
  const parity = v - 27
  const shiftedParity = BigInt(parity) << 255n

  return (BigInt(s) + shiftedParity).toString()
}
