import { ChainId } from 'sushi'
import { Token } from 'sushi/currency'
import { MAX_PRICE_IMPACT } from './index.js'

async function SushiRP5RouteUnBiased(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<bigint | undefined> {
  const url =
    `https://api.sushi.com/swap/v5/${chainId}?tokenIn=${from.address}&tokenOut=${to.address}` +
    `&amount=${amountIn}&maxPriceImpact=${MAX_PRICE_IMPACT}&gasPrice=${gasPrice}`
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
