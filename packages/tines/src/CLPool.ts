import { BigNumber } from "@ethersproject/bignumber";
import { RPool, RToken, TYPICAL_MINIMAL_LIQUIDITY, TYPICAL_SWAP_GAS_COST } from "./PrimaryPools";

export const CL_MIN_TICK = -887272
export const CL_MAX_TICK = -CL_MIN_TICK - 1

export interface CLTick {
  index: number
  DLiquidity: number
}

export class CLRPool extends RPool {
  tickSpacing: number
  liquidity: number
  sqrtPrice: number
  nearestTick: number
  ticks: CLTick[]

  constructor(      
    address: string,
    token0: RToken,
    token1: RToken,
    fee: number,
    tickSpacing: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    liquidity: number,
    sqrtPrice: number,
    nearestTick: number,
    ticks: CLTick[]
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
    this.sqrtPrice = sqrtPrice
    this.nearestTick = nearestTick
    this.ticks = ticks
    if (this.ticks.length === 0) {
      this.ticks.push({ index: CL_MIN_TICK, DLiquidity: 0 })
      this.ticks.push({ index: CL_MAX_TICK, DLiquidity: 0 })
    }
    if (this.ticks[0].index > CL_MIN_TICK) this.ticks.unshift({ index: CL_MIN_TICK, DLiquidity: 0 })
    if (this.ticks[this.ticks.length - 1].index < CL_MAX_TICK) this.ticks.push({ index: CL_MAX_TICK, DLiquidity: 0 })
  }

  calcOutByIn(amountIn: number, direction: boolean): {out: number, gasSpent: number} {
    let nextTickToCross = direction ? this.nearestTick : this.nearestTick + 1
    let currentPrice = this.sqrtPrice
    let currentLiquidity = this.liquidity
    let outAmount = 0
    let input = amountIn
  
    while (input > 0) {
      if (nextTickToCross < 0 || nextTickToCross >= this.ticks.length)
        return {out: outAmount, gasSpent: this.swapGasCost}
  
      const nextTickPrice = Math.sqrt(Math.pow(1.0001, this.ticks[nextTickToCross].index))
      // console.log('L, P, tick, nextP', currentLiquidity,
      //     currentPrice, this.ticks[nextTickToCross].index, nextTickPrice);
      let output = 0
  
      if (direction) {
        const maxDx = (currentLiquidity * (currentPrice - nextTickPrice)) / currentPrice / nextTickPrice
        //console.log('input, maxDx', input, maxDx);
  
        if (input <= maxDx) {
          output = (currentLiquidity * currentPrice * input) / (input + currentLiquidity / currentPrice)
          input = 0
        } else {
          output = currentLiquidity * (currentPrice - nextTickPrice)
          currentPrice = nextTickPrice
          input -= maxDx
          if ( (this.ticks[nextTickToCross].index/this.tickSpacing) % 2 === 0) {
            currentLiquidity -= this.ticks[nextTickToCross].DLiquidity
          } else {
            currentLiquidity += this.ticks[nextTickToCross].DLiquidity
          }
          nextTickToCross--
        }
      } else {
        const maxDy = currentLiquidity * (nextTickPrice - currentPrice)
        //console.log('input, maxDy', input, maxDy);
        if (input <= maxDy) {
          output = input / currentPrice / (currentPrice + input / currentLiquidity)
          input = 0
        } else {
          output = (currentLiquidity * (nextTickPrice - currentPrice)) / currentPrice / nextTickPrice
          currentPrice = nextTickPrice
          input -= maxDy
          if ( (this.ticks[nextTickToCross].index/this.tickSpacing) % 2 === 0) {
            currentLiquidity += this.ticks[nextTickToCross].DLiquidity
          } else {
            currentLiquidity -= this.ticks[nextTickToCross].DLiquidity
          }
          nextTickToCross++
        }
      }
  
      outAmount += output * (1 - this.fee)
      //console.log('out', outAmount);
    }
  
    return {out: outAmount, gasSpent: this.swapGasCost}  // TODO: more accurate gas prediction 
  }

  calcInByOut(amountOut: number, direction: boolean): {inp: number, gasSpent: number} {  
    let nextTickToCross = direction ? this.nearestTick : this.nearestTick + 1
    let currentPrice = this.sqrtPrice
    let currentLiquidity = this.liquidity
    let input = 0
    let outBeforeFee = amountOut/(1-this.fee)    

    while (outBeforeFee > 0) {
      if (nextTickToCross < 0 || nextTickToCross >= this.ticks.length)
        return {inp: input, gasSpent: this.swapGasCost}
  
      const nextTickPrice = Math.sqrt(Math.pow(1.0001, this.ticks[nextTickToCross].index))
      // console.log('L, P, tick, nextP', currentLiquidity,
      //     currentPrice, this.ticks[nextTickToCross].index, nextTickPrice);
  
      if (direction) {
        const maxDy = currentLiquidity * (currentPrice - nextTickPrice)
        //console.log('input, maxDy', input, maxDy);
        if (outBeforeFee <= maxDy) {
          input += outBeforeFee / currentPrice / (currentPrice - outBeforeFee / currentLiquidity)
          outBeforeFee = 0
        } else {
          input += (currentLiquidity * (currentPrice - nextTickPrice)) / currentPrice / nextTickPrice
          currentPrice = nextTickPrice
          outBeforeFee -= maxDy
          if ( (this.ticks[nextTickToCross].index/this.tickSpacing) % 2 === 0) {
            currentLiquidity -= this.ticks[nextTickToCross].DLiquidity
          } else {
            currentLiquidity += this.ticks[nextTickToCross].DLiquidity
          }
          nextTickToCross--
        }
      } else {
        const maxDx = (currentLiquidity * (nextTickPrice - currentPrice)) / currentPrice / nextTickPrice
        //console.log('outBeforeFee, maxDx', outBeforeFee, maxDx);
  
        if (outBeforeFee <= maxDx) {
          input += (currentLiquidity * currentPrice * outBeforeFee) / (currentLiquidity / currentPrice - outBeforeFee)
          outBeforeFee = 0
        } else {
          input += currentLiquidity * (nextTickPrice - currentPrice)
          currentPrice = nextTickPrice
          outBeforeFee -= maxDx
          if ( (this.ticks[nextTickToCross].index/this.tickSpacing) % 2 === 0) {
            currentLiquidity += this.ticks[nextTickToCross].DLiquidity
          } else {
            currentLiquidity -= this.ticks[nextTickToCross].DLiquidity
          }
          nextTickToCross++
        }
      }
    }
  
    return {inp: input, gasSpent: this.swapGasCost}
  }
  
  calcCurrentPriceWithoutFee(direction: boolean): number {
    const p = this.sqrtPrice*this.sqrtPrice
    return direction ? p : 1/p
  }
}
