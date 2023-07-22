import { ChainId } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
import { NativeWrapProvider, PoolCode, Router } from '@sushiswap/router'
import { BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { config } from '@sushiswap/viem-config'
import { BigNumber } from 'ethers'
import express, { Express, Request, Response } from 'express'
import path from 'path'
import { Address, createPublicClient } from 'viem'
import z from 'zod'

import { Extractor, MultiCallAggregator, TokenManager } from '../src'
import { EXTRACTOR_CONFIG, isSupportedChainId, SupportChainId, SUPPORTED_CHAIN_IDS } from './config'

const querySchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .refine((chainId) => isSupportedChainId(chainId), { message: 'ChainId not supported.' })
    .transform((chainId) => chainId as SupportChainId),
  tokenIn: z.string(),
  tokenOut: z.string(),
  amount: z.string().transform((amount) => BigInt(amount)),
})

const extractors = new Map<SupportChainId, Extractor>()
const tokenManagers = new Map<SupportChainId, TokenManager>()
const nativeProviders = new Map<SupportChainId, NativeWrapProvider>()

async function setup() {
  for (const chainId of SUPPORTED_CHAIN_IDS) {
    const client = createPublicClient(config[chainId])
    const extractor = new Extractor({ ...EXTRACTOR_CONFIG[chainId], client })
    await extractor.start()
    extractors.set(chainId, extractor)

    const tokenManager = new TokenManager(
      extractor?.multiCallAggregator as MultiCallAggregator,
      path.resolve(__dirname, '../cache'),
      `./tokens-${chainId}`
    )
    await tokenManager.addCachedTokens()
    tokenManagers.set(chainId, tokenManager)

    const nativeProvider = new NativeWrapProvider(chainId, client)
    nativeProviders.set(chainId, nativeProvider)
  }
}

async function main() {
  await setup()

  const app: Express = express()

  app.get('/', async (req: Request, res: Response) => {
    console.log('HTTP: GET /', JSON.stringify(req.query))
    const { chainId, tokenIn: _tokenIn, tokenOut: _tokenOut, amount } = querySchema.parse(req.query)
    const tokenManager = tokenManagers.get(chainId) as TokenManager
    const [tokenIn, tokenOut] = await Promise.all([
      _tokenIn === '' ? Native.onChain(chainId) : tokenManager.findToken(_tokenIn as Address),
      tokenManager.findToken(_tokenOut as Address),
    ])
    if (!tokenIn || !tokenOut) {
      throw new Error('tokenIn or tokenOut is not supported')
    }
    const extractor = extractors.get(chainId) as Extractor
    const tokens = BASES_TO_CHECK_TRADES_AGAINST[chainId]
    const poolCodes = extractor.getPoolCodesForTokens(
      Array.from(new Set([tokenIn.wrapped, tokenOut.wrapped, ...tokens]))
    )

    const poolCodesMap = new Map<string, PoolCode>()
    poolCodes.forEach((p) => poolCodesMap.set(p.pool.address, p))
    const nativeProvider = nativeProviders.get(chainId) as NativeWrapProvider
    nativeProvider.getCurrentPoolList().forEach((p) => poolCodesMap.set(p.pool.address, p))

    const bestRoute = Router['findBestRoute'](
      poolCodesMap,
      chainId,
      tokenIn,
      BigNumber.from(amount.toString()),
      tokenOut,
      30e9
    )
    return res.json(bestRoute)
  })

  app.get('/get-pool-codes-for-tokens', (req: Request, res: Response) => {
    console.log('HTTP: GET /get-pool-codes-for-tokens', JSON.stringify(req.query))
    const { chainId } = querySchema.parse(req.query)
    const extractor = extractors.get(chainId) as Extractor
    const tokenManager = tokenManagers.get(chainId) as TokenManager
    const tokens = BASES_TO_CHECK_TRADES_AGAINST[chainId].concat(Array.from(tokenManager.tokens.values()).slice(0, 100))
    const poolCodes = extractor.getPoolCodesForTokens(tokens)
    return res.json(poolCodes)
  })

  app.get('/pool-codes', (req: Request, res: Response) => {
    console.log('HTTP: GET /pool-codes', JSON.stringify(req.query))
    const { chainId } = querySchema.parse(req.query)
    const extractor = extractors.get(chainId) as Extractor
    const poolCodes = extractor.getCurrentPoolCodes()
    res.json(poolCodes)
  })

  app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
  })
}
main()
