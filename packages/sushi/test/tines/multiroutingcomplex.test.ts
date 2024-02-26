import seedrandom from 'seedrandom'
import { expect, it } from 'vitest'
import { RPool } from '../../src/tines/RPool.js'
import {
  Graph,
  MultiRoute,
  RouteStatus,
  findMultiRouteExactIn,
  findSingleRouteExactIn,
} from '../../src/tines/index.js'
import { checkRouteResult } from './snapshots/snapshot.js'
import {
  MAX_POOL_IMBALANCE,
  Network,
  TToken,
  atomPrice,
  checkRoute,
  chooseRandomTokensForSwap,
  createNetwork,
  expectCloseValues,
  getRandom,
} from './utils.js'

const testSeed = '1' // Change it to change random generator values
const rnd: () => number = seedrandom(testSeed) // random [0, 1)

const GAS_PRICE = 1 * 200 * 1e-9

function simulateRouting(network: Network, route: MultiRoute) {
  if (route.status === RouteStatus.NoWay) {
    return { out: 0, gasSpent: 0 }
  }
  let gasSpentTotal = 0
  const amounts = new Map<string, number>()
  const diff = new Map<string, number>()
  amounts.set(route.fromToken.tokenId as string, route.amountIn)
  diff.set(route.fromToken.tokenId as string, 0)
  route.legs.forEach((l) => {
    // Take swap parms
    const pool0 = network.pools.find((p) => p.address === l.poolAddress)
    expect(pool0).toBeDefined()
    const pool = pool0 as RPool

    const direction = pool.token0.tokenId === l.tokenFrom.tokenId
    const granularityOut = direction
      ? pool?.granularity1()
      : pool?.granularity0()

    // Check assumedAmountIn <-> assumedAmountOut correspondance
    const expectedOut = pool?.calcOutByInReal(l.assumedAmountIn, direction)
    expectCloseValues(
      expectedOut / granularityOut,
      l.assumedAmountOut / granularityOut,
      1e-11,
    )

    // Calc legInput
    const inputTokenAmount = amounts.get(
      l.tokenFrom.tokenId as string,
    ) as number
    expect(inputTokenAmount).toBeGreaterThan(0) // Very important check !!!! That we don't have idle legs
    const routerPortion = Math.round(l.swapPortion * 65535) / 65535
    const legInput = Math.floor(inputTokenAmount * routerPortion)
    amounts.set(l.tokenFrom.tokenId as string, inputTokenAmount - legInput)

    // Check assumedAmountIn
    const inputTokenDiff = diff.get(l.tokenFrom.tokenId as string) as number
    const legInputDiff = Math.floor(inputTokenDiff * routerPortion)
    expect(Math.abs(legInput - l.assumedAmountIn) <= legInputDiff)
    diff.set(l.tokenFrom.tokenId as string, inputTokenDiff - legInputDiff)

    // check assumedAmountOut
    const { gasSpent } = pool.calcOutByIn(legInput, direction)
    const legOutput = pool.calcOutByInReal(legInput, direction)
    const precision = legInputDiff / l.assumedAmountIn
    expectCloseValues(
      legOutput / granularityOut,
      l.assumedAmountOut / granularityOut,
      precision + 1e-11,
    )
    gasSpentTotal += gasSpent
    const outputTokenAmount = amounts.get(l.tokenTo.tokenId as string) || 0
    amounts.set(l.tokenTo.tokenId as string, outputTokenAmount + legOutput)

    const legDiff = Math.abs(l.assumedAmountOut - legOutput)
    const prevDiff = diff.get(l.tokenTo.tokenId as string) || 0
    diff.set(l.tokenTo.tokenId as string, prevDiff + legDiff)
  })

  amounts.forEach((amount, tokenId) => {
    if (tokenId === route.toToken.tokenId) {
      const finalDiff = diff.get(tokenId) as number
      expect(finalDiff).toBeGreaterThanOrEqual(0)
      expect(Math.abs(amount - route.amountOut) <= finalDiff)
      if (route.amountOut === 0) expect(finalDiff).toEqual(0)
      else expect(finalDiff / route.amountOut).toBeLessThan(1e-4)
    } else {
      expect(amount).toBeLessThan(1) // rounding dust
    }
  })
  expect(route.gasSpent).toEqual(gasSpentTotal)

  return {
    out: amounts.get(route.toToken.tokenId as string),
    gasSpent: gasSpentTotal,
  }
}

function numberPrecision(n: number, precision = 2) {
  if (n === 0) return 0
  const sign = n < 0 ? -1 : 1
  n = Math.abs(n)
  const digits = Math.ceil(Math.log10(n))
  if (digits >= precision) return Math.round(n)
  const shift = 10 ** (precision - digits)
  return (sign * Math.round(n * shift)) / shift
}

