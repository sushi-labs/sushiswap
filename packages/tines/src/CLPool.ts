import { Address } from 'viem'

import {
  RPool,
  RToken,
  TYPICAL_MINIMAL_LIQUIDITY,
  TYPICAL_SWAP_GAS_COST,
} from './PrimaryPools'

export const CL_MIN_TICK = -887272
export const CL_MAX_TICK = -CL_MIN_TICK - 1
const ZERO = 0n

export interface CLTick {
  index: number
  DLiquidity: bigint
}

const c01 = BigInt('0xfffcb933bd6fad37aa2d162d1a594001')
const c02 = BigInt('0x100000000000000000000000000000000')
const c03 = BigInt('0xfff97272373d413259a46990580e213a')
const c04 = BigInt('0xfff2e50f5f656932ef12357cf3c7fdcc')
const c05 = BigInt('0xffe5caca7e10e4e61c3624eaa0941cd0')
const c06 = BigInt('0xffcb9843d60f6159c9db58835c926644')
const c07 = BigInt('0xff973b41fa98c081472e6896dfb254c0')
const c08 = BigInt('0xff2ea16466c96a3843ec78b326b52861')
const c09 = BigInt('0xfe5dee046a99a2a811c461f1969c3053')
const c10 = BigInt('0xfcbe86c7900a88aedcffc83b479aa3a4')
const c11 = BigInt('0xf987a7253ac413176f2b074cf7815e54')
const c12 = BigInt('0xf3392b0822b70005940c7a398e4b70f3')
const c13 = BigInt('0xe7159475a2c29b7443b29c7fa6e889d9')
const c14 = BigInt('0xd097f3bdfd2022b8845ad8f792aa5825')
const c15 = BigInt('0xa9f746462d870fdf8a65dc1f90e061e5')
const c16 = BigInt('0x70d869a156d2a1b890bb3df62baf32f7')
const c17 = BigInt('0x31be135f97d08fd981231505542fcfa6')
const c18 = BigInt('0x9aa508b5b7a84e1c677de54f3e99bc9')
const c19 = BigInt('0x5d6af8dedb81196699c329225ee604')
const c20 = BigInt('0x2216e584f5fa1ea926041bedfe98')
const c21 = BigInt('0x48a170391f7dc42444e8fa2')
const max256 = 2n ** 256n - 1n

// from CL implementation
function getSqrtRatioAtTick(tick: number): bigint {
  const absTick = Math.abs(tick)
  let ratio: bigint = (absTick & 0x1) !== 0 ? c01 : c02
  if ((absTick & 0x2) !== 0) ratio = (ratio * c03) >> 128n
  if ((absTick & 0x4) !== 0) ratio = (ratio * c04) >> 128n
  if ((absTick & 0x8) !== 0) ratio = (ratio * c05) >> 128n
  if ((absTick & 0x10) !== 0) ratio = (ratio * c06) >> 128n
  if ((absTick & 0x20) !== 0) ratio = (ratio * c07) >> 128n
  if ((absTick & 0x40) !== 0) ratio = (ratio * c08) >> 128n
  if ((absTick & 0x80) !== 0) ratio = (ratio * c09) >> 128n
  if ((absTick & 0x100) !== 0) ratio = (ratio * c10) >> 128n
  if ((absTick & 0x200) !== 0) ratio = (ratio * c11) >> 128n
  if ((absTick & 0x400) !== 0) ratio = (ratio * c12) >> 128n
  if ((absTick & 0x800) !== 0) ratio = (ratio * c13) >> 128n
  if ((absTick & 0x1000) !== 0) ratio = (ratio * c14) >> 128n
  if ((absTick & 0x2000) !== 0) ratio = (ratio * c15) >> 128n
  if ((absTick & 0x4000) !== 0) ratio = (ratio * c16) >> 128n
  if ((absTick & 0x8000) !== 0) ratio = (ratio * c17) >> 128n
  if ((absTick & 0x10000) !== 0) ratio = (ratio * c18) >> 128n
  if ((absTick & 0x20000) !== 0) ratio = (ratio * c19) >> 128n
  if ((absTick & 0x40000) !== 0) ratio = (ratio * c20) >> 128n
  if ((absTick & 0x80000) !== 0) ratio = (ratio * c21) >> 128n

  if (tick > 0) ratio = max256 / ratio
  // This divides by 1<<32 rounding up to go from a Q128.128 to a Q128.96.
  // We then downcast because we know the result always fits within 160 bits due to our tick input constraint.
  // We round up in the division so getTickAtSqrtRatio of the output price is always consistent.
  //sqrtPriceX96 = uint160((ratio >> 32) + (ratio % (1 << 32) == 0 ? 0 : 1));
  return ratio >> 32n
}

