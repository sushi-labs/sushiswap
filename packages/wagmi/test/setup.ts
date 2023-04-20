import { Chain, CreateClientConfig, configureChains, createClient } from 'wagmi'
import { allChains, allProviders } from '@sushiswap/wagmi-config'

const { provider }: CreateClientConfig & { chains: Chain[] } = configureChains(allChains, allProviders, {
  pollingInterval: 8_000,
})

createClient({
  provider,
  autoConnect: true,
  connectors: [],
})