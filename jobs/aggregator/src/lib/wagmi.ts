import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { configureChains, createConfig } from '@wagmi/core'

const alchemyId = process.env['ALCHEMY_ID']

if (!alchemyId) {
  throw Error('NO ALCHEMY ID SET')
}

const { publicClient } = configureChains(allChains, allProviders)

createConfig({
  autoConnect: true,
  publicClient,
})
