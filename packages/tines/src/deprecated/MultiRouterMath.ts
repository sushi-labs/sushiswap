import {
  Pool,
  PoolType,
  RHybridPool,
  RWeightedPool,
} from './MultiRouterTypes'

import { BigNumber } from "@ethersproject/bignumber";
import { getBigNumber, revertPositive } from "../Utils";

const A_PRECISION = 100

const DCacheBN = new Map<Pool, BigNumber>()
export function HybridComputeLiquidity(pool: RHybridPool): BigNumber {
  const res = DCacheBN.get(pool)
  if (res !== undefined) return res

  const r0 = pool.reserve0
  const r1 = pool.reserve1

  if (r0.isZero() && r1.isZero()) {
    DCacheBN.set(pool, BigNumber.from(0))
    return BigNumber.from(0)
  }
  const s = r0.add(r1)

  const nA = BigNumber.from(pool.A * 2)

  let prevD

  let D = s
  for (let i = 0; i < 256; i++) {
    const dP = D.mul(D).div(r0).mul(D).div(r1).div(4)
    prevD = D
    D = nA
      .mul(s)
      .div(A_PRECISION)
      .add(dP.mul(2))
      .mul(D)
      .div(nA.div(A_PRECISION).sub(1).mul(D).add(dP.mul(3)))
    if (D.sub(prevD).abs().lte(1)) {
      break
    }
  }
  DCacheBN.set(pool, D)
  return D
}

export function HybridgetY(pool: RHybridPool, x: BigNumber): BigNumber {
  const D = HybridComputeLiquidity(pool)

  const nA = pool.A * 2

  let c = D.mul(D)
    .div(x.mul(2))
    .mul(D)
    .div((nA * 2) / A_PRECISION)
  let b = D.mul(A_PRECISION).div(nA).add(x)

  let yPrev
  let y = D
  for (let i = 0; i < 256; i++) {
    yPrev = y

    y = y.mul(y).add(c).div(y.mul(2).add(b).sub(D))
    if (y.sub(yPrev).abs().lte(1)) {
      break
    }
  }
  return y
}

export function calcOutByIn(pool: Pool, amountIn: number, direction = true): number {
  const xBN = direction ? pool.reserve0 : pool.reserve1
  const yBN = direction ? pool.reserve1 : pool.reserve0
  switch (pool.type) {
    case PoolType.ConstantProduct: {
      const x = parseInt(xBN.toString())
      const y = parseInt(yBN.toString())
      return (y * amountIn) / (x / (1 - pool.fee) + amountIn)
    }
    case PoolType.Weighted: {
      const x = parseInt(xBN.toString())
      const y = parseInt(yBN.toString())
      const wPool = pool as RWeightedPool
      const weightRatio = direction ? wPool.weight0 / wPool.weight1 : wPool.weight1 / wPool.weight0
      const actualIn = amountIn * (1 - pool.fee)
      const out = y * (1 - Math.pow(x / (x + actualIn), weightRatio))
      return out
    }
    case PoolType.Hybrid: {
      // const xNew = x + amountIn*(1-pool.fee);
      // const yNew = HybridgetY(pool, xNew);
      // const dy = y - yNew;

      const xNewBN = xBN.add(getBigNumber(amountIn * (1 - pool.fee)))
      const yNewBN = HybridgetY(pool as RHybridPool, xNewBN)
      const dy = parseInt(yBN.sub(yNewBN).toString())

      return dy
    }
  }
  return -1
}

export class OutOfLiquidity extends Error {}