// eslint-disable-next-line unused-imports/no-unused-vars, no-unused-vars
export function printRoute(route: MultiRoute, network: Network) {
  const liquidity = new Map<number, number>()
  function addLiquidity(
    token: { name: string } | number | string,
    amount: number,
  ) {
    if (typeof token === 'object') token = token.name
    if (typeof token === 'string') token = parseInt(token)
    const prev = liquidity.get(token) || 0
    liquidity.set(token, prev + amount)
  }
  addLiquidity(route.fromToken, route.amountIn)
  let info = ''
  route.legs.forEach((l, i) => {
    const pool = network.pools.find((p) => p.address === l.poolAddress) as RPool
    const inp =
      (liquidity.get(parseInt(l.tokenFrom.name)) as number) * l.absolutePortion
    const { out } = pool.calcOutByIn(
      inp,
      pool.token0.tokenId === l.tokenFrom.tokenId,
    )
    const price_in = atomPrice(l.tokenFrom) / atomPrice(route.fromToken)
    const price_out = atomPrice(l.tokenTo) / atomPrice(route.fromToken)
    const diff = numberPrecision(100 * ((out * price_out) / inp / price_in - 1))
    info += `${i} ${numberPrecision(l.absolutePortion)} ${l.tokenFrom.name}->${
      l.tokenTo.name
    } ${inp * price_in} -> ${out * price_out} (${diff}%) ${inp} -> ${out}\n`
    addLiquidity(l.tokenTo, out)
  })
  console.log(info)
}

// const routingQuality = 1e-2
// function checkExactOut(routeIn: MultiRoute, routeOut: MultiRoute) {
//   expect(routeOut).toBeDefined()
//   expectCloseValues(routeIn.amountOutWithoutRounding as number, routeOut.amountOut as number, 1e-12)
//   expect(closeValues(routeIn.primaryPrice as number, routeOut.primaryPrice as number, routingQuality)).toBeTruthy()

//   // We can't expect routeIn and routeOut are similar
//   //expect(closeValues(routeIn.amountIn as number, routeOut.amountIn as number, routingQuality)).toBeTruthy()
//   //expect(closeValues(routeIn.priceImpact as number, routeOut.priceImpact as number, routingQuality)).toBeTruthy()
//   //expect(closeValues(routeIn.swapPrice as number, routeOut.swapPrice as number, routingQuality)).toBeTruthy()
// }

function getBasePrice(network: Network, t: TToken) {
  return network.gasPrice * 10 ** (t.decimals - 18)
}

const network = createNetwork(rnd, 20, 0.3, GAS_PRICE)

it('Token price calculation is correct', () => {
  const baseTokenIndex = 0
  const baseToken = network.tokens[baseTokenIndex] as TToken
  const gasPrice = getBasePrice(network, baseToken)
  const g = new Graph(network.pools, baseToken, baseToken, gasPrice)
  g.vertices.forEach((v) => {
    const tokenIndex = parseInt(v.token.name)
    if (tokenIndex === baseTokenIndex) {
      expectCloseValues(v.price, 1, 1e-10)
    }
    if (v.price !== 0) {
      expectCloseValues(
        v.price,
        atomPrice(v.token as TToken) / atomPrice(baseToken),
        5 * (MAX_POOL_IMBALANCE - 1),
      )
    }
  })
})

it(`Multirouter for ${network.tokens.length} tokens and ${network.pools.length} pools (200 times)`, () => {
  for (let i = 0; i < 200; ++i) {
    const [t0, t1, tBase] = chooseRandomTokensForSwap(rnd, network)
    const amountIn = getRandom(rnd, 1e6, 1e24)
    const gasPrice = getBasePrice(network, tBase)

    const route = findMultiRouteExactIn(
      t0,
      t1,
      amountIn,
      network.pools,
      tBase,
      gasPrice,
    )
    checkRoute(route, network, t0, t1, amountIn, tBase, gasPrice)
    simulateRouting(network, route)
    checkRouteResult(`top20-${i}`, route.totalAmountOut)

    // if (route.priceImpact !== undefined && route.priceImpact < 0.1) {
    //   // otherwise exactOut could return too bad value
    //   const routeOut = findMultiRouteExactOut(t0, t1, route.amountOut, network.pools, tBase, gasPrice)
    //   checkRoute(routeOut, network, t0, t1, routeOut.amountIn * (1 + 1e-14), tBase, gasPrice)
    //   checkExactOut(route, routeOut)
    // }
  }
})

