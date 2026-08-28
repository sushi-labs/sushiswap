import { Amount } from 'sushi'
import {
  EvmToken,
  type EvmToken as EvmTokenType,
  Position,
  SushiSwapV3FeeAmount,
  SushiSwapV3Pool,
  TickMath,
} from 'sushi/evm'
import type { SushiV2LiquidityMode } from '../../_providers/sushi-v2/contract'

export const LAUNCH_TOKEN_TOTAL_SUPPLY_RAW = 1_000_000_000n * 10n ** 18n

export const LAUNCH_FDV_LEVELS_USD = [
  5_000, 10_000, 50_000, 100_000, 1_000_000, 5_000_000, 10_000_000, 100_000_000,
] as const

const MAX_USABLE_TICK = 887_200
const MOON_ALLOCATION_BPS = [1_500n, 1_000n, 400n, 500n, 600n, 1_000n, 5_000n]
const BPS_DENOMINATOR = 10_000n
const DUMMY_LAUNCH_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000001'

interface LaunchPosition {
  tickLower: number
  tickUpper: number
  tokenDesired: bigint
}

function getLaunchPositions({
  liquidityMode,
  fdvTicks,
}: {
  liquidityMode: SushiV2LiquidityMode
  fdvTicks: readonly number[]
}): LaunchPosition[] {
  if (fdvTicks.length !== LAUNCH_FDV_LEVELS_USD.length) return []

  if (liquidityMode === 'STANDARD') {
    const startTick = fdvTicks[0]
    return startTick === undefined
      ? []
      : [
          {
            tickLower: startTick,
            tickUpper: MAX_USABLE_TICK,
            tokenDesired: LAUNCH_TOKEN_TOTAL_SUPPLY_RAW,
          },
        ]
  }

  const moonTicks = [...fdvTicks.slice(1), MAX_USABLE_TICK]
  let allocated = 0n

  return MOON_ALLOCATION_BPS.map((allocationBps, index) => {
    const tokenDesired =
      index === MOON_ALLOCATION_BPS.length - 1
        ? LAUNCH_TOKEN_TOTAL_SUPPLY_RAW - allocated
        : (LAUNCH_TOKEN_TOTAL_SUPPLY_RAW * allocationBps) / BPS_DENOMINATOR
    allocated += tokenDesired

    return {
      tickLower: moonTicks[index] as number,
      tickUpper: moonTicks[index + 1] as number,
      tokenDesired,
    }
  })
}

export async function quoteInitialBuy({
  chainId,
  quoteToken,
  amountIn,
  liquidityMode,
  fdvTicks,
}: {
  chainId: EvmTokenType['chainId']
  quoteToken: EvmTokenType
  amountIn: bigint
  liquidityMode: SushiV2LiquidityMode
  fdvTicks: readonly number[]
}): Promise<bigint | undefined> {
  if (amountIn === 0n) return 0n

  const positions = getLaunchPositions({ liquidityMode, fdvTicks })
  const startTick = positions[0]?.tickLower
  if (startTick === undefined) return undefined

  const launchToken = new EvmToken({
    chainId,
    address: DUMMY_LAUNCH_TOKEN_ADDRESS,
    decimals: 18,
    symbol: 'LAUNCH',
    name: 'Launch token',
  })
  const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(startTick)
  const emptyPool = new SushiSwapV3Pool(
    launchToken,
    quoteToken,
    SushiSwapV3FeeAmount.HIGH,
    sqrtRatioX96,
    0n,
    startTick,
    [],
  )
  const tickLiquidity = new Map<
    number,
    { liquidityGross: bigint; liquidityNet: bigint }
  >()
  let activeLiquidity = 0n

  for (const positionConfig of positions) {
    const position = Position.fromAmounts({
      pool: emptyPool,
      tickLower: positionConfig.tickLower,
      tickUpper: positionConfig.tickUpper,
      amount0: positionConfig.tokenDesired,
      amount1: 0n,
      useFullPrecision: false,
    })

    const lower = tickLiquidity.get(positionConfig.tickLower) ?? {
      liquidityGross: 0n,
      liquidityNet: 0n,
    }
    lower.liquidityGross += position.liquidity
    lower.liquidityNet += position.liquidity
    tickLiquidity.set(positionConfig.tickLower, lower)

    const upper = tickLiquidity.get(positionConfig.tickUpper) ?? {
      liquidityGross: 0n,
      liquidityNet: 0n,
    }
    upper.liquidityGross += position.liquidity
    upper.liquidityNet -= position.liquidity
    tickLiquidity.set(positionConfig.tickUpper, upper)

    if (
      positionConfig.tickLower <= startTick &&
      startTick < positionConfig.tickUpper
    ) {
      activeLiquidity += position.liquidity
    }
  }

  const ticks = [...tickLiquidity.entries()]
    .sort(([left], [right]) => left - right)
    .map(([index, liquidity]) => ({ index, ...liquidity }))
  const pool = new SushiSwapV3Pool(
    launchToken,
    quoteToken,
    SushiSwapV3FeeAmount.HIGH,
    sqrtRatioX96,
    activeLiquidity,
    startTick,
    ticks,
  )
  const [amountOut] = await pool.getOutputAmount(
    new Amount(quoteToken, amountIn),
  )

  return amountOut.amount
}
