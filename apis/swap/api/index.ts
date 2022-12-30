import { ChainId } from '@sushiswap/chain'
import { Native, USDC } from '@sushiswap/currency'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { BigNumber, providers } from 'ethers'
import { z } from 'zod'

import { DataFetcher } from '../scripts/DataFetcher'
import { Router } from '../scripts/Router'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  fromToken: z.coerce.string(),
  toToken: z.coerce.string(),
  gasPrice: z.coerce.number().int().gte(0),
  amount: z.coerce.number().int().gte(0),
})

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

class BackCounter {
  start: number
  current: number

  constructor(start: number) {
    this.start = start
    this.current = start
  }

  async wait() {
    while (this.current > 0) {
      console.log(`Wait ${this.current} sec ...`)
      this.current--
      await delay(1000)
    }
  }

  reset(startdiff = 0) {
    this.start += startdiff
    if (this.start < 0) this.start = 0
    this.current = this.start
  }
}

const handler = async (request: VercelRequest, response: VercelResponse) => {
  console.log('query', request.query)
  const {
    chainId,
    // fromToken,
    // toToken,
    amount,
    // gasPrice
  } = schema.parse(request.query)

  // TODO: Dummy tokens
  const fromToken = Native.onChain(ChainId.ETHEREUM)
  const toToken = USDC[ChainId.ETHEREUM]

  const backCounter = new BackCounter(4)

  const dataFetcher = new DataFetcher(
    new providers.AlchemyProvider('homestead', process.env['ALCHEMY_API_KEY']),
    chainId
  )
  dataFetcher.startDataFetching()
  dataFetcher.fetchPoolsForToken(fromToken, toToken)
  const router = new Router(dataFetcher, fromToken, BigNumber.from(amount.toString()), toToken, 30e9)
  router.startRouting(() => {
    //console.log('Known Pools:', dataFetcher.poolCodes.reduce((a, b) => ))
    const printed = router.getCurrentRouteHumanString()
    console.log(printed)
    backCounter.reset(-1)
  })

  await backCounter.wait()
  router.stopRouting()
  dataFetcher.stopDataFetching()

  return response.status(200).json({
    getCurrentRouteHumanString: router.getCurrentRouteHumanString(),
    // TODO: Dummy addresses
    getCurrentRouteRPParams: router.getCurrentRouteRPParams('0x0', '0x0'),
    getBestRoute: router.getBestRoute(),
  })
}

export default handler
