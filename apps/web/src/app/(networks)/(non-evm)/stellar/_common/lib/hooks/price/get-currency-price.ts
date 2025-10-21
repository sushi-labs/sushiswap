import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import type { Token } from '~stellar/_common/lib/types/token.type'

export function getCurrencyPrice(
  currency: Token,
  defaultStable: Token, // i.e. USDC
  native: Token, // i.e. XLM
  nativePool: PoolInfo | null, // i.e. token <-> XLM
  stableNativePool: PoolInfo | null, // i.e. USDC <-> XLM
  stablePools: (PoolInfo | null)[],
): number | undefined {
  if (!currency || !defaultStable || !native) {
    return undefined
  }

  const bestStablePool = stablePools.filter(Boolean).sort((a, b) => {
    if (!a || !b) return 0
    const aLiquidity = Number(a.liquidity.amount)
    const bLiquidity = Number(b.liquidity.amount)
    return bLiquidity - aLiquidity
  })[0]

  // If currency is native XLM, get price from XLM/USDC pool
  if (currency.contract === native.contract) {
    if (bestStablePool) {
      const price = priceOf(bestStablePool, native)
      return price
    }
    return undefined
  }

  if (currency.contract === defaultStable.contract) {
    return 1
  }

  const isNativePoolValid =
    nativePool &&
    Number(nativePool.reserves.token0.amount) > 0 &&
    Number(nativePool.reserves.token1.amount) > 0

  const isStableNativePoolValid =
    stableNativePool &&
    Number(stableNativePool.reserves.token0.amount) > 0 &&
    Number(stableNativePool.reserves.token1.amount) > 0

  if (bestStablePool) {
    const stablePoolLiquidity = Number(bestStablePool.liquidity.amount)
    const nativePoolLiquidity = nativePool
      ? Number(nativePool.liquidity.amount)
      : 0

    // Use stable pool if it has more liquidity
    if (stablePoolLiquidity > nativePoolLiquidity) {
      const price = priceOf(bestStablePool, currency)
      return price
    }
  }

  // token -> XLM -> USDC
  if (isNativePoolValid && isStableNativePoolValid) {
    // priceOf(token/XLM, token) => XLM/token
    const currencyNativePrice = priceOf(nativePool, currency)
    // priceOf(USDC/XLM, XLM) => USDC/XLM
    const nativeStablePrice = priceOf(stableNativePool, native)
    // XLM/token * USDC/XLM => UDSC/token
    const stablePrice = currencyNativePrice * nativeStablePrice
    return stablePrice
  }

  return undefined
}

function priceOf(pool: PoolInfo, token: Token): number {
  const isToken0 = pool.token0.contract === token.contract

  if (isToken0) {
    const reserve0 = Number(pool.reserves.token0.amount)
    const reserve1 = Number(pool.reserves.token1.amount)
    return (
      (reserve1 * 10 ** pool.token0.decimals) /
      (reserve0 * 10 ** pool.token1.decimals)
    )
  } else {
    const reserve0 = Number(pool.reserves.token0.amount)
    const reserve1 = Number(pool.reserves.token1.amount)
    return (
      (reserve0 * 10 ** pool.token1.decimals) /
      (reserve1 * 10 ** pool.token0.decimals)
    )
  }
}
