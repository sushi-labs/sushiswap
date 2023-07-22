import { BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { config } from '@sushiswap/viem-config'
import express, { Express, Request, Response } from 'express'
import { createPublicClient } from 'viem'

import { Extractor, MultiCallAggregator, TokenManager } from '../src'
import { EXTRACTOR_CONFIG } from './config'

const SUPPORTED_CHAIN_IDS = [1] as const

type SupportChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

const extractors = new Map<SupportChainId, Extractor>()
const tokenManagers = new Map<SupportChainId, TokenManager>()

async function setup() {
  for (const chainId of SUPPORTED_CHAIN_IDS) {
    const client = createPublicClient(config[chainId])
    const extractor = new Extractor({ ...EXTRACTOR_CONFIG[chainId], client })
    await extractor.start()

    const tokenManager = new TokenManager(
      extractor.extractorV2?.multiCallAggregator || (extractor.extractorV3?.multiCallAggregator as MultiCallAggregator),
      __dirname,
      `tokens-${chainId}`
    )
    await tokenManager.addCachedTokens()

    extractors.set(chainId, extractor)
    tokenManagers.set(chainId, tokenManager)
  }
}

async function main() {
  await setup()

  const app: Express = express()

  app.get('/', (req: Request, res: Response) => {
    return res.send('Hello World!')
  })

  app.get('/get-pool-codes-for-tokens', (req: Request, res: Response) => {
    const chainId = parseInt(req.params.chainId as string) as SupportChainId
    const extractor = extractors.get(1) as Extractor
    const tokenManager = tokenManagers.get(1) as TokenManager
    const tokens = BASES_TO_CHECK_TRADES_AGAINST[1].concat(Array.from(tokenManager.tokens.values()).slice(0, 100))
    const poolCodes = extractor.getPoolCodesForTokens(tokens)
    return res.json(poolCodes)
  })

  app.get('/pool-codes', (req: Request, res: Response) => {
    const chainId = parseInt(req.params.chainId as string) as SupportChainId
    const extractor = extractors.get(1) as Extractor
    const poolCodes = extractor.getCurrentPoolCodes()
    res.json(poolCodes)
  })

  app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
  })
}
main()
