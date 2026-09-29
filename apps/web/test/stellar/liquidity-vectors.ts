import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import { SqrtPriceMath, TickMath } from 'sushi/evm'
import { formatUnits } from 'viem'
import {
  calculateDependentAmount,
  getLiquidityAmounts,
  parseLiquidityAmount,
} from '../../src/app/(networks)/(non-evm)/stellar/_common/lib/utils/liquidity-amounts'
import {
  TICK_SPACINGS,
  getSqrtRatioAtTick,
} from '../../src/app/(networks)/(non-evm)/stellar/_common/lib/utils/ticks'

type Vector = {
  name: string
  fee: number
  sqrtPriceX96: bigint
  tickLower: number
  tickUpper: number
  amount0: bigint
  amount1: bigint
  liquidity: bigint
  charge0: bigint
  charge1: bigint
  expectError?: boolean
  errorCode?: number
}

const vectors: Vector[] = []

function add(
  name: string,
  fee: number,
  sqrtPriceX96: bigint,
  tickLower: number,
  tickUpper: number,
  budget0 = 10n ** 18n,
  budget1 = 10n ** 18n,
): void {
  const quote = getLiquidityAmounts(
    sqrtPriceX96,
    tickLower,
    tickUpper,
    budget0,
    budget1,
  )
  const lower = getSqrtRatioAtTick(tickLower)
  const upper = getSqrtRatioAtTick(tickUpper)
  const price =
    sqrtPriceX96 < lower ? lower : sqrtPriceX96 > upper ? upper : sqrtPriceX96
  vectors.push({
    name,
    fee,
    sqrtPriceX96,
    tickLower,
    tickUpper,
    ...quote,
    charge0: SqrtPriceMath.getAmount0Delta(price, upper, quote.liquidity, true),
    charge1: SqrtPriceMath.getAmount1Delta(lower, price, quote.liquidity, true),
    ...(quote.liquidity === 0n ? { expectError: true, errorCode: 70 } : {}),
  })
}

for (const [feeString, spacing] of Object.entries(TICK_SPACINGS)) {
  const fee = Number(feeString)
  const lower = -spacing * 10
  const upper = spacing * 10
  for (const [label, tick] of [
    ['below', lower - spacing],
    ['lower', lower],
    ['inside', -spacing],
    ['zero', 0],
    ['upper', upper],
    ['above', upper + spacing],
  ] as const) {
    add(`${fee}-${label}`, fee, getSqrtRatioAtTick(tick), lower, upper)
  }
  for (const offset of [-1n, 1n]) {
    add(
      `${fee}-negative-lower-${offset}`,
      fee,
      getSqrtRatioAtTick(lower) + offset,
      lower,
      upper,
    )
    add(
      `${fee}-negative-upper-${offset}`,
      fee,
      getSqrtRatioAtTick(-spacing) + offset,
      lower,
      -spacing,
    )
  }
  add(
    `${fee}-full-range`,
    fee,
    1n << 96n,
    Math.ceil(TickMath.MIN_TICK / spacing) * spacing,
    Math.floor(TickMath.MAX_TICK / spacing) * spacing,
  )

  // One usable tick interval is the smallest valid range for this fee tier.
  for (const tickLower of [-spacing, 0]) {
    const tickUpper = tickLower + spacing
    const sqrtLower = getSqrtRatioAtTick(tickLower)
    const sqrtUpper = getSqrtRatioAtTick(tickUpper)
    for (const [label, price] of [
      ['below', sqrtLower - 1n],
      ['lower', sqrtLower],
      ['just-inside-lower', sqrtLower + 1n],
      ['middle', getSqrtRatioAtTick(tickLower + spacing / 2)],
      ['just-inside-upper', sqrtUpper - 1n],
      ['upper', sqrtUpper],
      ['above', sqrtUpper + 1n],
    ] as const) {
      add(
        `${fee}-one-spacing-${tickLower}-${label}`,
        fee,
        price,
        tickLower,
        tickUpper,
      )
    }
  }

  // Exercise the actual dependent-field quote, preserving the independently entered amount.
  for (const field of ['token0', 'token1'] as const) {
    const price = getSqrtRatioAtTick(-spacing)
    const raw = 123456789012345678n
    const independentDecimals = field === 'token0' ? 7 : 6
    const dependentDecimals = field === 'token0' ? 6 : 7
    const paired = calculateDependentAmount(
      formatUnits(raw, independentDecimals),
      field,
      independentDecimals,
      dependentDecimals,
      price,
      lower,
      upper,
    )
    assert.equal(paired.error, undefined)
    const dependent = parseLiquidityAmount(paired.amount, dependentDecimals)
    const amount0 = field === 'token0' ? raw : dependent
    const amount1 = field === 'token1' ? raw : dependent
    add(
      `${fee}-${field}-unequal-decimals`,
      fee,
      price,
      lower,
      upper,
      amount0,
      amount1,
    )
    Object.assign(vectors[vectors.length - 1]!, { amount0, amount1 })
  }
}

add(
  'low-price-early-division',
  3000,
  getSqrtRatioAtTick(-600000),
  -600060,
  -599940,
)
add(
  'low-price-zero-intermediate',
  3000,
  getSqrtRatioAtTick(-800000),
  -800040,
  -799980,
)
add('minimum-price', 500, TickMath.MIN_SQRT_RATIO, -887270, -887260)
add('maximum-price', 500, TickMath.MAX_SQRT_RATIO - 1n, 887260, 887270)
add('one-unit-deposit', 3000, 1n << 96n, -60, 60, 1n, 1n)

vectors.push({
  name: 'candidate-u128-overflow',
  fee: 500,
  sqrtPriceX96: getSqrtRatioAtTick(887270) - 1n,
  tickLower: 887260,
  tickUpper: 887270,
  amount0: 1n,
  amount1: 10n ** 18n,
  liquidity: 0n,
  charge0: 0n,
  charge1: 0n,
  expectError: true,
  errorCode: 1017,
})
vectors.push({
  name: 'liquidity-i128-overflow',
  fee: 500,
  sqrtPriceX96: 1n << 96n,
  tickLower: -10,
  tickUpper: 10,
  amount0: 10n ** 35n,
  amount1: 10n ** 35n,
  liquidity: 0n,
  charge0: 0n,
  charge1: 0n,
  expectError: true,
  errorCode: 11,
})

const output = process.argv[2]
assert(
  output,
  'Usage: node --import tsx test/stellar/liquidity-vectors.ts OUTPUT.json',
)
writeFileSync(
  output,
  JSON.stringify(
    vectors,
    (_, value) => (typeof value === 'bigint' ? value.toString() : value),
    2,
  ),
)
console.log(`Wrote ${vectors.length} frontend quote vectors to ${output}`)
