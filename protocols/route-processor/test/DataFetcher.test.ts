import { ChainId } from '@sushiswap/chain'
import { USDC, WETH9 } from '@sushiswap/currency'
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
import { createPublicClient, fallback, http } from 'viem'

describe('DataFetcher Pools/Time check', () => {
  it('ethereum', async () => {
    const dataFetcher = new DataFetcher(
      ChainId.ETHEREUM,
      createPublicClient({
        chain: mainnet,
        transport: fallback([
          http(`${mainnet.rpcUrls.alchemy.http}/${process.env.ALCHEMY_ID}`),
          http('https://eth.llamarpc.com'),
        ]),
      })
    )
    const start = performance.now()
    dataFetcher.startDataFetching()
    await dataFetcher.fetchPoolsForToken(WETH9[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM])
    dataFetcher.stopDataFetching()
    const pools = dataFetcher.getCurrentPoolCodeMap(WETH9[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM])
    const time = Math.round(performance.now() - start)
    console.log(`Found pools: ${pools.size}, time: ${time}ms`)
  })
})
