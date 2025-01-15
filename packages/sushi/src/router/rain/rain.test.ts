import { describe, expect, it } from 'vitest'
import { ChainId } from '../../chain/constants.js'
import { ROUTE_PROCESSOR_4_ADDRESS } from '../../config/route-processor.js'
import { USDC, USDT } from '../../currency/tokens.js'
import { LiquidityProviders } from '../liquidity-providers/index.js'
import { Router } from '../router.js'
import { RainDataFetcher } from './rain-data-fetcher.js'

describe('Rain fork tests', async () => {
  it('should correctly update pools data by logs', async () => {
    // 2000 blocks apart
    const currentBlockNumber = 64818756n
    const oldBlockNumber = 64816756n
    const fromToken = USDT[ChainId.POLYGON]
    const toToken = USDC[ChainId.POLYGON]
    const amountIn = 10_000_000n // 10e6, ie 10 USDT
    const gasPrice = 30_000_000
    // one of each type
    const lps = [
      LiquidityProviders.UniswapV3, // univ3
      LiquidityProviders.QuickSwapV3, // algebra
      LiquidityProviders.QuickSwapV2, // univ2
    ]

    // data fetcher without indexer (normal way ie raw pool data fecthed directly by contract calls)
    const dataFectherFresh = new RainDataFetcher(ChainId.POLYGON)
    dataFectherFresh.startDataFetching(lps)
    dataFectherFresh.stopDataFetching()

    // data fetcher with indexer (pool data will be updated from older block to current block by contract logs)
    const dataFectherIndexer = new RainDataFetcher(ChainId.POLYGON)
    dataFectherIndexer.startDataFetching(lps)
    dataFectherIndexer.stopDataFetching()

    // get token pools data for current block on fresh dataFetcher
    await dataFectherFresh.fetchPoolsForToken(fromToken, toToken, undefined, {
      blockNumber: currentBlockNumber,
    })
    const freshPcMap = dataFectherFresh.getCurrentPoolCodeMap(
      fromToken,
      toToken,
    )
    const freshRoute = Router.findBestRoute(
      freshPcMap,
      ChainId.POLYGON,
      fromToken,
      amountIn,
      toToken,
      gasPrice,
      lps,
      undefined,
      undefined,
      'single',
    )

    // get token pools data for older block on indexer dataFetcher, then ensure the
    // amount out it gives is different to fresh datafetcher amount out
    // and then update the pools data with contract logs from between the blocks
    await dataFectherIndexer.fetchPoolsForToken(fromToken, toToken, undefined, {
      blockNumber: oldBlockNumber,
    })
    const indexerPcMapOld = dataFectherIndexer.getCurrentPoolCodeMap(
      fromToken,
      toToken,
    )
    const indexerRouteOld = Router.findBestRoute(
      indexerPcMapOld,
      ChainId.POLYGON,
      fromToken,
      amountIn,
      toToken,
      gasPrice,
      lps,
      undefined,
      undefined,
      'single',
    )
    // should not be equal (just to make sure)
    expect(freshRoute.amountOutBI).not.equal(indexerRouteOld.amountOutBI)

    // now update the indexer pools data with logs
    await dataFectherIndexer.updatePools(currentBlockNumber)
    const indexerPcMap = dataFectherIndexer.getCurrentPoolCodeMap(
      fromToken,
      toToken,
    )
    const indexerRoute = Router.findBestRoute(
      indexerPcMap,
      ChainId.POLYGON,
      fromToken,
      amountIn,
      toToken,
      gasPrice,
      lps,
      undefined,
      undefined,
      'single',
    )

    // assert amount outs and status
    expect(freshRoute.amountOutBI).toEqual(indexerRoute.amountOutBI)
    expect(freshRoute.totalAmountOutBI).toEqual(indexerRoute.totalAmountOutBI)
    expect(freshRoute.status).toEqual(indexerRoute.status)

    // assert produced route code
    const freshRpParams = Router.routeProcessor4Params(
      freshPcMap,
      freshRoute,
      fromToken,
      toToken,
      ROUTE_PROCESSOR_4_ADDRESS[ChainId.POLYGON],
      ROUTE_PROCESSOR_4_ADDRESS[ChainId.POLYGON],
    )
    const indexerRpParams = Router.routeProcessor4Params(
      indexerPcMap,
      indexerRoute,
      fromToken,
      toToken,
      ROUTE_PROCESSOR_4_ADDRESS[ChainId.POLYGON],
      ROUTE_PROCESSOR_4_ADDRESS[ChainId.POLYGON],
    )
    expect(freshRpParams.routeCode).toEqual(indexerRpParams.routeCode)
  })
})
