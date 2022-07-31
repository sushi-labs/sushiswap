import { BigNumber } from '@ethersproject/bignumber'
import { ConstantProductRPool, getBigNumber, HybridRPool, RPool, RToken, StableSwapRPool } from '../src'

const MIN_TOKEN_PRICE = 1e-6
const MAX_TOKEN_PRICE = 1e6
const STABLE_TOKEN_PRICE = 1
const MIN_POOL_RESERVE = 1e9
const MAX_POOL_RESERVE = 1e31
const MIN_POOL_IMBALANCE = 1 / (1 + 1e-3)
export const MAX_POOL_IMBALANCE = 1 + 1e-3
const MIN_LIQUIDITY = 1000
const MAX_LIQUIDITY = Math.pow(2, 110)
const MIN_HYBRID_A = 200
const MAX_HYBRID_A = 300000

export interface TToken extends RToken {
  price: number
  decimals: number
}

export interface Network {
  tokens: TToken[]
  pools: RPool[]
  gasPrice: number
}

export function createNetwork(rnd: () => number, tokenNumber: number, density: number, gasPrice: number): Network {
  const tokens = []
  for (var i = 0; i < tokenNumber; ++i) {
    tokens.push(createRandomToken(rnd, '' + i))
  }

  const pools: RPool[] = []
  for (i = 0; i < tokenNumber; ++i) {
    for (let j = i + 1; j < tokenNumber; ++j) {
      const r = rnd()
      if (r < density) {
        pools.push(getRandomPool(rnd, tokens[i], tokens[j]))
      }
      if (r < density * density) {
        // second pool
        pools.push(getRandomPool(rnd, tokens[i], tokens[j]))
      }
      if (r < density * density * density) {
        // third pool
        pools.push(getRandomPool(rnd, tokens[i], tokens[j]))
      }
      if (r < Math.pow(density, 4)) {
        // third pool
        pools.push(getRandomPool(rnd, tokens[i], tokens[j]))
      }
      if (r < Math.pow(density, 5)) {
        // third pool
        pools.push(getRandomPool(rnd, tokens[i], tokens[j]))
      }
    }
  }

  return {
    tokens,
    pools,
    gasPrice,
  }
}

function createRandomToken(rnd: () => number, name: string): TToken {
  const price = getTokenPrice(rnd)
  const decimals = price == STABLE_TOKEN_PRICE ? getRandomDecimals(rnd) : 18
  return {
    name,
    address: name,
    price,
    decimals,
    symbol: name,
  }
}

function getRandomPool(rnd: () => number, t0: TToken, t1: TToken) {
  if (Math.abs(t0.price / t1.price - 1) > 0.01) return getCPPool(rnd, t0, t1)
  if (rnd() < 0.2) return getCPPool(rnd, t0, t1)
  return getStableSwapPool(rnd, t0, t1)
}

function getRandomDecimals(rnd: () => number) {
  if (rnd() < 0.5) return 6
  return 18
}

export function getRandom(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return res
}

function getTokenPrice(rnd: () => number) {
  if (rnd() < 0.6) return STABLE_TOKEN_PRICE
  return getRandom(rnd, MIN_TOKEN_PRICE, MAX_TOKEN_PRICE)
}

function getPoolReserve(rnd: () => number) {
  return getRandom(rnd, MIN_POOL_RESERVE, MAX_POOL_RESERVE)
}

interface Variants {
  [key: string]: number
}

function choice(rnd: () => number, obj: Variants) {
  let total = 0
  Object.entries(obj).forEach(([_, p]) => (total += p))
  if (total <= 0) throw new Error('Error 62')
  const val = rnd() * total
  let past = 0
  for (const k in obj) {
    past += obj[k]
    if (past >= val) return k
  }
  throw new Error('Error 70')
}

function getPoolFee(rnd: () => number) {
  const fees = [0.003, 0.001, 0.0005]
  const cmd = choice(rnd, {
    0: 1,
    1: 1,
    2: 1,
  })
  return fees[parseInt(cmd)]
}

function getPoolImbalance(rnd: () => number) {
  return getRandom(rnd, MIN_POOL_IMBALANCE, MAX_POOL_IMBALANCE)
}

