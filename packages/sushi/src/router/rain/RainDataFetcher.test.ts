import { PublicClient, createPublicClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { ChainId } from '../../chain/constants.js'
import { ROUTE_PROCESSOR_4_ADDRESS } from '../../config/route-processor.js'
import { publicClientConfig } from '../../config/viem.js'
import { Token } from '../../currency/Token.js'
import { USDC, WNATIVE } from '../../currency/tokens.js'
import { LiquidityProviders } from '../liquidity-providers/index.js'
import { Router } from '../router.js'
import { RainDataFetcher } from './RainDataFetcher.js'

describe('RainDataFetcher tests', async () => {
  // we test on Base chain because it has at least one of each dex type
  const client = createPublicClient(publicClientConfig[ChainId.BASE])

  // 3000 blocks apart, to test pool data updates by event logs
  const currentBlockNumber = await client.getBlockNumber()
  const oldBlockNumber = currentBlockNumber - 3000n

  const fromToken = USDC[ChainId.BASE]
  const toToken = WNATIVE[ChainId.BASE]
  const amountIn = 10_000_000n // 10 USDC
  const gasPrice = 30_000_000n

  // one of each type
  const protocols = {
    univ2: LiquidityProviders.UniswapV2, // Univ2
    univ3: LiquidityProviders.UniswapV3, // Univ3
    algebra: LiquidityProviders.KimV4, // Algebra
    slipstream: LiquidityProviders.AerodromeSlipstream, // Slipstream
    hydrex: LiquidityProviders.Hydrex, // Hydrex (UniV2)
  }

  // wait 60 sec before each test to avoid rpc ratelimiting
  beforeEach(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(1), 60_000))
  })

  it('should correctly update pools data by logs for Univ2 protocol', async () => {
    await testRainDataFetcher(
      [protocols.univ2],
      client,
      fromToken,
      toToken,
      amountIn,
      gasPrice,
      currentBlockNumber,
      oldBlockNumber,
    )
  })

  it('should correctly update pools data by logs for Univ3 protocol', async () => {
    await testRainDataFetcher(
      [protocols.univ3],
      client,
      fromToken,
      toToken,
      amountIn,
      gasPrice,
      currentBlockNumber,
      oldBlockNumber,
    )
  })

  it('should correctly update pools data by logs for Algebra protocol', async () => {
    await testRainDataFetcher(
      [protocols.algebra],
      client,
      fromToken,
      toToken,
      amountIn,
      gasPrice,
      currentBlockNumber,
      oldBlockNumber,
    )
  })

  it('should correctly update pools data by logs for Slipstream protocol', async () => {
    await testRainDataFetcher(
      [protocols.slipstream],
      client,
      fromToken,
      toToken,
      amountIn,
      gasPrice,
      currentBlockNumber,
      oldBlockNumber,
    )
  })

  it('should correctly update pools data by logs for Hydrex protocol', async () => {
    await testRainDataFetcher(
      [protocols.hydrex],
      client,
      fromToken,
      toToken,
      amountIn,
      gasPrice,
      currentBlockNumber,
      oldBlockNumber,
    )
  })
})

async function testRainDataFetcher(
  lps: LiquidityProviders[],
  client: PublicClient,
  fromToken: Token,
  toToken: Token,
  amountIn: bigint,
  gasPrice: bigint,
  currentBlockNumber: bigint,
  oldBlockNumber: bigint,
) {
  // data fetcher without indexer (normal way ie raw pool data fecthed directly by contract calls)
  const dataFetcherFresh = await RainDataFetcher.init(ChainId.BASE, client, lps)

  // data fetcher with indexer (pool data will be updated from older block to current block by event logs)
  const dataFetcherIndexer = await RainDataFetcher.init(
    ChainId.BASE,
    client,
    lps,
  )

  // get route at current block height for fresh dataFetcher
  const { pcMap: freshPcMap, route: freshRoute } =
    await dataFetcherFresh.findBestRoute(
      ChainId.BASE,
      fromToken,
      toToken,
      amountIn,
      gasPrice,
      false,
      { blockNumber: currentBlockNumber },
      lps,
      undefined,
      'single',
    )

  // get route at older block height for indexer dataFetcher, then ensure the
  // amount out it gives is different to fresh datafetcher amount out
  // and then update the pools data with contract logs from between the blocks
  const { route: indexerRouteOld } = await dataFetcherIndexer.findBestRoute(
    ChainId.BASE,
    fromToken,
    toToken,
    amountIn,
    gasPrice,
    false,
    { blockNumber: oldBlockNumber },
    lps,
    undefined,
    'single',
  )

  // should not be equal
  // just to make sure that pool data are actually different in current vs old block height
  expect(freshRoute.amountOutBI).not.equal(indexerRouteOld.amountOutBI)

  // now get route at current block height for indexer dataFetcher with updating pool data
  const { pcMap: indexerPcMap, route: indexerRoute } =
    await dataFetcherIndexer.findBestRoute(
      ChainId.BASE,
      fromToken,
      toToken,
      amountIn,
      gasPrice,
      true, // update pool data by logs
      { blockNumber: currentBlockNumber },
      lps,
      undefined,
      'single',
    )

  // assert amount outs and status
  expect(freshRoute.status).toEqual(indexerRoute.status)
  expect(freshRoute.amountOutBI).toEqual(indexerRoute.amountOutBI)
  expect(freshRoute.totalAmountOutBI).toEqual(indexerRoute.totalAmountOutBI)

  // assert produced route code
  const freshRpParams = Router.routeProcessor4Params(
    freshPcMap,
    freshRoute,
    fromToken,
    toToken,
    ROUTE_PROCESSOR_4_ADDRESS[ChainId.BASE],
    ROUTE_PROCESSOR_4_ADDRESS[ChainId.BASE],
  )
  const indexerRpParams = Router.routeProcessor4Params(
    indexerPcMap,
    indexerRoute,
    fromToken,
    toToken,
    ROUTE_PROCESSOR_4_ADDRESS[ChainId.BASE],
    ROUTE_PROCESSOR_4_ADDRESS[ChainId.BASE],
  )
  expect(freshRpParams.routeCode).toEqual(indexerRpParams.routeCode)
}
