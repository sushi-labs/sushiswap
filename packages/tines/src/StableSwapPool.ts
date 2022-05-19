import { BigNumber } from "@ethersproject/bignumber";

import { RPool, RToken} from "./PrimaryPools";
import { getBigNumber } from './Utils'

// xy(xx+yy) = k
export class StableSwapRPool extends RPool {
  k: BigNumber // set it to 0 if reserves are changed !!

  constructor(address: string, token0: RToken, token1: RToken, fee: number, reserve0: BigNumber, reserve1: BigNumber) {
    super(address, token0, token1, fee, reserve0, reserve1)
    this.k = BigNumber.from(0)
  }

  updateReserves(res0: BigNumber, res1: BigNumber) {
    this.k = BigNumber.from(0)
    this.reserve0 = res0
    this.reserve1 = res1
  }

  computeK(): BigNumber {
    if (this.k.isZero()) {
      const x = this.reserve0
      const y = this.reserve1
      this.k = x.mul(y).mul( x.mul(x).add(y.mul(y)) )
    }
    return this.k
  }

  computeY(x: BigNumber, yHint: BigNumber): BigNumber {
    const k = this.computeK()
    const x2 = x.shl(1)
    const x3 = x.mul(3)
    const xCube = x.mul(x).mul(x)
    let yPrev = yHint, y = yHint
    for (let i = 0; i < 255; ++i) {
      const ySquare = y.mul(y)
      const yCube = ySquare.mul(y)
      y = yCube.mul(x2).add(k).div( ySquare.mul(x3).add(xCube) )
      if (y.sub(yPrev).abs().lte(1)) break
      yPrev = y
    }
    return y
  }

  calcOutByIn(amountIn: number, direction: boolean): {out: number, gasSpent: number} {
    const x = direction ? this.reserve0 : this.reserve1
    const y = direction ? this.reserve1 : this.reserve0
    const xNew = x.add(getBigNumber(Math.floor(amountIn * (1 - this.fee))))
    const yNew = this.computeY(xNew, y)
    const out = parseInt(y.sub(yNew).toString()) - 1    // with precision loss compensation
    return {out: Math.max(out, 0), gasSpent: this.swapGasCost}
  }

  calcInByOut(amountOut: number, direction: boolean): {inp: number, gasSpent: number} {
    const x = direction ? this.reserve0 : this.reserve1
    const y = direction ? this.reserve1 : this.reserve0
    let yNew = y.sub(getBigNumber(Math.ceil(amountOut)))
    if (yNew.lt(this.minLiquidity))  // not possible swap
      return {inp: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost}

    const xNew = this.computeY(yNew, x)
    let input = Math.round(parseInt(xNew.sub(x).toString()) / (1 - this.fee)) + 1  // with precision loss compensation
    return {inp: input, gasSpent: this.swapGasCost}
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    const calcDirection = this.reserve0.gt(this.reserve1)
    const xBN = calcDirection ? this.reserve0 : this.reserve1
    // TODO: make x = max(x, y)
    const x = parseInt(xBN.toString())
    const k = parseInt(this.computeK().toString())
    const q = k/x/2
    const qD = -q/x                           // devivative of q
    const Q = Math.pow(x, 6)/27 + q*q
    const QD = 6*Math.pow(x, 5)/27 + 2*q*qD   // derivative of Q
    const sqrtQ = Math.sqrt(Q)
    const sqrtQD = 1/2/sqrtQ*QD               // derivative of sqrtQ
    const a = sqrtQ + q
    const aD = sqrtQD + qD
    const b = sqrtQ - q
    const bD = sqrtQD - qD
    const a3 = Math.pow(a, 1/3)
    const a3D = 1/3*a3/a*aD
    const b3 = Math.pow(b, 1/3)
    const b3D = 1/3*b3/b*bD
    const yD = a3D - b3D

    // For testing
    // const yBN = calcDirection ? this.reserve1 : this.reserve0
    // const y = parseInt(yBN.toString())
    // const yC= a3-b3
    // console.assert(Math.abs(yC/y - 1) < 1e-8)
    
    return calcDirection == direction ? -yD : -1/yD
  }

}