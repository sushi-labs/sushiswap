import { Address, nativeToken } from 'sushi'
import { ChainId, ChainKey } from 'sushi/chain'
import {
  //ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
  STABLES,
  publicClientConfig,
} from 'sushi/config'
import { Token, USDC, WNATIVE } from 'sushi/currency'
import { createPublicClient } from 'viem'
import { OneInchRoute } from './route1inch.js'
import { OdosRoute, OdosRouteSimulate } from './routeOdos.js'
import { SushiRoute } from './routeSushi.js'

export const MAX_PRICE_IMPACT = 0.1 // 10%
const MAX_PAIRS_FOR_CHECK = 23
const CHECK_LEVELS_$ = [100, 1000, 30_000, 1_000_000, 10_000_000]
const EXCLUDE_NETWORKS = [5, 80001, 4002, 97, 421614, 43113]

async function route(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<Record<string, number | undefined>> {
  const result = await Promise.all([
    SushiRoute(chainId, from, to, amountIn, gasPrice),
    OneInchRoute(chainId, from, to, amountIn, gasPrice),
    OdosRoute(chainId, from, to, amountIn, gasPrice),
  ])
  const max = Number(
    (result.filter((r) => r !== undefined) as bigint[]).reduce(
      (max, r) => (r > max ? r : max),
      1n,
    ),
  )
  const proc = result.map((r) => (r === undefined ? r : Number(r) / max))

  return { sushi: proc[0], oneInch: proc[1], odos: proc[2] }
}

function tokAddrForPrice(tok: Token): Address {
  if (tok.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
    return WNATIVE[tok.chainId].address
  return tok.address
}

export async function getTestTokens(
  chainId: ChainId,
): Promise<[Token, number][]> {
  const tokensMap = new Map<Address, Token>(
    [
      nativeToken(chainId),
      ...(BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []),
      //...Object.values(ADDITIONAL_BASES[chainId] ?? {}).flat(),
      ...(STABLES[chainId] ?? []),
    ].map((t) => [t.address, t]),
  )
  const tokens = Array.from(tokensMap.values())
  const pricesResp = await fetch(`http://api.sushi.com/price/v1/${chainId}`)
  if (pricesResp.status !== 200) {
    console.log(`No prices for ${chainId} net`)
    return []
  }
  const prices = (await pricesResp.json()) as Record<string, number>
  const pricedTokens = tokens
    .map((t) => [t, prices[tokAddrForPrice(t)]])
    .filter(([_, price]) => price !== undefined) as [Token, number][]
  return pricedTokens
}

export async function getGasPrice(chainId: ChainId): Promise<bigint> {
  const client = createPublicClient(publicClientConfig[chainId])
  const gasPrice = await client.getGasPrice()
  return gasPrice
}

function getTokenAmountWei(
  tok: Token,
  price$: number,
  amount$: number,
): bigint {
  return BigInt(Math.round((amount$ / price$) * 10 ** tok.decimals))
}

function analyzeResults(results: Record<string, number | undefined>[]) {
  const projects: Set<string> = new Set()
  results.forEach((r) =>
    Object.entries(r).forEach(([project, res]) => {
      if (res !== undefined) projects.add(project)
    }),
  )
  const sum: Map<string, number> = new Map()
  let pairs = 0
  results.forEach((r) => {
    const l = Object.entries(r).filter(([project]) => projects.has(project))
    if (l.every(([_, res]) => res !== undefined)) {
      l.forEach(([project, res]) => {
        sum.set(project, (sum.get(project) || 0) + (res as number))
      })
      ++pairs
    }
  })
  const max = Array.from(sum.entries()).reduce(
    (a, [_, sum]) => Math.max(a, sum / pairs),
    0,
  )
  const score = new Map<string, number>()
  Array.from(sum.entries()).forEach(([project, sum]) =>
    score.set(project, sum / pairs / max),
  )
  return { score, pairs }
}

export async function checkRoute(chainId: ChainId) {
  const [gasPrice, tokens] = await Promise.all([
    getGasPrice(chainId),
    getTestTokens(chainId),
  ])
  console.log(
    `${ChainKey[chainId]} gasPrice=${gasPrice} tokens: ${tokens
      .map((t) => t[0].symbol)
      .join(', ')}`,
  )
  for (let l = 0; l < CHECK_LEVELS_$.length; ++l) {
    const level = CHECK_LEVELS_$[l] as number
    const pairsNum = tokens.length * (tokens.length - 1)
    const pairsToCheckNum = Math.min(pairsNum, MAX_PAIRS_FOR_CHECK)
    const step = pairsNum / pairsToCheckNum
    let currentPairNum = 0
    let nextCheckPairNum = 0
    const results: Record<string, number | undefined>[] = []
    for (let i = 0; i < tokens.length; ++i) {
      for (let j = 0; j < tokens.length; ++j) {
        if (j === i) continue
        if (currentPairNum === Math.round(nextCheckPairNum)) {
          nextCheckPairNum += step
          const [tok0, price0] = tokens[i] as [Token, number]
          const [tok1, _price1] = tokens[j] as [Token, number]
          const amountIn = getTokenAmountWei(tok0, price0, level)
          const res = await route(chainId, tok0, tok1, amountIn, gasPrice)
          results.push(res)
          console.log(tok0.symbol, tok0.decimals, amountIn, tok1.symbol, res)
        }
        currentPairNum++
      }
    }
    const { score, pairs } = analyzeResults(results)
    console.log(
      `Swap ${level}$ (${pairs} pairs): ${Array.from(score.entries())
        .map((e) => `${e[0]}=${e[1]}`)
        .join(', ')}`,
    )
  }
}

export async function checkRouteAllNetworks() {
  const chains = Object.values(ChainId)
  for (let i = 0; i < chains.length; ++i) {
    if (!EXCLUDE_NETWORKS.includes(chains[i] as number))
      await checkRoute(chains[i] as ChainId)
  }
}

//checkRouteAllNetworks()

// console.log(
//   await simulateRoute(
//     '0x0102030405060708091001020304050607080910',
//     USDC[ChainId.ETHEREUM],
//     12345n,
//     USDT[ChainId.ETHEREUM],
//     '0xf2614A233c7C3e7f08b1F887Ba133a13f1eb2c55',
//     '0x2646478b000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000000003039000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec70000000000000000000000000000000000000000000000000000000000002ffc000000000000000000000000010203040506070809100102030405060708091000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000004502A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB4801ffff003041CbD36888bECc7bbCBc0045E3B1f144466f5f010102030405060708091001020304050607080910000bb8000000000000000000000000000000000000000000000000000000',
//   ),
// )

// console.log(
//   await OneInchAPIRouteSimulate(
//     ChainId.ETHEREUM,
//     nativeToken(ChainId.ETHEREUM),
//     USDC[ChainId.ETHEREUM],
//     10n ** 18n,
//     1_000_000_000n,
//   ),
// )
// debugger
console.log(
  await OdosRouteSimulate(
    ChainId.ETHEREUM,
    USDC[ChainId.ETHEREUM],
    nativeToken(ChainId.ETHEREUM),
    10n ** 18n,
    1_000_000_000n,
  ),
)
