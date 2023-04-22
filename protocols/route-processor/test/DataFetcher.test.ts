import { ChainId, chainName } from '@sushiswap/chain'
import { FRAX, SUSHI, Token, Type, USDC, USDT, WNATIVE } from '@sushiswap/currency'
import { DataFetcher } from '@sushiswap/router'
import {
  arbitrum,
  arbitrumNova,
  avalanche,
  boba,
  bobaAvax,
  bobaBnb,
  bsc,
  bttc,
  celo,
  fantom,
  fuse,
  gnosis,
  harmony,
  kava,
  mainnet,
  metis,
  moonbeam,
  moonriver,
  optimism,
  polygon,
} from '@sushiswap/viem-config'
import { createPublicClient, fallback, http, PublicClient } from 'viem'

async function getDataFetcherMap(): Promise<Map<ChainId, DataFetcher>> {
  const dataFetcherMap = new Map<ChainId, DataFetcher>()
  dataFetcherMap.set(
    ChainId.ARBITRUM_NOVA,
    new DataFetcher(
      ChainId.ARBITRUM_NOVA,
      createPublicClient({
        chain: arbitrumNova,
        transport: http(arbitrumNova.rpcUrls.default.http[0]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.AVALANCHE,
    new DataFetcher(
      ChainId.AVALANCHE,
      createPublicClient({
        chain: avalanche,
        transport: fallback([http(avalanche.rpcUrls.default.http[0]), http('https://rpc.ankr.com/avalanche')]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.BOBA,
    new DataFetcher(
      ChainId.BOBA,
      createPublicClient({
        chain: boba,
        transport: fallback([http(boba.rpcUrls.default.http[0]), http('https://lightning-replica.boba.network')]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.BOBA_AVAX,
    new DataFetcher(
      ChainId.BOBA_AVAX,
      createPublicClient({
        chain: bobaAvax,
        transport: fallback([http(bobaAvax.rpcUrls.default.http[0]), http('https://replica.avax.boba.network')]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.BOBA_BNB,
    new DataFetcher(
      ChainId.BOBA_BNB,
      createPublicClient({
        chain: bobaBnb,
        transport: fallback([http(bobaBnb.rpcUrls.default.http[0]), http('https://replica.bnb.boba.network')]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.BSC,
    new DataFetcher(
      ChainId.BSC,
      createPublicClient({
        chain: bsc,
        transport: fallback([
          http(bsc.rpcUrls.default.http[0]),
          http('https://bsc-dataseed.binance.org'),
          http('https://bsc-dataseed1.binance.org'),
          http('https://bsc-dataseed2.binance.org'),
        ]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.BTTC,
    new DataFetcher(
      ChainId.BTTC,
      createPublicClient({
        chain: bttc,
        transport: http(bttc.rpcUrls.default.http[0]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.ETHEREUM,
    new DataFetcher(
      ChainId.ETHEREUM,
      createPublicClient({
        chain: mainnet,
        transport: fallback([
          http(`${mainnet.rpcUrls.alchemy.http}/${process.env.ALCHEMY_ID}`),
          http('https://eth.llamarpc.com'),
        ]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.POLYGON,
    new DataFetcher(
      ChainId.POLYGON,
      createPublicClient({
        chain: polygon,
        transport: fallback([
          http(polygon.rpcUrls.alchemy.http + '/' + process.env.ALCHEMY_ID),
          http('https://polygon.llamarpc.com'),
        ]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.ARBITRUM,
    new DataFetcher(
      ChainId.ARBITRUM,
      createPublicClient({
        chain: arbitrum,
        transport: fallback([
          http(arbitrum.rpcUrls.alchemy.http + '/' + process.env.ALCHEMY_ID),
          // http(optimism.rpcUrls.default.http[0]),
          http('https://rpc.ankr.com/arbitrum'),
        ]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.OPTIMISM,
    new DataFetcher(
      ChainId.OPTIMISM,
      createPublicClient({
        chain: optimism,
        transport: fallback([
          http(optimism.rpcUrls.alchemy.http + '/' + process.env.ALCHEMY_ID),
          // http(optimism.rpcUrls.default.http[0]),
          http('https://rpc.ankr.com/optimism'),
        ]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.CELO,
    new DataFetcher(
      ChainId.CELO,
      createPublicClient({
        chain: celo,
        transport: http(celo.rpcUrls.default.http[0]),
      }) as PublicClient
    )
  )

  dataFetcherMap.set(
    ChainId.FANTOM,
    new DataFetcher(
      ChainId.FANTOM,
      createPublicClient({
        chain: fantom,
        transport: fallback([
          http(fantom.rpcUrls.default.http[0]),
          http('https://rpc.fantom.network'),
          http('https://rpc2.fantom.network'),
        ]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.FUSE,
    new DataFetcher(
      ChainId.FUSE,
      createPublicClient({
        chain: fuse,
        transport: http(fuse.rpcUrls.default.http[0]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.GNOSIS,
    new DataFetcher(
      ChainId.GNOSIS,
      createPublicClient({
        chain: gnosis,
        transport: fallback([http(gnosis.rpcUrls.default.http[0]), http('https://rpc.ankr.com/gnosis')]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.KAVA,
    new DataFetcher(
      ChainId.KAVA,
      createPublicClient({
        chain: kava,
        transport: fallback([http(kava.rpcUrls.default.http[0]), http(kava.rpcUrls.default.http[1])]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.METIS,
    new DataFetcher(
      ChainId.METIS,
      createPublicClient({
        chain: metis,
        transport: http(metis.rpcUrls.default.http[0]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.MOONBEAM,
    new DataFetcher(
      ChainId.MOONBEAM,
      createPublicClient({
        chain: moonbeam,
        transport: fallback([http(moonbeam.rpcUrls.default.http[0]), http('https://rpc.ankr.com/moonbeam')]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.MOONRIVER,
    new DataFetcher(
      ChainId.MOONRIVER,
      createPublicClient({
        chain: moonriver,
        transport: http(moonriver.rpcUrls.default.http[0]),
      })
    )
  )
  dataFetcherMap.set(
    ChainId.HARMONY,
    new DataFetcher(
      ChainId.HARMONY,
      createPublicClient({
        chain: harmony,
        transport: fallback([http(harmony.rpcUrls.default.http[0]), http('https://rpc.ankr.com/harmony')]),
      })
    )
  )
  return dataFetcherMap
}

async function testDF(
  chainName: string,
  dataFetcher: DataFetcher,
  t0: Type | undefined,
  t1: Type | undefined,
  name0: string,
  name1: string
) {
  if (!t0 || !t1) return
  const start = performance.now()
  await dataFetcher.fetchPoolsForToken(t0, t1)
  const pools = dataFetcher.getCurrentPoolCodeMap(t0, t1)
  const time = Math.round(performance.now() - start)
  console.log(`     found pools(${name0}-${name1}): ${pools.size} time=${time}ms`)
  dataFetcher.providers.forEach((p) => {
    const poolCodes = p.getCurrentPoolList(t0 as Token, t1 as Token)
    if (poolCodes.length) console.log(`          ${p.getPoolProviderName()} pools: ${poolCodes.length}`)
  })
}

async function runTest() {
  const dataFetcherMap = await getDataFetcherMap()
  describe('DataFetcher Pools/Time check', async () => {
    dataFetcherMap.forEach((dataFetcher, chainId) => {
      //if (chainId !== ChainId.POLYGON) return
      const chName = chainName[chainId]
      it(`${chName}(${chainId})`, async () => {
        dataFetcher.startDataFetching()
        console.log(chName)
        await testDF(chName, dataFetcher, WNATIVE[chainId], USDC[chainId as keyof typeof USDC], 'WNATIVE', 'USDC')
        await testDF(
          chName,
          dataFetcher,
          SUSHI[chainId as keyof typeof SUSHI],
          FRAX[chainId as keyof typeof FRAX],
          'SUSHI',
          'FRAX'
        )
        await testDF(
          chName,
          dataFetcher,
          SUSHI[chainId as keyof typeof SUSHI],
          USDT[chainId as keyof typeof USDT],
          'SUSHI',
          'USDT'
        )
        dataFetcher.stopDataFetching()
      })
    })
  })
}

runTest()