const two96 = 2 ** 96

export class CLRPool extends RPool {
  tickSpacing: number
  liquidity: bigint
  sqrtPriceX96: bigint
  nearestTick: number
  ticks: CLTick[]

  constructor(
    address: Address,
    token0: RToken,
    token1: RToken,
    fee: number,
    tickSpacing: number,
    reserve0: bigint,
    reserve1: bigint,
    liquidity: bigint,
    sqrtPriceX96: bigint,
    nearestTick: number,
    ticks: CLTick[],
  ) {
    super(
      address,
      token0,
      token1,
      fee,
      reserve0,
      reserve1,
      TYPICAL_MINIMAL_LIQUIDITY,
      TYPICAL_SWAP_GAS_COST,
    )
    this.tickSpacing = tickSpacing
    this.liquidity = liquidity
    this.sqrtPriceX96 = sqrtPriceX96
    this.nearestTick = nearestTick
    this.ticks = ticks
    if (this.ticks.length === 0) {
      this.ticks.push({ index: CL_MIN_TICK, DLiquidity: ZERO })
      this.ticks.push({ index: CL_MAX_TICK, DLiquidity: ZERO })
    }
    if ((this.ticks[0] as CLTick).index > CL_MIN_TICK)
      this.ticks.unshift({ index: CL_MIN_TICK, DLiquidity: ZERO })
    if ((this.ticks[this.ticks.length - 1] as CLTick).index < CL_MAX_TICK)
      this.ticks.push({ index: CL_MAX_TICK, DLiquidity: ZERO })
  }

  calcOutByIn(
    amountIn: number,
    direction: boolean,
  ): { out: number; gasSpent: number } {
    let nextTickToCross = direction ? this.nearestTick : this.nearestTick + 1
    const currentPriceBI = this.sqrtPriceX96
    let currentPrice = parseInt(currentPriceBI.toString()) / two96
    let currentLiquidityBI = this.liquidity
    let outAmount = 0
    let input = amountIn

    let startFlag = true
    while (input > 0) {
      if (nextTickToCross < 0 || nextTickToCross >= this.ticks.length)
        return { out: outAmount, gasSpent: this.swapGasCost }

      const tick = this.ticks[nextTickToCross] as CLTick
      let nextTickPrice
      let priceDiff
      if (startFlag) {
        // Increasing precision at first step only - otherwise its too slow
        const nextTickPriceBI = getSqrtRatioAtTick(tick.index)
        nextTickPrice = parseInt(nextTickPriceBI.toString()) / two96
        priceDiff =
          parseInt((currentPriceBI - nextTickPriceBI).toString()) / two96
        startFlag = false
      } else {
        nextTickPrice = Math.sqrt(1.0001 ** tick.index)
        priceDiff = currentPrice - nextTickPrice
      }

      // console.log('L, P, tick, nextP', currentLiquidity,
      //     currentPrice, this.ticks[nextTickToCross].index, nextTickPrice);
      let output = 0
      const currentLiquidity = parseInt(currentLiquidityBI.toString())

      if (direction) {
        const maxDx =
          (currentLiquidity * priceDiff) / currentPrice / nextTickPrice
        //console.log('input, maxDx', input, maxDx);

        if (input <= maxDx) {
          output =
            (currentLiquidity * currentPrice * input) /
            (input + currentLiquidity / currentPrice)
          input = 0
        } else {
          output = currentLiquidity * priceDiff
          //currentPriceBI = nextTickPriceBI
          currentPrice = nextTickPrice
          input -= maxDx
          if ((tick.index / this.tickSpacing) % 2 === 0) {
            currentLiquidityBI = currentLiquidityBI - tick.DLiquidity
          } else {
            currentLiquidityBI = currentLiquidityBI + tick.DLiquidity
          }
          nextTickToCross--
        }
      } else {
        const maxDy = currentLiquidity * -priceDiff
        //console.log('input, maxDy', input, maxDy);
        if (input <= maxDy) {
          output =
            input / currentPrice / (currentPrice + input / currentLiquidity)
          input = 0
        } else {
          output =
            (currentLiquidity * -priceDiff) / currentPrice / nextTickPrice
          //currentPriceBI = nextTickPriceBI
          currentPrice = nextTickPrice
          input -= maxDy
          if ((tick.index / this.tickSpacing) % 2 === 0) {
            currentLiquidityBI = currentLiquidityBI + tick.DLiquidity
          } else {
            currentLiquidityBI = currentLiquidityBI - tick.DLiquidity
          }
          nextTickToCross++
        }
      }

      outAmount += output * (1 - this.fee)
      //console.log('out', outAmount);
    }

    // TODO: to add minimal limit check!

    return { out: outAmount, gasSpent: this.swapGasCost } // TODO: more accurate gas prediction
  }

