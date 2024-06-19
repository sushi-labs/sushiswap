import assert from 'assert'
import { ChainId, chainName } from 'sushi/chain'
import {
  // DAI,
  FRAX,
  SUSHI,
  Token,
  Type,
  // USDB,
  USDC,
  USDT,
  WNATIVE,
} from 'sushi/currency'
import { DataFetcher, LiquidityProviders } from 'sushi/router'

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
    // ignore non uni dexes
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

// exclude test nets and chains with no pool or no dex
// const excludedChains = [
//   ...TESTNET_CHAIN_IDS,
//   ChainId.HECO,
//   ChainId.PALM,
//   ChainId.BOBA_AVAX,
//   ChainId.ZKSYNC_ERA,
// ]
// const chainIds = Object.values(ChainId).filter((v) =>
//   excludedChains.every((e) => v !== e),
// )
const chainIds = [ChainId.HECO]
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

        // a pool with this pair is available in most dexes and chains, but some may not have this, so
        // for those other pairs are tried if happened to find a missing dex from previous results
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

        // from here on, only try a new pair in case there is a missing dex from previous pair:
        // only for Dfyn and JetSwap on fantom chain
        // if (
        //   chainId === ChainId.FANTOM &&
        //   reportMissingDexes(allFoundPools).hasMissingDex
        // )
        //   allFoundPools.push(
        //     await testDF(
        //       chName,
        //       dataFetcher,
        //       WNATIVE[chainId],
        //       DAI[chainId as keyof typeof DAI],
        //       'WNATIVE',
        //       'DAI',
        //     ),
        //   )
        // // only for Blast chain
        // if (
        //   chainId === ChainId.BLAST &&
        //   reportMissingDexes(allFoundPools).hasMissingDex
        // )
        //   allFoundPools.push(
        //     await testDF(
        //       chName,
        //       dataFetcher,
        //       WNATIVE[chainId],
        //       USDB[chainId as keyof typeof USDB],
        //       'WNATIVE',
        //       'USDB',
        //     ),
        //   )
        // // only for Moonbeam chain
        // if (
        //   chainId === ChainId.MOONBEAM &&
        //   reportMissingDexes(allFoundPools).hasMissingDex
        // )
        //   allFoundPools.push(
        //     await testDF(
        //       chName,
        //       dataFetcher,
        //       new Token({
        //         chainId: ChainId.MOONBEAM,
        //         address: '0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F',
        //         decimals: 18,
        //         symbol: 'BUSD',
        //       }),
        //       USDC[chainId as keyof typeof USDC],
        //       'USDC',
        //       'BUSD',
        //     ),
        //   )
        // // only for Elk dex on Moonriver since it only has 1 pool with these pair
        // if (
        //   chainId === ChainId.MOONRIVER &&
        //   reportMissingDexes(allFoundPools).hasMissingDex
        // )
        //   allFoundPools.push(
        //     await testDF(
        //       chName,
        //       dataFetcher,
        //       DAI[chainId as keyof typeof DAI],
        //       new Token({
        //         chainId: ChainId.MOONRIVER,
        //         address: '0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C',
        //         decimals: 18,
        //         symbol: 'ELK',
        //       }),
        //       'DAI',
        //       'ELK',
        //     ),
        //   )
        // only for Elk dex on HECO
        if (
          chainId === ChainId.HECO &&
          reportMissingDexes(allFoundPools).hasMissingDex
        )
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              USDT[chainId as keyof typeof USDT],
              new Token({
                chainId: ChainId.HECO,
                address: '0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C',
                decimals: 18,
                symbol: 'ELK',
              }),
              'USDT',
              'ELK',
            ),
          )
        if (reportMissingDexes(allFoundPools).hasMissingDex)
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
        if (reportMissingDexes(allFoundPools).hasMissingDex)
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
        if (reportMissingDexes(allFoundPools).hasMissingDex)
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

        dataFetcher.stopDataFetching()

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

runTest()
