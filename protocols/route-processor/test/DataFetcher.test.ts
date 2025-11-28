import assert from 'assert'
import { ChainId, TESTNET_CHAIN_IDS, chainName } from 'sushi/chain'
import {
  DAI,
  FRAX,
  SUSHI,
  Token,
  Type,
  USDB,
  USDC,
  USDT,
  WNATIVE,
} from 'sushi/currency'
import {
  DataFetcher,
  LiquidityProviders,
  Router,
  UniV3LiquidityProviders,
} from 'sushi/router'
import { UniswapV3BaseProvider } from '../../../packages/sushi/src/router/liquidity-providers/UniswapV3Base.js'

async function testDF(
  _chainName: string,
  dataFetcher: DataFetcher,
  t0: Type | undefined,
  t1: Type | undefined,
  name0: string,
  name1: string,
): Promise<Record<string, number>> {
  const dexPools: Record<string, number> = {}

  if (!t0 || !t1) return dexPools

  const start = performance.now()
  await dataFetcher.fetchPoolsForToken(t0, t1, undefined)
  const pools = dataFetcher.getCurrentPoolCodeMap(t0, t1)
  const time = Math.round(performance.now() - start)
  console.log(
    `     found pools(${name0}-${name1}): ${pools.size} time=${time}ms`,
  )
  dataFetcher.providers.forEach((p) => {
    const dexName = p.getType()
    const poolCodes = p.getCurrentPoolList(t0 as Token, t1 as Token)
    if (poolCodes.length)
      console.log(
        `          ${p.getPoolProviderName()} pools: ${poolCodes.length}`,
      )
    // ignore non uni protocol based dexes
    if (
      dexName !== LiquidityProviders.Trident &&
      dexName !== LiquidityProviders.CurveSwap &&
      dexName !== LiquidityProviders.NativeWrap
    )
      dexPools[dexName] = poolCodes.length
  })
  return dexPools
}

// checks if all available dexes on a chain have found a pool or not and returns the missing dexes names
function reportMissingDexes(reports: Record<string, number>[]): {
  hasMissingDex: boolean
  missingDexNames: string[]
} {
  const dexNames = reports.map((v) => Object.keys(v)).find((v) => v.length > 0)
  if (!dexNames) return { hasMissingDex: true, missingDexNames: [] }

  const missingDexNames = []
  for (const name of dexNames) {
    let poolsCount = 0
    for (const element of reports) poolsCount += element[name] ?? 0
    if (poolsCount === 0) missingDexNames.push(name)
  }

  if (missingDexNames.length) return { hasMissingDex: true, missingDexNames }
  else return { hasMissingDex: false, missingDexNames }
}

// tries to find a route for a token pair from current fetched pools
function findRoute(
  dataFetcher: DataFetcher,
  fromToken: Type,
  toToken: Type,
  chainId: ChainId,
  liquidityProviders?: LiquidityProviders[],
): boolean {
  try {
    // find the best route map
    const pcMap = dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)
    const route = Router.findBestRoute(
      pcMap,
      chainId,
      fromToken,
      BigInt(`1${'0'.repeat(fromToken.decimals)}`),
      toToken,
      30e9,
      liquidityProviders,
    )
    // call rp4 route data encoder to build route data
    Router.routeProcessor4Params(
      pcMap,
      route,
      fromToken,
      toToken,
      `0x${'1'.repeat(40)}`,
      `0x${'2'.repeat(40)}`,
    )
    return route.status !== 'NoWay'
  } catch {
    // no route found
    return false
  }
}

// exclude testnets and unsupported chains (chains with no dex/pool)
const excludedChains = [
  ...TESTNET_CHAIN_IDS,
  ChainId.HECO,
  ChainId.PALM,
  ChainId.BOBA_AVAX,
  ChainId.ZKSYNC_ERA,
]

const chainIds = Object.values(ChainId).filter((v) => {
  if (excludedChains.every((e) => v !== e) && process?.env?.CHAIN) {
    return v === ChainId[process.env.CHAIN as keyof typeof ChainId]
  }
  return false
})

