import { ChainId } from 'sushi'
import { Token, WETH9 } from 'sushi/currency'
import { Address, Hex } from 'viem'
import { MAX_PRICE_IMPACT } from './index.js'
import { simulateRoute } from './simulationStorage.js'
import { isNative } from './utils.js'

interface OdosQoute {
  outAmounts: number[]
  priceImpact: number | undefined
  pathId: string
}

function wrap(token: Token): Token {
  if (isNative(token)) return WETH9[token.chainId as keyof typeof WETH9]
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
    //console.log(resp.status, await resp.text())
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

const TEST_USER = '0x0102030405060708091001020304050607080910'
export async function OdosRouteSimulate(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
) {
  const quote = await OdosGetQuote(
    chainId,
    from,
    to,
    amountIn,
    gasPrice,
    TEST_USER,
  )
  if (!quote) return

  const resp = await fetch('https://api.odos.xyz/sor/assemble', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userAddr: TEST_USER,
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

  const simulationRes = await simulateRoute(
    TEST_USER,
    from,
    amountIn,
    to,
    res.transaction?.to,
    res.transaction?.data,
  )
  if (typeof simulationRes === 'string')
    console.log('Odos simulation error:', simulationRes)
  else
    return {
      quote: quote.outAmounts[0],
      assemble: res.outputTokens[0]?.amount,
      simulation: simulationRes as bigint,
    }
  return
}
