import { Address } from 'sushi'
import { ChainId, ChainKey } from 'sushi/chain'
import {
  //ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
  STABLES,
  publicClientConfig,
} from 'sushi/config'
import { Token } from 'sushi/currency'
import { createPublicClient } from 'viem'

const MAX_PRICE_IMPACT = 0.1 // 10%
const MAX_PAIRS_FOR_CHECK = 23
const CHECK_LEVELS_$ = [100, 1000, 30_000, 1_000_000, 10_000_000]

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

async function SushiRP5RouteUnBiased(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<bigint | undefined> {
  const url =
    `https://api.sushi.com/swap/v5/${chainId}?tokenIn=${from.address}&tokenOut=${to.address}` +
    `&amount=${amountIn}&maxPriceImpact=${MAX_PRICE_IMPACT}&gasPrice=${gasPrice}&preferSushi=false`
  const resp = await fetch(url)
  if (resp.status !== 200) return
  const route = (await resp.json()) as {
    status: string
    assumedAmountOut: string
  }
  if (route === undefined || route?.status !== 'Success') return
  return BigInt(route.assumedAmountOut)
}

export async function SushiRoute(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<bigint | undefined> {
  return SushiRP5RouteUnBiased(chainId, from, to, amountIn, gasPrice)
}

export async function OneInchBrowserRoute(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<bigint | undefined> {
  // pretending a browser
  const url =
    `https://proxy-app.1inch.io/v2.0/v1.5/chain/${chainId}/router/v6/quotes?` +
    `fromTokenAddress=${from.address}&toTokenAddress=${to.address}&amount=${amountIn}` +
    `&gasPrice=${gasPrice}&preset=maxReturnResult&isTableEnabled=true`
  const resp = await fetch(url, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en',
      authorization:
        'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjljMjlkNzdjLTU5MWItNGM1Yy1hM2EwLWNlMGMxMWU2Nzk1NiIsImV4cCI6MTcyNTI5Mjg0MSwiZGV2aWNlIjoiYnJvd3NlciIsImlhdCI6MTcyNTI4OTI0MX0.0hRJ5EEt9alBdwWAPp_C15UXUONSMbDhhpQhcRyriU_Vzimzu3NT3JAk4b5BU5hRGBcjVLzqmtBaXxD9ohzqMQ',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      priority: 'u=1, i',
      'sec-ch-ua':
        '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'x-session-id': 'c76482d0-923b-4fec-9353-e779fbc33896',
      'x-user-id': 'b9abfb7b-8cca-4479-97f4-630a441748ed',
    },
    referrer: 'https://app.1inch.io/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })
  if (resp.status !== 200) return
  const route = (await resp.json()) as {
    bestResult: { toTokenAmount: string }
  }
  if (route?.bestResult?.toTokenAmount === undefined) return
  return BigInt(route?.bestResult?.toTokenAmount)
}

const oneInchApiKeys = (process.env['ONE_INCH_API_KEYS'] || '')
  .replaceAll(/ +/g, '')
  .split(',')
let next1inchKeyIndex = 0
async function OneInchAPIRoute(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<bigint | undefined> {
  if (oneInchApiKeys.length === 0) return
  const apiKey = oneInchApiKeys[next1inchKeyIndex++]
  if (next1inchKeyIndex >= oneInchApiKeys.length) next1inchKeyIndex = 0

  const url =
    `https://api.1inch.dev/swap/v6.0/${chainId}/quote?` +
    `fromTokenAddress=${from.address}&toTokenAddress=${to.address}&amount=${amountIn}` +
    `&gasPrice=${gasPrice}&preset=maxReturnResult&isTableEnabled=true`

  for (let n = 0; n < 10; ++n) {
    const resp = await fetch(url, {
      headers: {
        authorization: `Bearer ${apiKey}`,
      },
    })
    if (resp.status === 429) {
      // The limit of requests per second has been exceeded
      delay(300)
      continue
    }
    if (resp.status !== 200) {
      console.log(resp.status, apiKey, await resp.text())
      return
    }
    const route = (await resp.json()) as {
      dstAmount: number
    }
    if (route?.dstAmount === undefined) return
    return BigInt(route?.dstAmount)
  }

  return undefined
}

export async function OneInchRoute(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<bigint | undefined> {
  return OneInchAPIRoute(chainId, from, to, amountIn, gasPrice)
}

export async function OdosRoute(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<bigint | undefined> {
  const resp = await fetch('https://api.odos.xyz/sor/quote/v2', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chainId: chainId,
      gasPrice: gasPrice.toString(),
      inputTokens: [
        {
          amount: amountIn.toString(),
          tokenAddress: from.address,
        },
      ],
      outputTokens: [
        {
          proportion: 1,
          tokenAddress: to.address,
        },
      ],
      slippageLimitPercent: MAX_PRICE_IMPACT * 100,
    }),
  })
  if (resp.status !== 200) {
    //console.log(resp.status, await resp.text())
    return
  }
  const route = (await resp.json()) as {
    outAmounts: number
  }
  if (route?.outAmounts === undefined) return
  return BigInt(route?.outAmounts)
}

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

export async function getTestTokens(
  chainId: ChainId,
): Promise<[Token, number][]> {
  const tokensMap = new Map<Address, Token>(
    [
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
    .map((t) => [t, prices[t.address]])
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
    console.log(`${level}$`)
    const pairsNum = tokens.length * (tokens.length - 1)
    const pairsToCheckNum = Math.min(pairsNum, MAX_PAIRS_FOR_CHECK)
    const step = pairsNum / pairsToCheckNum
    let currentPairNum = 0
    let nextCheckPairNum = 0
    for (let i = 0; i < tokens.length; ++i) {
      for (let j = 0; j < tokens.length; ++j) {
        if (j === i) continue
        if (currentPairNum === Math.round(nextCheckPairNum)) {
          nextCheckPairNum += step
          const [tok0, price0] = tokens[i] as [Token, number]
          const [tok1, _price1] = tokens[j] as [Token, number]
          const amountIn = getTokenAmountWei(tok0, price0, level)
          console.log(
            tok0.symbol,
            tok0.decimals,
            amountIn,
            tok1.symbol,
            await route(chainId, tok0, tok1, amountIn, gasPrice),
          )
        }
        currentPairNum++
      }
    }
  }
}

checkRoute(1)

/*console.log(
  'Sushi',
  await SushiRoute(
    ChainId.ETHEREUM,
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    100_000_000n,
    700_000_000n,
  ),
)
console.log(
  '1inch',
  await OneInchRoute(
    ChainId.ETHEREUM,
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    100_000_000n,
    700_000_000n,
  ),
)
console.log(
  'Odos ',
  await OdosRoute(
    ChainId.ETHEREUM,
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    100_000_000n,
    700_000_000n,
  ),
)

console.log(
  await route(
    ChainId.ETHEREUM,
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    100_000_000n,
    700_000_000n,
  ),
)*/
