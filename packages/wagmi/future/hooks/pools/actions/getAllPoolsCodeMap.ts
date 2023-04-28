import { UsePoolsParams } from '../types'
import { DataFetcher, LiquidityProviders } from '@sushiswap/router'
import { ChainId } from '@sushiswap/chain'
import { createPublicClient, http, fallback } from 'viem'

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
import { Chain } from 'wagmi'
import { isRouteProcessor3ChainId } from '@sushiswap/route-processor'

const isTest = process.env['NODE_ENV'] === 'test' || process.env['NEXT_PUBLIC_PLAYWRIGHT_ENABLED'] === 'true'

const dataFetchers = new Map<ChainId, DataFetcher>()

dataFetchers.set(
  ChainId.ARBITRUM_NOVA,
  new DataFetcher(
    ChainId.ARBITRUM_NOVA,
    createPublicClient({
      chain: arbitrumNova,
      transport: http(arbitrumNova.rpcUrls.default.http[0]),
    })
  )
)
dataFetchers.set(
  ChainId.AVALANCHE,
  new DataFetcher(
    ChainId.AVALANCHE,
    createPublicClient({
      chain: avalanche,
      transport: fallback([http(avalanche.rpcUrls.default.http[0]), http('https://rpc.ankr.com/avalanche')]),
    })
  )
)
dataFetchers.set(
  ChainId.BOBA,
  new DataFetcher(
    ChainId.BOBA,
    createPublicClient({
      chain: boba,
      transport: fallback([http(boba.rpcUrls.default.http[0]), http('https://lightning-replica.boba.network')]),
    })
  )
)
dataFetchers.set(
  ChainId.BOBA_AVAX,
  new DataFetcher(
    ChainId.BOBA_AVAX,
    createPublicClient({
      chain: bobaAvax,
      transport: fallback([http(bobaAvax.rpcUrls.default.http[0]), http('https://replica.avax.boba.network')]),
    })
  )
)
dataFetchers.set(
  ChainId.BOBA_BNB,
  new DataFetcher(
    ChainId.BOBA_BNB,
    createPublicClient({
      chain: bobaBnb,
      transport: fallback([http(bobaBnb.rpcUrls.default.http[0]), http('https://replica.bnb.boba.network')]),
    })
  )
)
dataFetchers.set(
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
dataFetchers.set(
  ChainId.BTTC,
  new DataFetcher(
    ChainId.BTTC,
    createPublicClient({
      chain: bttc,
      transport: http(bttc.rpcUrls.default.http[0]),
    })
  )
)
dataFetchers.set(
  ChainId.ETHEREUM,
  new DataFetcher(
    ChainId.ETHEREUM,
    createPublicClient({
      chain: mainnet,
      transport: isTest ? http('http://localhost:8545') : fallback([
        http(`${mainnet.rpcUrls.alchemy.http}/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
        http('https://eth.llamarpc.com'),
      ]),
    })
  )
)
dataFetchers.set(
  ChainId.POLYGON,
  new DataFetcher(
    ChainId.POLYGON,
    createPublicClient({
      chain: polygon,
      transport: fallback([
        http(`${polygon.rpcUrls.alchemy.http}/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
        http('https://polygon.llamarpc.com'),
      ]),
    })
  )
)
dataFetchers.set(
  ChainId.ARBITRUM,
  new DataFetcher(
    ChainId.ARBITRUM,
    createPublicClient({
      chain: arbitrum,
      transport: fallback([
        http(`${arbitrum.rpcUrls.alchemy.http}/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
        // http(optimism.rpcUrls.default.http[0]),
        http('https://rpc.ankr.com/arbitrum'),
      ]),
    })
  )
)
dataFetchers.set(
  ChainId.OPTIMISM,
  new DataFetcher(
    ChainId.OPTIMISM,
    createPublicClient({
      chain: optimism,
      transport: fallback([
        http(`${optimism.rpcUrls.alchemy.http}/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
        // http(optimism.rpcUrls.default.http[0]),
        http('https://rpc.ankr.com/optimism'),
      ]),
    })
  )
)
dataFetchers.set(
  ChainId.CELO,
  new DataFetcher(
    ChainId.CELO,
    createPublicClient({
      chain: celo as Chain,
      transport: http(celo.rpcUrls.default.http[0]),
    })
  )
)

dataFetchers.set(
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
dataFetchers.set(
  ChainId.FUSE,
  new DataFetcher(
    ChainId.FUSE,
    createPublicClient({
      chain: fuse,
      transport: http(fuse.rpcUrls.default.http[0]),
    })
  )
)
dataFetchers.set(
  ChainId.GNOSIS,
  new DataFetcher(
    ChainId.GNOSIS,
    createPublicClient({
      chain: gnosis,
      transport: fallback([http(gnosis.rpcUrls.default.http[0]), http('https://rpc.ankr.com/gnosis')]),
    })
  )
)
dataFetchers.set(
  ChainId.KAVA,
  new DataFetcher(
    ChainId.KAVA,
    createPublicClient({
      chain: kava,
      transport: fallback([http(kava.rpcUrls.default.http[0]), http(kava.rpcUrls.default.http[1])]),
    })
  )
)
dataFetchers.set(
  ChainId.METIS,
  new DataFetcher(
    ChainId.METIS,
    createPublicClient({
      chain: metis,
      transport: http(metis.rpcUrls.default.http[0]),
    })
  )
)
dataFetchers.set(
  ChainId.MOONBEAM,
  new DataFetcher(
    ChainId.MOONBEAM,
    createPublicClient({
      chain: moonbeam,
      transport: fallback([http(moonbeam.rpcUrls.default.http[0]), http('https://rpc.ankr.com/moonbeam')]),
    })
  )
)
dataFetchers.set(
  ChainId.MOONRIVER,
  new DataFetcher(
    ChainId.MOONRIVER,
    createPublicClient({
      chain: moonriver,
      transport: http(moonriver.rpcUrls.default.http[0]),
    })
  )
)
dataFetchers.set(
  ChainId.HARMONY,
  new DataFetcher(
    ChainId.HARMONY,
    createPublicClient({
      chain: harmony,
      transport: fallback([http(harmony.rpcUrls.default.http[0]), http('https://rpc.ankr.com/harmony')]),
    })
  )
)

export const getAllPoolsCodeMap = async (variables: Omit<UsePoolsParams, 'enabled'>) => {
  // if (!variables.currencyA || !variables.currencyB) {
  //   return new Map()
  // }
  const dataFetcher = dataFetchers.get(variables.chainId) as DataFetcher
  const liquidityProviders = [LiquidityProviders.SushiSwap, LiquidityProviders.Trident]
  if (isRouteProcessor3ChainId(variables.chainId)) {
    liquidityProviders.push(LiquidityProviders.SushiSwapV3)
  }
  dataFetcher.startDataFetching(liquidityProviders)
  await dataFetcher.fetchPoolsForToken(variables.currencyA!, variables.currencyB!)
  dataFetcher.stopDataFetching()
  return dataFetcher.getCurrentPoolCodeMap(variables.currencyA!, variables.currencyB!)
}