function getCPPool(rnd: () => number, t0: TToken, t1: TToken) {
  if (rnd() < 0.5) {
    const t = t0
    t0 = t1
    t1 = t
  }
  let price = t0.price / t1.price

  const fee = getPoolFee(rnd)
  const imbalance = getPoolImbalance(rnd)

  let reserve0 = getPoolReserve(rnd)
  let reserve1 = reserve0 * price * imbalance
  const maxReserve = Math.max(reserve0, reserve1)
  if (maxReserve > MAX_LIQUIDITY) {
    const reduceRate = (maxReserve / MAX_LIQUIDITY) * 1.00000001
    reserve0 /= reduceRate
    reserve1 /= reduceRate
  }
  const minReserve = Math.min(reserve0, reserve1)
  if (minReserve < MIN_LIQUIDITY) {
    const raseRate = (MIN_LIQUIDITY / minReserve) * 1.00000001
    reserve0 *= raseRate
    reserve1 *= raseRate
  }
  console.assert(reserve0 >= MIN_LIQUIDITY && reserve0 <= MAX_LIQUIDITY, 'Error reserve0 clculation')
  console.assert(reserve1 >= MIN_LIQUIDITY && reserve1 <= MAX_LIQUIDITY, 'Error reserve1 clculation ' + reserve1)

  return new ConstantProductRPool(
    `pool cp ${t0.name} ${t1.name} ${reserve0} ${price} ${fee}`,
    t0,
    t1,
    fee,
    getBigNumber(reserve0 * Math.pow(10, t0.decimals - 6)),
    getBigNumber(reserve1 * Math.pow(10, t1.decimals - 6))
  )
}

const ZERO = BigNumber.from(0)
function getStableSwapPool(rnd: () => number, t0: TToken, t1: TToken) {
  if (rnd() < 0.5) {
    const t = t0
    t0 = t1
    t1 = t
  }

  const fee = getPoolFee(rnd)
  const imbalance = getPoolImbalance(rnd)

  let reserve0 = getPoolReserve(rnd)
  let reserve1 = reserve0 * STABLE_TOKEN_PRICE * imbalance
  const maxReserve = Math.max(reserve0, reserve1)
  if (maxReserve > MAX_LIQUIDITY) {
    const reduceRate = (maxReserve / MAX_LIQUIDITY) * 1.00000001
    reserve0 /= reduceRate
    reserve1 /= reduceRate
  }
  const minReserve = Math.min(reserve0, reserve1)
  if (minReserve < MIN_LIQUIDITY) {
    const raseRate = (MIN_LIQUIDITY / minReserve) * 1.00000001
    reserve0 *= raseRate
    reserve1 *= raseRate
  }
  console.assert(reserve0 >= MIN_LIQUIDITY && reserve0 <= MAX_LIQUIDITY, 'Error reserve0 clculation')
  console.assert(reserve1 >= MIN_LIQUIDITY && reserve1 <= MAX_LIQUIDITY, 'Error reserve1 clculation ' + reserve1)

  const total0 = { base: ZERO, elastic: ZERO }
  const total1 = { base: ZERO, elastic: ZERO }

  const pool = new StableSwapRPool(
    `pool ss ${t0.name} ${t1.name} ${reserve0} ${fee}`,
    t0,
    t1,
    fee,
    getBigNumber(reserve0 * Math.pow(10, t0.decimals - 6)),
    getBigNumber(reserve1 * Math.pow(10, t1.decimals - 6)),
    t0.decimals,
    t1.decimals,
    total0,
    total1
  )
  return pool
}

function getPoolA(rnd: () => number) {
  return Math.floor(getRandom(rnd, MIN_HYBRID_A, MAX_HYBRID_A))
}

// price is always 1
function getHybridPool(rnd: () => number, t0: RToken, t1: RToken) {
  const fee = getPoolFee(rnd)
  const imbalance = getPoolImbalance(rnd)
  const A = getPoolA(rnd)

  let reserve0 = getPoolReserve(rnd)
  let reserve1 = reserve0 * STABLE_TOKEN_PRICE * imbalance
  const maxReserve = Math.max(reserve0, reserve1)
  if (maxReserve > MAX_LIQUIDITY) {
    const reduceRate = (maxReserve / MAX_LIQUIDITY) * 1.00000001
    reserve0 /= reduceRate
    reserve1 /= reduceRate
  }
  const minReserve = Math.min(reserve0, reserve1)
  if (minReserve < MIN_LIQUIDITY) {
    const raseRate = (MIN_LIQUIDITY / minReserve) * 1.00000001
    reserve0 *= raseRate
    reserve1 *= raseRate
  }
  console.assert(reserve0 >= MIN_LIQUIDITY && reserve0 <= MAX_LIQUIDITY, 'Error reserve0 clculation')
  console.assert(reserve1 >= MIN_LIQUIDITY && reserve1 <= MAX_LIQUIDITY, 'Error reserve1 clculation ' + reserve1)

  return new HybridRPool(
    `pool hb ${t0.name} ${t1.name} ${reserve0} ${1} ${fee}`,
    t0,
    t1,
    fee,
    A,
    getBigNumber(reserve0),
    getBigNumber(reserve1)
  )
}
