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

/**
 * Left shift operation using BigInt
 */
export const leftShift = (n: bigint, e: number): bigint => {
  return n << BigInt(e)
}

/**
 * Convert a value to a 32-byte hex string
 */
export const byte32 = (value: string | bigint): `0x${string}` => {
  const bn = typeof value === 'string' ? BigInt(value) : value
  return `0x${bn.toString(16).padStart(64, '0')}` as `0x${string}`
}

/**
 * Pack amount and address into a single uint256
 * @param amount - Amount as a string, e.g. '123'
 * @param address - Hex address, e.g. 0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0
 * @returns BigInt representation of packed value
 */
export const packAddressAndAmount = (
  amount: string,
  address: string,
): bigint => {
  const addressBn = BigInt(address)
  const amountBn = BigInt(amount)

  // amountAndAddress - uint256 - first 24 hexchars are a uint, last 40 are an address.
  // Interpret address as a uint256 and add the amount, leftshifted 160 bits.
  return leftShift(amountBn, 160) + addressBn
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
  const n1 = leftShift(BigInt(poolTokens), 128)
  const n2 = leftShift(BigInt(goodUntil), 32)
  const n3 = leftShift(BigInt(nDays), 8)
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
  const shiftedParity = leftShift(BigInt(parity), 255)

  return (BigInt(s) + shiftedParity).toString()
}
