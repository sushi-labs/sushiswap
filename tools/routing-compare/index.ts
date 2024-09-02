import { ChainId } from 'sushi/chain'
import { Token, USDC, USDT } from 'sushi/currency'

const MAX_PRICE_IMPACT = 0.1 // 10%

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

async function OneInchRoute(
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

console.log(
  'Sushi',
  await SushiRoute(
    ChainId.ETHEREUM,
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    100_000_000n,
    10_000_000_000n,
  ),
)
console.log(
  '1inch',
  await OneInchRoute(
    ChainId.ETHEREUM,
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    100_000_000n,
    10_000_000_000n,
  ),
)
