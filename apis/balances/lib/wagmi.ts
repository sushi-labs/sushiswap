import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { configureChains, createClient } from '@wagmi/core'

const alchemyId = process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID

if (!alchemyId) {
  throw Error('NO ALCHEMY ID SET')
}

const { provider, webSocketProvider } = configureChains(allChains, allProviders)

createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})
