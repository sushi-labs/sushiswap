import { allChains } from '@sushiswap/wagmi-config/chains'
import { allProviders } from '@sushiswap/wagmi-config/providers'
import { configureChains, createConfig } from '@wagmi/core'

const { publicClient } = configureChains(allChains, allProviders)

createConfig({
  autoConnect: true,
  publicClient,
})