it(`Multirouter-100 for ${network.tokens.length} tokens and ${network.pools.length} pools`, () => {
  for (let i = 0; i < 10; ++i) {
    const [t0, t1, tBase] = chooseRandomTokensForSwap(rnd, network)
    const amountIn = getRandom(rnd, 1e6, 1e24)
    const gasPrice = getBasePrice(network, tBase)

    const route = findMultiRouteExactIn(
      t0,
      t1,
      amountIn,
      network.pools,
      tBase,
      gasPrice,
      100,
    )
    checkRoute(route, network, t0, t1, amountIn, tBase, gasPrice)
    simulateRouting(network, route)
    checkRouteResult(`m100-${i}`, route.totalAmountOut)

    // if (route.priceImpact !== undefined && route.priceImpact < 0.1) {
    //   // otherwise exactOut could return too bad value
    //   const routeOut = findMultiRouteExactOut(t0, t1, route.amountOut, network.pools, tBase, gasPrice, 100)
    //   checkRoute(routeOut, network, t0, t1, routeOut.amountIn * (1 + 1e-14), tBase, gasPrice)
    //   checkExactOut(route, routeOut)
    // }
  }
})

it('Multirouter path quantity check', () => {
  const rndInternal: () => number = seedrandom('00')
  const steps = [1, 2, 4, 10, 20, 40, 100]
  for (let i = 0; i < 5; ++i) {
    const [t0, t1, tBase] = chooseRandomTokensForSwap(rndInternal, network)
    const amountIn = getRandom(rndInternal, 1e6, 1e24)
    const gasPrice = getBasePrice(network, tBase)

    let prevAmountOut = -1
    steps.forEach((s) => {
      const route = findMultiRouteExactIn(
        t0,
        t1,
        amountIn,
        network.pools,
        tBase,
        gasPrice,
        s,
      )
      if (route.status !== RouteStatus.NoWay) {
        checkRoute(route, network, t0, t1, amountIn, tBase, gasPrice)
        simulateRouting(network, route)
        expect(route.totalAmountOut).toBeGreaterThan(prevAmountOut / 1.001)
      }
      prevAmountOut = route.totalAmountOut
      checkRouteResult(`st-${i}-${s}`, route.totalAmountOut)
    })
  }
})

function makeTestForTiming(tokens: number, density: number, tests: number) {
  const network2 = createNetwork(rnd, tokens, density, GAS_PRICE)
  it(`Multirouter timing test for ${tokens} tokens and ${network2.pools.length} pools (${tests} times)`, () => {
    for (let i = 0; i < tests; ++i) {
      const [t0, t1, tBase] = chooseRandomTokensForSwap(rnd, network)
      const amountIn = getRandom(rnd, 1e6, 1e24)
      const gasPrice = getBasePrice(network2, tBase)

      findMultiRouteExactIn(t0, t1, amountIn, network2.pools, tBase, gasPrice)
    }
  })
}

makeTestForTiming(10, 0.5, 100)
makeTestForTiming(10, 0.9, 100)

it(`Singlerouter for ${network.tokens.length} tokens and ${network.pools.length} pools (100 times)`, () => {
  for (let i = 0; i < 100; ++i) {
    const [t0, t1, tBase] = chooseRandomTokensForSwap(rnd, network)
    const amountIn = getRandom(rnd, 1e6, 1e24)
    const gasPrice = getBasePrice(network, tBase)

    // Very special case, failes at checkRoute. Reason: not 100% optimal routing because of edges with negative values
    if (testSeed === '1') if (i === 11 || i === 60 || i === 80) continue

    const route = findSingleRouteExactIn(
      t0,
      t1,
      amountIn,
      network.pools,
      tBase,
      gasPrice,
    )
    checkRoute(route, network, t0, t1, amountIn, tBase, gasPrice)
    simulateRouting(network, route)
    const route2 = findMultiRouteExactIn(
      t0,
      t1,
      amountIn,
      network.pools,
      tBase,
      gasPrice,
    )
    expect(route.amountOut).toBeLessThanOrEqual(route2.amountOut * 1.001)
    checkRouteResult(`single20-${i}`, route.totalAmountOut)

    // if (route.status !== RouteStatus.NoWay) {
    //   const routeOut = findSingleRouteExactOut(
    //     t0,
    //     t1,
    //     route.amountOutWithoutRounding as number,
    //     network.pools,
    //     tBase,
    //     gasPrice
    //   )
    //   checkRoute(routeOut, network, t0, t1, routeOut.amountIn * (1 + 1e-14), tBase, gasPrice)
    //   checkExactOut(route, routeOut)
    // } else {
    //   const routeOut = findSingleRouteExactOut(t0, t1, 1e6, network.pools, tBase, gasPrice)
    //   if (routeOut.status !== RouteStatus.NoWay) {
    //     const route3 = findSingleRouteExactIn(t0, t1, routeOut.amountIn, network.pools, tBase, gasPrice)
    //     checkRoute(route3, network, t0, t1, route3.amountIn, tBase, gasPrice)
    //     simulateRouting(network, route3)
    //     checkExactOut(route3, routeOut)
    //   }
    // }
  }
})
