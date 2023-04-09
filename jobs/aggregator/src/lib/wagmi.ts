import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { configureChains, createClient } from '@wagmi/core'

const alchemyId = process.env['ALCHEMY_ID']

if (!alchemyId) {
  throw Error('NO ALCHEMY ID SET')
}

const { provider } = configureChains(allChains, allProviders)

createClient({
  autoConnect: true,
  provider,
})
