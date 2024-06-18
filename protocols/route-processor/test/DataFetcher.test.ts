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
    // non uni based dexes
    if (
      dexName !== LiquidityProviders.Trident &&
      dexName !== LiquidityProviders.CurveSwap &&
      dexName !== LiquidityProviders.NativeWrap
    )
      dexPools[dexName] = poolCodes.length
  })
  return dexPools
}

// exclude test nets and chains with no pool or no dex
const excludedChains = [
  ...TESTNET_CHAIN_IDS,
  ChainId.HECO,
  ChainId.PALM,
  ChainId.BOBA_AVAX,
  ChainId.ZKSYNC_ERA,
]
const chainIds = Object.values(ChainId).filter((v) =>
  excludedChains.every((e) => v !== e),
)

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

        // try other pairs in case at least one dex found no pools
        if (hasMissingDex(allFoundPools))
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
        if (hasMissingDex(allFoundPools))
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
        if (hasMissingDex(allFoundPools))
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
        // only for Blast chain
        if (chainId === ChainId.BLAST && hasMissingDex(allFoundPools))
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
        // only for Elk dex on Moonriver
        if (chainId === ChainId.MOONRIVER && hasMissingDex(allFoundPools))
          allFoundPools.push(
            await testDF(
              chName,
              dataFetcher,
              DAI[chainId as keyof typeof DAI],
              new Token({
                chainId: ChainId.MOONRIVER,
                address: '0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C',
                decimals: 18,
                symbol: 'ELK',
              }),
              'DAI',
              'ELK',
            ),
          )
        dataFetcher.stopDataFetching()

        const fails = []
        const chainAllDexesNames = allFoundPools.find(
          (v) => Object.keys(v).length > 0,
        )
        if (!chainAllDexesNames)
          assert.fail(`found no pools on ${chName} for all dexes`)
        for (let i = 0; i < chainAllDexesNames.length; i++) {
          const dexName = chainAllDexesNames[i]
          let dexPoolsCount = 0
          for (let j = 0; j < allFoundPools.length; j++) {
            dexPoolsCount += allFoundPools[j][dexName] ?? 0
          }
          if (dexPoolsCount === 0) fails.push(dexName)
        }
        if (fails.length)
          assert.fail(`found no pools on ${chName} for: ${fails.join(', ')}`)
      })
    })
  })
}

// checks if all available dexes on chain have found a pool or not
function hasMissingDex(dexPools: Record<string, number>[]): boolean {
  const dexKeys = dexPools.find((v) => Object.keys(v).length > 0)
  if (!dexKeys) return true
  for (let i = 0; i < dexKeys.length; i++) {
    const key = dexKeys[i]
    let dexPoolsCount = 0
    for (let j = 0; j < dexPools.length; j++) {
      dexPoolsCount += dexPools[j][key] ?? 0
    }
    if (dexPoolsCount === 0) return true
  }
  return false
}

runTest()
