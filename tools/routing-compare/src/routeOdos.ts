import { ChainId } from 'sushi'
import { Token, WNATIVE } from 'sushi/currency'
import { Address, Hex } from 'viem'
import { MAX_PRICE_IMPACT } from './index.js'
import { simulateRouteFromNativeThroughWrap } from './simulationFromNativeThroughWrap.js'
import { isNative } from './utils.js'
import { getNativeWhale } from './wales.js'

interface OdosQoute {
  outAmounts: number[]
  priceImpact: number | undefined
  pathId: string
}

function wrap(token: Token): Token {
  if (isNative(token)) return WNATIVE[token.chainId as keyof typeof WNATIVE]
  return token
}

async function OdosGetQuote(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
  user?: Address,
): Promise<OdosQoute | undefined> {
  from = wrap(from) // Odos doesn't work with natives
  to = wrap(to) // Odos doesn't work with natives
  const params = {
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
  }
  if (user) (params as Record<string, any>)['userAddr'] = user
  const resp = await fetch('https://api.odos.xyz/sor/quote/v2', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
  if (resp.status !== 200) {
    console.log(resp.status, await resp.text())
    return
  }
  const quote = (await resp.json()) as OdosQoute
  return quote
}

export async function OdosRoute(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
  user?: Address,
): Promise<bigint | undefined> {
  const quote = await OdosGetQuote(chainId, from, to, amountIn, gasPrice, user)
  if (quote?.priceImpact === undefined) return
  if (quote?.priceImpact < -MAX_PRICE_IMPACT * 100) return // too high price impact
  if (quote?.outAmounts[0] === undefined) return
  return BigInt(quote?.outAmounts[0])
}

export interface SimulationResult {
  quote: bigint | undefined
  swap: bigint | undefined
  real: bigint | undefined
}

export async function OdosRouteSimulate(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<SimulationResult | undefined> {
  const whale = getNativeWhale(chainId)
  if (whale === undefined) return undefined

  const quote = await OdosGetQuote(chainId, from, to, amountIn, gasPrice, whale)
  if (!quote) return

  const resp = await fetch('https://api.odos.xyz/sor/assemble', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userAddr: whale,
      pathId: quote.pathId,
      simulate: false, // this can be set to true if the user isn't doing their own estimate gas call for the transaction
    }),
  })
  if (resp.status !== 200) {
    console.log(resp.status, await resp.text())
    return
  }
  const res = (await resp.json()) as {
    outputTokens: { amount: string }[]
    transaction: {
      to: Address
      data: Hex
    }
  }
  if (res.transaction?.data === undefined || res.transaction?.to === undefined)
    return

  const simulationRes = await simulateRouteFromNativeThroughWrap(
    whale,
    amountIn,
    to,
    res.transaction?.to,
    res.transaction?.data,
  )
  if (typeof simulationRes === 'string')
    console.log('Odos simulation error:', simulationRes)
  else
    return {
      quote:
        quote.outAmounts[0] === undefined
          ? undefined
          : BigInt(quote.outAmounts[0]),
      swap:
        res.outputTokens[0]?.amount === undefined
          ? undefined
          : BigInt(res.outputTokens[0]?.amount),
      real: simulationRes,
    }
  return
}