  calcInByOut(
    amountOut: number,
    direction: boolean,
  ): { inp: number; gasSpent: number } {
    let nextTickToCross = direction ? this.nearestTick : this.nearestTick + 1
    const currentPriceBI = this.sqrtPriceX96
    let currentPrice = parseInt(currentPriceBI.toString()) / two96
    let currentLiquidityBI = this.liquidity
    let input = 0
    let outBeforeFee = amountOut / (1 - this.fee)

    let startFlag = true
    while (outBeforeFee > 0) {
      if (nextTickToCross < 0 || nextTickToCross >= this.ticks.length)
        return { inp: input, gasSpent: this.swapGasCost }

      const nextTick = this.ticks[nextTickToCross] as CLTick
      let nextTickPrice
      let priceDiff
      if (startFlag) {
        // Increasing precision at first step only - otherwise its too slow
        const nextTickPriceBI = getSqrtRatioAtTick(nextTick.index)
        nextTickPrice = parseInt(nextTickPriceBI.toString()) / two96
        priceDiff =
          parseInt((currentPriceBI - nextTickPriceBI).toString()) / two96
        startFlag = false
      } else {
        nextTickPrice = Math.sqrt(1.0001 ** nextTick.index)
        priceDiff = currentPrice - nextTickPrice
      }

      // console.log('L, P, tick, nextP', currentLiquidity,
      //     currentPrice, this.ticks[nextTickToCross].index, nextTickPrice);
      const currentLiquidity = parseInt(currentLiquidityBI.toString())

      if (direction) {
        const maxDy = currentLiquidity * priceDiff
        //console.log('input, maxDy', input, maxDy);
        if (outBeforeFee <= maxDy) {
          input +=
            outBeforeFee /
            currentPrice /
            (currentPrice - outBeforeFee / currentLiquidity)
          outBeforeFee = 0
        } else {
          input += (currentLiquidity * priceDiff) / currentPrice / nextTickPrice
          //currentPriceBI = nextTickPriceBI
          currentPrice = nextTickPrice
          outBeforeFee -= maxDy
          if ((nextTick.index / this.tickSpacing) % 2 === 0) {
            currentLiquidityBI = currentLiquidityBI - nextTick.DLiquidity
          } else {
            currentLiquidityBI = currentLiquidityBI + nextTick.DLiquidity
          }
          nextTickToCross--
        }
      } else {
        const maxDx =
          (currentLiquidity * -priceDiff) / currentPrice / nextTickPrice
        //console.log('outBeforeFee, maxDx', outBeforeFee, maxDx);

        if (outBeforeFee <= maxDx) {
          input +=
            (currentLiquidity * currentPrice * outBeforeFee) /
            (currentLiquidity / currentPrice - outBeforeFee)
          outBeforeFee = 0
        } else {
          input += currentLiquidity * -priceDiff
          //currentPriceBI = nextTickPriceBI
          currentPrice = nextTickPrice
          outBeforeFee -= maxDx
          if ((nextTick.index / this.tickSpacing) % 2 === 0) {
            currentLiquidityBI = currentLiquidityBI + nextTick.DLiquidity
          } else {
            currentLiquidityBI = currentLiquidityBI - nextTick.DLiquidity
          }
          nextTickToCross++
        }
      }
    }

    return { inp: input, gasSpent: this.swapGasCost }
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    const currentPrice = parseInt(this.sqrtPriceX96.toString()) / two96
    const p = currentPrice * currentPrice
    return direction ? p : 1 / p
  }
}
