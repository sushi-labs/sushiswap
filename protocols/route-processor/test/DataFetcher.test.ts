import { DataFetcher } from '@sushiswap/router'
import { ChainId, chainName } from 'sushi/chain'
import { FRAX, SUSHI, Token, Type, USDC, USDT, WNATIVE } from 'sushi/currency'

async function testDF(
  _chainName: string,
  dataFetcher: DataFetcher,
  t0: Type | undefined,
  t1: Type | undefined,
  name0: string,
  name1: string,
) {
  if (!t0 || !t1) return
  const start = performance.now()
  await dataFetcher.fetchPoolsForToken(t0, t1)
  const pools = dataFetcher.getCurrentPoolCodeMap(t0, t1)
  const time = Math.round(performance.now() - start)
  console.log(
    `     found pools(${name0}-${name1}): ${pools.size} time=${time}ms`,
  )
  dataFetcher.providers.forEach((p) => {
    const poolCodes = p.getCurrentPoolList(t0 as Token, t1 as Token)
    if (poolCodes.length)
      console.log(
        `          ${p.getPoolProviderName()} pools: ${poolCodes.length}`,
      )
  })
}

const chainIds = [
  ChainId.ARBITRUM_NOVA,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BOBA,
  ChainId.BOBA_AVAX,
  ChainId.BOBA_BNB,
  ChainId.BSC,
  ChainId.BTTC,
  ChainId.CELO,
  ChainId.ETHEREUM,
  ChainId.FANTOM,
  ChainId.FUSE,
  ChainId.GNOSIS,
  ChainId.HARMONY,
  ChainId.KAVA,
  ChainId.METIS,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
]

async function runTest() {
  describe('DataFetcher Pools/Time check', async () => {
    chainIds.forEach((chainId) => {
      //if (chainId !== ChainId.OPTIMISM) return
      const chName = chainName[chainId]

      const dataFetcher = DataFetcher.onChain(chainId)

      it(`${chName}(${chainId})`, async () => {
        dataFetcher.startDataFetching()
        console.log(chName)
        await testDF(
          chName,
          dataFetcher,
          WNATIVE[chainId],
          USDC[chainId as keyof typeof USDC],
          'WNATIVE',
          'USDC',
        )
        await testDF(
          chName,
          dataFetcher,
          SUSHI[chainId as keyof typeof SUSHI],
          FRAX[chainId as keyof typeof FRAX],
          'SUSHI',
          'FRAX',
        )
        await testDF(
          chName,
          dataFetcher,
          SUSHI[chainId as keyof typeof SUSHI],
          USDT[chainId as keyof typeof USDT],
          'SUSHI',
          'USDT',
        )
        dataFetcher.stopDataFetching()
      })
    })
  })
}

runTest()
