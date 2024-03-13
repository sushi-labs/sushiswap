import { Address } from 'viem'
import { expect } from 'vitest'
import {
  BridgeStargateV04OneWay,
  BridgeUnlimited,
  ConstantProductRPool,
  HybridRPool,
  MultiRoute,
  NetworkInfo,
  RPool,
  RToken,
  RouteLeg,
  RouteStatus,
  StableSwapRPool,
  closeValues,
  getBigInt,
} from '../../src/tines/index.js'

const MIN_TOKEN_PRICE = 1e-6
const MAX_TOKEN_PRICE = 1e6
const STABLE_TOKEN_PRICE = 1
const MIN_POOL_RESERVE = 1e9
const MAX_POOL_RESERVE = 1e31
const MIN_POOL_IMBALANCE = 1 / (1 + 1e-3)
export const MAX_POOL_IMBALANCE = 1 + 1e-3
const MIN_LIQUIDITY = 1000
const MAX_LIQUIDITY = 2 ** 110
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

export function createNetwork(
  rnd: () => number,
  tokenNumber: number,
  density: number,
  gasPrice: number,
  garantedStableTokens = 1,
): Network {
  const tokens: TToken[] = []
  for (let i = 0; i < tokenNumber; ++i) {
    tokens.push(createRandomToken(rnd, `${i}`, i < garantedStableTokens))
  }

  const pools: RPool[] = []
  for (let i = 0; i < tokenNumber; ++i) {
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
      if (r < density ** 4) {
        // third pool
        pools.push(getRandomPool(rnd, tokens[i], tokens[j]))
      }
      if (r < density ** 5) {
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

function createRandomToken(
  rnd: () => number,
  name: string,
  stablePriceGaranted = false,
): TToken {
  const price = stablePriceGaranted ? STABLE_TOKEN_PRICE : getTokenPrice(rnd)
  const decimals = price === STABLE_TOKEN_PRICE ? getRandomDecimals(rnd) : 18
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
  if (rnd() < 0.4) return STABLE_TOKEN_PRICE
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
  Object.entries(obj).forEach(([, p]) => {
    total += p
  })
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
  const price = t0.price / t1.price

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
  console.assert(
    reserve0 >= MIN_LIQUIDITY && reserve0 <= MAX_LIQUIDITY,
    'Error reserve0 clculation',
  )
  console.assert(
    reserve1 >= MIN_LIQUIDITY && reserve1 <= MAX_LIQUIDITY,
    `Error reserve1 clculation ${reserve1}`,
  )

  return new ConstantProductRPool(
    `pool cp ${t0.name} ${t1.name} ${reserve0} ${price} ${fee}` as Address,
    t0,
    t1,
    fee,
    getBigInt(reserve0 * 10 ** (t0.decimals - 6)),
    getBigInt(reserve1 * 10 ** (t1.decimals - 6)),
  )
}

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
  console.assert(
    reserve0 >= MIN_LIQUIDITY && reserve0 <= MAX_LIQUIDITY,
    'Error reserve0 clculation',
  )
  console.assert(
    reserve1 >= MIN_LIQUIDITY && reserve1 <= MAX_LIQUIDITY,
    `Error reserve1 clculation ${reserve1}`,
  )

  const total0 = { base: 0n, elastic: 0n }
  const total1 = { base: 0n, elastic: 0n }

  const pool = new StableSwapRPool(
    `pool ss ${t0.name} ${t1.name} ${reserve0} ${fee}` as Address,
    t0,
    t1,
    fee,
    getBigInt(reserve0 * 10 ** (t0.decimals - 6)),
    getBigInt(reserve1 * 10 ** (t1.decimals - 6)),
    t0.decimals,
    t1.decimals,
    total0,
    total1,
  )
  return pool
}

function getPoolA(rnd: () => number) {
  return Math.floor(getRandom(rnd, MIN_HYBRID_A, MAX_HYBRID_A))
}

// price is always 1
export function getHybridPool(rnd: () => number, t0: RToken, t1: RToken) {
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
  console.assert(
    reserve0 >= MIN_LIQUIDITY && reserve0 <= MAX_LIQUIDITY,
    'Error reserve0 clculation',
  )
  console.assert(
    reserve1 >= MIN_LIQUIDITY && reserve1 <= MAX_LIQUIDITY,
    `Error reserve1 clculation ${reserve1}`,
  )

  return new HybridRPool(
    `pool hb ${t0.name} ${t1.name} ${reserve0} ${1} ${fee}` as Address,
    t0,
    t1,
    fee,
    A,
    getBigInt(reserve0),
    getBigInt(reserve1),
  )
}

export interface NetworkCreateData {
  tokenNumber: number
  density: number
  gasPrice: number
}

export function chooseRandomToken(rnd: () => number, network: Network): TToken {
  const num = network.tokens.length
  return network.tokens[Math.floor(rnd() * num)]
}

export function chooseRandomStableToken(
  rnd: () => number,
  network: Network,
  amount: number,
): TToken[] {
  const stables = network.tokens.filter((t) => t.price === STABLE_TOKEN_PRICE)
  if (stables.length < amount)
    throw new Error('No enough stable tokens in the network')

  const tokens: TToken[] = []
  for (let i = 0; i < amount; ++i) {
    const selected = Math.floor(rnd() * stables.length)
    tokens.push(stables[selected])
    stables.splice(selected, 1)
  }

  console.assert(new Set(tokens).size === amount)

  return tokens
}

export function chooseRandomTokensForSwap(
  rnd: () => number,
  network: Network,
): [TToken, TToken, TToken] {
  const num = network.tokens.length
  const token0 = Math.floor(rnd() * num)
  const token1 = (token0 + 1 + Math.floor(rnd() * (num - 1))) % num
  expect(token0).not.toEqual(token1)
  const tokenBase = Math.floor(rnd() * num)
  return [
    network.tokens[token0],
    network.tokens[token1],
    network.tokens[tokenBase],
  ]
}

function createBridge(rnd: () => number, net1: Network, net2: Network) {
  const token0 = chooseRandomToken(rnd, net1)
  const token1 = chooseRandomToken(rnd, net2)
  return getCPPool(rnd, token0, token1)
}

function createStargateBridge(rnd: () => number, net1: Network, net2: Network) {
  const [usdc0, usdt0, stg0] = chooseRandomStableToken(rnd, net1, 3)
  const [usdc1, usdt1, stg1] = chooseRandomStableToken(rnd, net2, 3)
  const bridgeState = {
    currentAssetSD: 62204680881791000000n,
    lpAsset: 82018577759839000000n,
    eqFeePool: 12415520434000000n,
    idealBalance: 6649285670242000000n,
    currentBalance: 3951760190743000000n,
    allocPointIsPositive: true,
  }
  return [
    new BridgeStargateV04OneWay(
      'BridgeStargateV04OneWay usdc-usdc',
      usdc0,
      usdc1,
      bridgeState,
      false,
    ),
    new BridgeStargateV04OneWay(
      'BridgeStargateV04OneWay usdt-usdt',
      usdt0,
      usdt1,
      bridgeState,
      false,
    ),
    new BridgeStargateV04OneWay(
      'BridgeStargateV04OneWay usdc-usdt',
      usdc0,
      usdt1,
      bridgeState,
      false,
    ),
    new BridgeStargateV04OneWay(
      'BridgeStargateV04OneWay usdt-usdc',
      usdt0,
      usdc1,
      bridgeState,
      false,
    ),
    new BridgeUnlimited(
      `BridgeUnlimited ${stg0.address}-${stg1.address}`,
      stg0,
      stg1,
      0,
    ),
  ]
}

export function createMultipleNetworks(
  rnd: () => number,
  networkData: NetworkCreateData[],
  bridgeNumber = 1,
): { networksInfo: NetworkInfo[]; network: Network; pools: RPool[] } {
  const networks = networkData.map((d) =>
    createNetwork(rnd, d.tokenNumber, d.density, d.gasPrice),
  )

  let pools: RPool[] = []
  let tokens: TToken[] = []
  networks.forEach((n) => {
    pools = pools.concat(n.pools)
    tokens = tokens.concat(n.tokens)
  })

  const n = networkData.length
  for (let i = 0; i < n; ++i) {
    for (let j = i + 1; j < n; ++j) {
      for (let k = 0; k < bridgeNumber; ++k) {
        pools.push(createBridge(rnd, networks[i], networks[j]))
      }
    }
  }

  networks.forEach((n, i) => {
    n.tokens.forEach((t) => {
      t.chainId = i
      delete t.tokenId // should be recreated after chainId change
    })
  })

  return {
    networksInfo: networks.map((n, i) => {
      const baseToken = chooseRandomToken(rnd, n)
      return {
        chainId: i,
        baseToken,
        baseTokenPrice: baseToken.price,
        gasPrice: n.gasPrice,
      }
    }),
    network: { tokens, pools, gasPrice: -1 },
    pools,
  }
}

export function createMultipleNetworksWithStargateBridge(
  rnd: () => number,
  networkData: NetworkCreateData[],
): { networksInfo: NetworkInfo[]; network: Network; pools: RPool[] } {
  const networks = networkData.map((d) =>
    createNetwork(rnd, d.tokenNumber, d.density, d.gasPrice, 3),
  )

  let pools: RPool[] = []
  let tokens: TToken[] = []
  networks.forEach((n) => {
    pools = pools.concat(n.pools)
    tokens = tokens.concat(n.tokens)
  })

  const n = networkData.length
  for (let i = 0; i < n; ++i) {
    for (let j = i + 1; j < n; ++j) {
      pools = pools.concat(createStargateBridge(rnd, networks[i], networks[j]))
    }
  }

  networks.forEach((n, i) => {
    n.tokens.forEach((t) => {
      t.chainId = i
      delete t.tokenId // should be recreated after chainId change
    })
  })

  return {
    networksInfo: networks.map((n, i) => {
      const baseToken = chooseRandomToken(rnd, n)
      return {
        chainId: i,
        baseToken,
        baseTokenPrice: baseToken.price,
        gasPrice: n.gasPrice,
      }
    }),
    network: { tokens, pools, gasPrice: -1 },
    pools,
  }
}

function getTokenPools(network: Network): Map<RToken, RPool[]> {
  const tokenPools = new Map<RToken, RPool[]>()
  network.pools.forEach((p) => {
    const pools0 = tokenPools.get(p.token0)
    if (pools0) {
      pools0.push(p)
    } else {
      tokenPools.set(p.token0, [p])
    }
    const pools1 = tokenPools.get(p.token1)
    if (pools1) {
      pools1.push(p)
    } else {
      tokenPools.set(p.token1, [p])
    }
  })
  return tokenPools
}

function getAllConnectedTokens(
  start: RToken,
  tokenPools: Map<RToken, RPool[]>,
): Set<RToken> {
  const connected = new Set<RToken>()
  const nextTokens = [start]
  while (nextTokens.length) {
    const token = nextTokens.pop() as RToken
    if (connected.has(token)) {
      continue
    }
    connected.add(token)
    tokenPools.get(token)?.forEach((p) => {
      const token2 = token === p.token0 ? p.token1 : p.token0
      nextTokens.push(token2)
    })
  }
  return connected
}

export function expectCloseValues(
  v1: number,
  v2: number,
  precision: number,
  description = '',
  additionalInfo = '',
) {
  const a = v1
  const b = v2
  const res = closeValues(a, b, precision)
  if (!res) {
    console.log(
      `Close values expectation failed: ${description}` +
        `\n v1 = ${a}` +
        `\n v2 = ${b}` +
        `\n precision = ${Math.abs(a / b - 1)}, expected < ${precision}` +
        `${additionalInfo === '' ? '' : `\n${additionalInfo}`}`,
    )
    //debugger
  }
  expect(res).toBeTruthy()
  return res
}

export function atomPrice(token: TToken | RToken) {
  return (token as TToken).price / 10 ** token.decimals
}

export function checkRoute(
  route: MultiRoute,
  network: Network,
  from: TToken,
  to: TToken,
  amountIn: number,
  baseTokenOrNetworks: TToken | NetworkInfo[],
  gasPrice?: number,
) {
  const tokenPools = getTokenPools(network)
  const connectedTokens = getAllConnectedTokens(from, tokenPools)
  if (!connectedTokens.has(to)) {
    expect(route.status).toEqual(RouteStatus.NoWay)
    return
  }

  const multiChain = Array.isArray(baseTokenOrNetworks)
  const basePricesAreSet = multiChain
    ? true
    : connectedTokens.has(baseTokenOrNetworks as TToken)

  // amountIn checks
  if (route.status === RouteStatus.Success)
    expectCloseValues(route.amountIn, amountIn, 1e-13)
  else if (route.status === RouteStatus.Partial) {
    expect(route.amountIn).toBeLessThan(amountIn)
    expect(route.amountIn).toBeGreaterThan(0)
  }

  // amountOut checks
  if (route.status !== RouteStatus.NoWay)
    expect(route.amountOut).toBeGreaterThan(0)
  // const outPriceToIn = atomPrice(to) / atomPrice(from)
  // Slippage can be arbitrary
  // Slippage is always not-negative
  // const maxGrow = Math.pow(MAX_POOL_IMBALANCE, route.legs.length)
  // const maxGranularity = network.pools.reduce((a, p) => Math.max(a, p.granularity0(), p.granularity1()), 1)
  // if (route.amountOut > maxGranularity * MIN_LIQUIDITY * 10) {
  //   expect(route.amountOut).toBeLessThanOrEqual((route.amountIn / outPriceToIn) * maxGrow)
  // }

  // gasSpent checks
  const poolMap = new Map<string, RPool>()
  network.pools.forEach((p) => poolMap.set(p.address, p))
  const expectedGasSpent = route.legs.reduce(
    (a, b) => a + (poolMap.get(b.poolAddress)?.swapGasCost as number),
    0,
  )
  expect(route.gasSpent).toEqual(expectedGasSpent)

  // totalAmountOut checks
  if (route.status === RouteStatus.NoWay) {
    expect(route.totalAmountOut).toEqual(0)
  } else if (basePricesAreSet) {
    if (multiChain) {
      expect(route.totalAmountOut).toBeLessThanOrEqual(route.amountOut)
    } else {
      const outPriceToBase =
        atomPrice(baseTokenOrNetworks as TToken) / atomPrice(to)
      const expectedTotalAmountOut =
        route.amountOut - route.gasSpent * (gasPrice as number) * outPriceToBase

      expectCloseValues(
        route.totalAmountOut,
        expectedTotalAmountOut,
        2 * (MAX_POOL_IMBALANCE - 1) + 1e-7,
      )
    }
  } else {
    expect(route.totalAmountOut).toEqual(route.amountOut)
  }

  // legs checks
  if (route.status !== RouteStatus.NoWay)
    expect(route.legs.length).toBeGreaterThan(0)
  const usedPools = new Map<string, boolean>()
  const usedTokens = new Map<RToken, RouteLeg[]>()
  route.legs.forEach((l) => {
    expect(usedPools.get(l.poolAddress)).toBeUndefined()
    usedPools.set(l.poolAddress, true)
    const pool = poolMap.get(l.poolAddress) as RPool
    usedTokens.set(pool.token0, usedTokens.get(pool.token0) || [])
    usedTokens.get(pool.token0)?.push(l)
    usedTokens.set(pool.token1, usedTokens.get(pool.token1) || [])
    usedTokens.get(pool.token1)?.push(l)
  })
  usedTokens.forEach((legs, t) => {
    if (t === from) {
      expect(legs.length).toBeGreaterThan(0)
      expect(legs.every((l) => l.tokenFrom === from)).toBeTruthy()
      expect(legs[legs.length - 1].swapPortion).toEqual(1)
    } else if (t === to) {
      expect(legs.length).toBeGreaterThan(0)
      expect(legs.some((l) => l.tokenFrom === to)).toBeFalsy()
    } else {
      expect(legs.length).toBeGreaterThanOrEqual(2)
      expect(legs[0].tokenFrom).not.toEqual(t)
      expect(legs[legs.length - 1].tokenFrom).toEqual(t)
      expect(legs[legs.length - 1].swapPortion).toEqual(1)
      let inputFlag = true
      let absolutePortion = 0
      legs.forEach((l) => {
        if (l.tokenFrom !== t) {
          expect(inputFlag).toBeTruthy()
        } else {
          inputFlag = false
          absolutePortion += l.absolutePortion
          expect(l.swapPortion).toBeGreaterThan(0)
          expect(l.swapPortion).toBeLessThanOrEqual(1)
        }
      })
      expectCloseValues(absolutePortion, 1, 1e-12)
    }
  })
}
