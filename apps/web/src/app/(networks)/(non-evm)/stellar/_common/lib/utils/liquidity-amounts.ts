import { Price } from 'sushi'
import {
  FullMath,
  SqrtPriceMath,
  TickMath,
  encodeSqrtRatioX96,
  maxLiquidityForAmounts,
} from 'sushi/evm'
import type { StellarToken } from 'sushi/stellar'
import { formatUnits, parseUnits } from 'viem'
import { getSqrtRatioAtTick } from './ticks'

export type LiquidityField = 'token0' | 'token1'
export type DependentAmount = {
  amount: string
  status: 'idle' | 'below-range' | 'above-range' | 'within-range' | 'error'
  error?: string
}

const MAX_AMOUNT = (1n << 127n) - 1n
const MAX_U128 = (1n << 128n) - 1n

export function parseLiquidityAmount(value: string, decimals: number): bigint {
  if (
    !Number.isInteger(decimals) ||
    decimals < 0 ||
    decimals > 255 ||
    !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) ||
    (value.split('.')[1]?.length ?? 0) > decimals
  ) {
    throw new Error('Enter a valid amount within the token precision')
  }
  const amount = parseUnits(value, decimals)
  if (amount > MAX_AMOUNT)
    throw new Error('Amount exceeds the Stellar token limit')
  return amount
}

export function parseStartingPrice(
  token0: StellarToken,
  token1: StellarToken,
  value: string,
  inverted = false,
): bigint | undefined {
  const price = Price.tryFromHuman(
    inverted ? token1 : token0,
    inverted ? token0 : token1,
    value,
  )
  if (!price || price.numerator <= 0n) return undefined
  const canonical = inverted ? price.invert() : price
  const sqrtPrice = encodeSqrtRatioX96(
    canonical.numerator,
    canonical.denominator,
  )
  return sqrtPrice >= TickMath.MIN_SQRT_RATIO &&
    sqrtPrice < TickMath.MAX_SQRT_RATIO
    ? sqrtPrice
    : undefined
}

export function poolPrice(
  token0: StellarToken,
  token1: StellarToken,
  sqrtPriceX96: bigint,
  inverted = false,
): Price<StellarToken, StellarToken> {
  const price = new Price({
    base: token0,
    quote: token1,
    numerator: sqrtPriceX96 * sqrtPriceX96,
    denominator: 1n << 192n,
  })
  return inverted ? price.invert() : price
}

/** Deposit caps that reproduce the position manager’s liquidity after rounding. */
export function getLiquidityAmounts(
  sqrtPriceX96: bigint,
  tickLower: number,
  tickUpper: number,
  amount0: bigint,
  amount1: bigint,
): { amount0: bigint; amount1: bigint; liquidity: bigint } {
  if (
    sqrtPriceX96 < TickMath.MIN_SQRT_RATIO ||
    sqrtPriceX96 >= TickMath.MAX_SQRT_RATIO ||
    !Number.isInteger(tickLower) ||
    !Number.isInteger(tickUpper) ||
    tickLower < TickMath.MIN_TICK ||
    tickUpper > TickMath.MAX_TICK ||
    tickLower >= tickUpper ||
    amount0 < 0n ||
    amount1 < 0n
  ) {
    throw new Error('Invalid liquidity price, range, or amount')
  }
  const lower = getSqrtRatioAtTick(tickLower)
  const upper = getSqrtRatioAtTick(tickUpper)
  const price =
    sqrtPriceX96 < lower ? lower : sqrtPriceX96 > upper ? upper : sqrtPriceX96
  const liquidity = maxLiquidityForAmounts(
    price,
    lower,
    upper,
    amount0,
    amount1,
    // Match the position manager: floor sqrtA * sqrtB / Q96 first.
    false,
  )
  return {
    liquidity,
    // Invert the periphery's rounded intermediate, not the core's token delta.
    // The core can charge less, but these caps preserve liquidity on resubmission.
    amount0:
      liquidity === 0n || price === upper
        ? 0n
        : FullMath.mulDivRoundingUp(
            liquidity,
            upper - price,
            (price * upper) / (1n << 96n),
          ),
    amount1: SqrtPriceMath.getAmount1Delta(lower, price, liquidity, true),
  }
}

export function calculateDependentAmount(
  amount: string,
  field: LiquidityField,
  independentDecimals: number,
  dependentDecimals: number,
  sqrtPriceX96: bigint,
  tickLower: number,
  tickUpper: number,
): DependentAmount {
  try {
    if (!amount) return { amount: '', status: 'idle' }
    const raw = parseLiquidityAmount(amount, independentDecimals)
    const amounts = getLiquidityAmounts(
      sqrtPriceX96,
      tickLower,
      tickUpper,
      field === 'token0' ? raw : MAX_AMOUNT,
      field === 'token1' ? raw : MAX_AMOUNT,
    )
    if (amounts.liquidity > MAX_AMOUNT)
      throw new Error('Liquidity exceeds the Stellar mint limit')
    const lower = getSqrtRatioAtTick(tickLower)
    const upper = getSqrtRatioAtTick(tickUpper)
    const status =
      sqrtPriceX96 <= lower
        ? 'below-range'
        : sqrtPriceX96 >= upper
          ? 'above-range'
          : 'within-range'
    const wrongSide =
      (status === 'below-range' && field === 'token1') ||
      (status === 'above-range' && field === 'token0')
    if (wrongSide)
      return {
        amount: '0',
        status,
        error: 'Enter an amount for the token required by this range',
      }
    if (raw === 0n || amounts.liquidity === 0n)
      return { amount: '0', status: 'error', error: 'Enter a larger amount' }
    // The manager checks each candidate fits u128 before taking their minimum.
    // Validate submitted amounts here; the internal MAX_AMOUNT budget is a sentinel.
    if (
      status === 'within-range' &&
      (maxLiquidityForAmounts(
        sqrtPriceX96,
        sqrtPriceX96,
        upper,
        field === 'token0' ? raw : amounts.amount0,
        0n,
        false,
      ) > MAX_U128 ||
        maxLiquidityForAmounts(
          sqrtPriceX96,
          lower,
          sqrtPriceX96,
          0n,
          field === 'token1' ? raw : amounts.amount1,
          false,
        ) > MAX_U128)
    ) {
      throw new Error('Deposit exceeds the Stellar liquidity calculation limit')
    }
    const dependent = field === 'token0' ? amounts.amount1 : amounts.amount0
    return { amount: formatUnits(dependent, dependentDecimals), status }
  } catch (error) {
    return {
      amount: '',
      status: 'error',
      error:
        error instanceof Error
          ? error.message
          : 'Unable to calculate liquidity',
    }
  }
}