export function calcInByOut(pool: Pool, amountOut: number, direction: boolean): number {
  let input = 0
  const xBN = direction ? pool.reserve0 : pool.reserve1
  const yBN = direction ? pool.reserve1 : pool.reserve0
  switch (pool.type) {
    case PoolType.ConstantProduct: {
      const x = parseInt(xBN.toString())
      const y = parseInt(yBN.toString())
      input = (x * amountOut) / (1 - pool.fee) / (y - amountOut)
      break
    }
    case PoolType.Weighted: {
      const x = parseInt(xBN.toString())
      const y = parseInt(yBN.toString())
      const wPool = pool as RWeightedPool
      const weightRatio = direction ? wPool.weight0 / wPool.weight1 : wPool.weight1 / wPool.weight0
      input = x * (1 - pool.fee) * (Math.pow(1 - amountOut / y, -weightRatio) - 1)
      break
    }
    case PoolType.Hybrid: {
      let yNewBN = yBN.sub(getBigNumber(amountOut))
      if (yNewBN.lt(1))
        // lack of precision
        yNewBN = BigNumber.from(1)

      const xNewBN = HybridgetY(pool as RHybridPool, yNewBN)
      input = Math.round(parseInt(xNewBN.sub(xBN).toString()) / (1 - pool.fee))

      // const yNew = y - amountOut;
      // const xNew = HybridgetY(pool, yNew);
      // input = (xNew - x)/(1-pool.fee);
      break
    }
    default:
      console.error('Unknown pool type')
  }

  // ASSERT(() => {
  //   const amount2 = calcOutByIn(pool, input, direction);
  //   const res = closeValues(amountOut, amount2, 1e-6);
  //   if (!res) console.log("Error 138:", amountOut, amount2, Math.abs(amountOut/amount2 - 1));
  //   return res;
  // });
  if (input < 1) input = 1
  return input
}

export function calcPrice(pool: Pool, amountIn: number, takeFeeIntoAccount = true): number {
  const r0 = parseInt(pool.reserve0.toString())
  const r1 = parseInt(pool.reserve1.toString())
  const oneMinusFee = takeFeeIntoAccount ? 1 - pool.fee : 1
  switch (pool.type) {
    case PoolType.ConstantProduct: {
      const x = r0 / oneMinusFee
      return (r1 * x) / (x + amountIn) / (x + amountIn)
    }
    case PoolType.Weighted: {
      const wPool = pool as RWeightedPool
      const weightRatio = wPool.weight0 / wPool.weight1
      const x = r0 + amountIn * oneMinusFee
      return (r1 * weightRatio * oneMinusFee * Math.pow(r0 / x, weightRatio)) / x
    }
    case PoolType.Hybrid: {
      const hPool = pool as RHybridPool
      const D = parseInt(HybridComputeLiquidity(hPool).toString())
      const A = hPool.A / A_PRECISION
      const x = r0 + amountIn
      const b = 4 * A * x + D - 4 * A * D
      const ac4 = (D * D * D) / x
      const Ds = Math.sqrt(b * b + 4 * A * ac4)
      const res = (0.5 - (2 * b - ac4 / x) / Ds / 4) * oneMinusFee
      return res
    }
  }
  return 0
}

function calcInputByPriceConstantMean(pool: RWeightedPool, price: number) {
  const r0 = parseInt(pool.reserve0.toString())
  const r1 = parseInt(pool.reserve1.toString())
  const weightRatio = pool.weight0 / pool.weight1
  const t = r1 * price * weightRatio * (1 - pool.fee) * Math.pow(r0, weightRatio)
  return (Math.pow(t, 1 / (weightRatio + 1)) - r0) / (1 - pool.fee)
}

export function calcInputByPrice(pool: Pool, priceEffective: number, hint = 1): number {
  switch (pool.type) {
    case PoolType.ConstantProduct: {
      const r0 = parseInt(pool.reserve0.toString())
      const r1 = parseInt(pool.reserve1.toString())
      const x = r0 / (1 - pool.fee)
      const res = Math.sqrt(r1 * x * priceEffective) - x
      return res
    }
    case PoolType.Weighted: {
      const res = calcInputByPriceConstantMean(pool as RWeightedPool, priceEffective)
      return res
    }
    case PoolType.Hybrid: {
      return revertPositive((x: number) => 1 / calcPrice(pool, x), priceEffective, hint)
    }
  }
  return 0
}
