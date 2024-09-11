import { ChainId } from 'sushi'
import { Token, WNATIVE_ADDRESS } from 'sushi/currency'
import { Address, Hex } from 'viem'
import { simulateRouteFromNative } from './simulationStorageFromNative.js'
import { isNative } from './utils.js'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

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
// unfortunately it is impossible to obtain price impact
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
    `src=${from.address}&dst=${to.address}&amount=${amountIn}` +
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
      //console.log(resp.status, apiKey, await resp.text())
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

const whales: Record<number, Address> = {
  [ChainId.ETHEREUM]: '0x00000000219ab540356cBB839Cbe05303d7705Fa', // Beacon deposit
}

export async function OneInchAPIRouteSimulate(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
) /*: Promise<bigint | undefined>*/ {
  if (!isNative(from)) return undefined // 1inch doesn't make routes without a user with liquidity and approve to 1inch router
  const whale =
    whales[chainId] ?? WNATIVE_ADDRESS[chainId as keyof typeof WNATIVE_ADDRESS]
  if (whale === undefined) return undefined

  const quote = await OneInchRoute(chainId, from, to, amountIn, gasPrice)

  if (oneInchApiKeys.length === 0) return
  const apiKey = oneInchApiKeys[next1inchKeyIndex++]
  if (next1inchKeyIndex >= oneInchApiKeys.length) next1inchKeyIndex = 0

  const url =
    `https://api.1inch.dev/swap/v6.0/${chainId}/swap?` +
    `src=${from.address}&dst=${to.address}&amount=${amountIn}&from=${whale}&origin=${whale}` +
    `&gasPrice=${gasPrice}&slippage=50`

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
      //console.log(resp.status, await resp.text(), url)
      return
    }
    const route = (await resp.json()) as {
      dstAmount: number
      tx:
        | {
            from: Address | undefined
            to: Address | undefined
            data: Hex | undefined
          }
        | undefined
    }
    if (
      route.tx === undefined ||
      route.tx.to === undefined ||
      route.tx.data === undefined
    )
      throw new Error('1inch route formate error')
    const simulationRes = await simulateRouteFromNative(
      whale,
      amountIn,
      to,
      route.tx.to,
      route.tx.data,
    )
    if (typeof simulationRes === 'string') return undefined //throw new Error(`1inch simulation error: ${simulationRes}`)
    return { quote, swap: route.dstAmount, real: simulationRes }
  }

  return undefined
}
