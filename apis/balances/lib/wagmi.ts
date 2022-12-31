import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { configureChains, createClient } from '@wagmi/core'

const { provider, webSocketProvider } = configureChains(allChains, allProviders)

createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})
