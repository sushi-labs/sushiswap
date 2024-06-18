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
  await dataFetcher.fetchPoolsForToken(t0, t1, undefined, {
    fetchPoolsTimeout: 60000,
  })
  const pools = dataFetcher.getCurrentPoolCodeMap(t0, t1)
  const time = Math.round(performance.now() - start)
  console.log(
    `     found pools(${name0}-${name1}): ${pools.size} time=${time}ms`,
  )
  dataFetcher.providers.forEach((p) => {
    const pooltype = p.getType()
    const poolCodes = p.getCurrentPoolList(t0 as Token, t1 as Token)
    if (poolCodes.length)
      console.log(
        `          ${p.getPoolProviderName()} pools: ${poolCodes.length}`,
      )

    // exclude non uni based dexes
    if (
      pooltype !== LiquidityProviders.Trident &&
      pooltype !== LiquidityProviders.CurveSwap &&
      pooltype !== LiquidityProviders.NativeWrap
    )
      dexPools[pooltype] = poolCodes.length
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

        // only try remaining pairs in case there is a missing dex from the previous pairs results
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
        // only Blast chain
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
        const chainAllDexesKeys = Object.keys(allFoundPools[0])
        for (let i = 0; i < chainAllDexesKeys.length; i++) {
          const key = chainAllDexesKeys[i]
          let dexPoolsCount = 0
          for (let j = 0; j < allFoundPools.length; j++) {
            dexPoolsCount += allFoundPools[j][key] ?? 0
          }
          if (dexPoolsCount === 0) fails.push(key)
        }
        if (fails.length)
          assert.fail(
            `did not find any pools on ${chName} chain for following dexes: ${fails.join(
              ', ',
            )}`,
          )
      })
    })
  })
}

function hasMissingDex(dexPools: Record<string, number>[]): boolean {
  const dexKeys = Object.keys(dexPools[0])
  if (!dexKeys.length) return true
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