async function runTest() {
  describe.only('DataFetcher Pools/Time check', async () => {
    chainIds.forEach((chainId) => {
      //if (chainId !== ChainId.OPTIMISM) return
      const chName = chainName[chainId]

      const dataFetcher = DataFetcher.onChain(chainId)

      it(`${chName}(${chainId})`, async () => {
        dataFetcher.startDataFetching()
        console.log(chName)
        const allFoundPools = []
        const foundRouteReports = []

        // a pool with this pair is available in most dexes and chains, but some may not have this, so
        // for those, other pairs are tried if there happened to be a missing dex from previous results
        allFoundPools.push(
          await testDF(
            chName,
            dataFetcher,
            WNATIVE[chainId],
            USDC[chainId as keyof typeof USDC],
            'WNATIVE',
            'USDC',
          ),
        )

        // check that route is found and rp4 encoder encoded a route data correctly
        // this is repeated for each pair throughout the test
        foundRouteReports.push(
          findRoute(
            dataFetcher,
            WNATIVE[chainId],
            USDC[chainId as keyof typeof USDC],
            chainId,
          ),
        )
        await sleep(60_000)

        // only for quickswapv3
        if (chainId === ChainId.POLYGON) {
          const foundRoute = findRoute(
            dataFetcher,
            WNATIVE[chainId],
            USDC[chainId as keyof typeof USDC],
            chainId,
            [LiquidityProviders.QuickSwapV3],
          )
          assert.ok(foundRoute)
          foundRouteReports.push(foundRoute)
        }

        // only for pancakev3 with 0.2.5% fee pool pair
        if (chainId === ChainId.BSC) {
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              WNATIVE[chainId],
              USDT[chainId as keyof typeof USDT],
              'WNATIVE',
              'USDT',
            ),
          )
          const pcMap = dataFetcher.getCurrentPoolCodeMap(
            WNATIVE[chainId],
            USDT[chainId as keyof typeof USDT],
          )
          assert.ok(!!pcMap.get('0x1401ff943D08a7E098328C1d3a9d388923B115D2'))
          foundRouteReports.push(
            findRoute(
              dataFetcher,
              WNATIVE[chainId],
              USDT[chainId as keyof typeof USDT],
              chainId,
              [LiquidityProviders.PancakeSwapV3],
            ),
          )
          await sleep(60_000)
        }

        // only for kimv4 on base
        if (chainId === ChainId.BASE) {
          const token = new Token({
            chainId: ChainId.BASE,
            address: '0x5dC25aA049837B696d1dc0F966aC8DF1491f819B',
            decimals: 18,
            symbol: 'KIM',
          })
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              token,
              WNATIVE[chainId as keyof typeof WNATIVE],
              'KIM',
              'WETH',
            ),
          )

          foundRouteReports.push(
            findRoute(
              dataFetcher,
              token,
              WNATIVE[chainId as keyof typeof WNATIVE],
              chainId,
              [LiquidityProviders.KimV4],
            ),
          )
          await sleep(60_000)
        }

        // only for horizon on linea
        if (chainId === ChainId.LINEA) {
          const token = new Token({
            chainId: ChainId.LINEA,
            address: '0x7d43AABC515C356145049227CeE54B608342c0ad',
            decimals: 18,
            symbol: 'BUSD',
          })
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              token,
              WNATIVE[chainId as keyof typeof WNATIVE],
              'BUSD',
              'WETH',
            ),
          )

          foundRouteReports.push(
            findRoute(
              dataFetcher,
              token,
              WNATIVE[chainId as keyof typeof WNATIVE],
              chainId,
              [LiquidityProviders.Horizon],
            ),
          )
          await sleep(60_000)
        }

        // only for Dfyn and JetSwap on fantom chain
        if (
          chainId === ChainId.FANTOM &&
          reportMissingDexes(allFoundPools).hasMissingDex
        ) {
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              WNATIVE[chainId],
              DAI[chainId as keyof typeof DAI],
              'WNATIVE',
              'DAI',
            ),
          )
          foundRouteReports.push(
            findRoute(
              dataFetcher,
              WNATIVE[chainId],
              DAI[chainId as keyof typeof DAI],
              chainId,
            ),
          )
          await sleep(60_000)
        }

        // only for Blast chain
        if (
          chainId === ChainId.BLAST &&
          reportMissingDexes(allFoundPools).hasMissingDex
        ) {
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              WNATIVE[chainId],
              USDB[chainId as keyof typeof USDB],
              'WNATIVE',
              'USDB',
            ),
          )
          foundRouteReports.push(
            findRoute(
              dataFetcher,
              WNATIVE[chainId],
              USDB[chainId as keyof typeof USDB],
              chainId,
            ),
          )
          await sleep(60_000)
        }

        // only for Blast chain
        if (
          chainId === ChainId.BLAST &&
          reportMissingDexes(allFoundPools).hasMissingDex
        ) {
          const token0 = new Token({
            chainId: ChainId.BLAST,
            address: '0x18755D2ceC785aB87680Edb8e117615E4B005430',
            decimals: 18,
            symbol: 'fwRING',
          })
          const token1 = new Token({
            chainId: ChainId.BLAST,
            address: '0x66714DB8F3397c767d0A602458B5b4E3C0FE7dd1',
            decimals: 18,
            symbol: 'fwWETH',
          })
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              token0,
              token1,
              'fwRING',
              'fwWETH',
            ),
          )
          foundRouteReports.push(
            findRoute(dataFetcher, token0, token1, chainId),
          )
          await sleep(60_000)
        }

        // only for Moonbeam chain
        if (
          chainId === ChainId.MOONBEAM &&
          reportMissingDexes(allFoundPools).hasMissingDex
        ) {
          const token = new Token({
            chainId: ChainId.MOONBEAM,
            address: '0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F',
            decimals: 18,
            symbol: 'BUSD',
          })
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              token,
              USDC[chainId as keyof typeof USDC],
              'USDC',
              'BUSD',
            ),
          )
          foundRouteReports.push(
            findRoute(
              dataFetcher,
              token,
              USDC[chainId as keyof typeof USDC],
              chainId,
            ),
          )
          await sleep(60_000)
        }

        // only for Elk dex on Moonriver since it only has 1 pool deployed which is with following pair
        if (
          chainId === ChainId.MOONRIVER &&
          reportMissingDexes(allFoundPools).hasMissingDex
        ) {
          const token = new Token({
            chainId: ChainId.MOONRIVER,
            address: '0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C',
            decimals: 18,
            symbol: 'ELK',
          })
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              DAI[chainId as keyof typeof DAI],
              token,
              'DAI',
              'ELK',
            ),
          )
          foundRouteReports.push(
            findRoute(
              dataFetcher,
              DAI[chainId as keyof typeof DAI],
              token,
              chainId,
            ),
          )
          await sleep(60_000)
        }

        // shared pairs for all chains and dexes
        if (reportMissingDexes(allFoundPools).hasMissingDex) {
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              WNATIVE[chainId],
              USDT[chainId as keyof typeof USDT],
              'WNATIVE',
              'USDT',
            ),
          )
          foundRouteReports.push(
            findRoute(
              dataFetcher,
              WNATIVE[chainId],
              USDT[chainId as keyof typeof USDT],
              chainId,
            ),
          )
          await sleep(60_000)
        }

        if (reportMissingDexes(allFoundPools).hasMissingDex) {
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              SUSHI[chainId as keyof typeof SUSHI],
              FRAX[chainId as keyof typeof FRAX],
              'SUSHI',
              'FRAX',
            ),
          )
          foundRouteReports.push(
            findRoute(
              dataFetcher,
              SUSHI[chainId as keyof typeof SUSHI],
              FRAX[chainId as keyof typeof FRAX],
              chainId,
            ),
          )
          await sleep(60_000)
        }

        if (reportMissingDexes(allFoundPools).hasMissingDex) {
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              SUSHI[chainId as keyof typeof SUSHI],
              USDT[chainId as keyof typeof USDT],
              'SUSHI',
              'USDT',
            ),
          )
          foundRouteReports.push(
            findRoute(
              dataFetcher,
              SUSHI[chainId as keyof typeof SUSHI],
              USDT[chainId as keyof typeof USDT],
              chainId,
            ),
          )
          await sleep(60_000)
        }

        dataFetcher.stopDataFetching()

        // univ3 based dexes should all have correct fees/ticks
        const invalidDexes = []
        for (const dex of dataFetcher.providers) {
          const dexName = dex.getType()
          // if the current provider is univ3 type, ensure its fees and ticks
          if (UniV3LiquidityProviders.some((v) => v === dexName)) {
            const res = await (dex as UniswapV3BaseProvider).ensureFeeAndTicks()
            if (!res) invalidDexes.push(dexName)
          }
        }
        assert.ok(
          invalidDexes.length === 0,
          `invalid fees/ticks at ${chName} for: ${invalidDexes.join(', ')}`,
        )

        // should have found route
        assert.ok(
          foundRouteReports.some((v) => v),
          'did not find any valid route',
        )

        // should not have any missing dex
        const { hasMissingDex, missingDexNames } =
          reportMissingDexes(allFoundPools)
        if (hasMissingDex) {
          if (!missingDexNames.length)
            assert.fail(`found no pools for all available dexes on ${chName}`)
          else
            assert.fail(
              `found no pools on ${chName} for: ${missingDexNames.join(', ')}`,
            )
        }
      })
    })
  })
}

async function sleep(ms: number, msg = '') {
  return new Promise((resolve) => setTimeout(() => resolve(msg), ms))
}

runTest()
