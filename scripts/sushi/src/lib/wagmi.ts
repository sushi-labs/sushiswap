// import {allChains, allProviders } from '@sushiswap/wagmi-config'
import { allChains } from '@sushiswap/wagmi-config/chains'
import { allProviders } from '@sushiswap/wagmi-config/providers'
import { configureChains, createClient } from '@wagmi/core'

const alchemyId = process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID

if (!alchemyId) {
  throw Error('NO ALCHEMY ID SET')
}

const { provider } = configureChains(allChains, allProviders)

createClient({
  autoConnect: true,
  provider,
})
