import { ChainId } from 'sushi'
import { Token } from 'sushi/currency'
import { Address, Hex } from 'viem'
import { MAX_PRICE_IMPACT } from './index.js'
import { SimulationResult } from './routeOdos.js'
import { simulateRoute } from './simulationStorage.js'
import { getNativeWhale } from './wales.js'

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

export async function SushiRouteSimulate(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<SimulationResult | undefined> {
  const whale = getNativeWhale(chainId)
  if (whale === undefined) return undefined

  const url =
    `https://api.sushi.com/swap/v5/${chainId}?tokenIn=${from.address}&tokenOut=${to.address}` +
    `&amount=${amountIn}&maxPriceImpact=${MAX_PRICE_IMPACT}&gasPrice=${gasPrice}` +
    `&includeTransaction=true&to=${whale}`
  const resp = await fetch(url)
  if (resp.status !== 200) return
  const route = (await resp.json()) as {
    status: string
    assumedAmountOut: string
    tx: {
      to: Address
      data: Hex
    }
  }
  if (
    route === undefined ||
    route?.status !== 'Success' ||
    route?.tx === undefined
  )
    return

  const simulationRes = await simulateRoute(
    whale,
    from,
    amountIn,
    to,
    route.tx.to,
    route.tx.data,
  )
  if (typeof simulationRes === 'string') return undefined //throw new Error(`sushi simulation error: ${simulationRes}`)
  return {
    quote: BigInt(route.assumedAmountOut),
    swap: BigInt(route.assumedAmountOut),
    real: simulationRes,
  }
}
