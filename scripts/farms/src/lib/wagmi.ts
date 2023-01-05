import { allChains } from '@sushiswap/wagmi-config/chains'
import { configureChains, createClient } from '@wagmi/core'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from '@wagmi/core/providers/public'

const alchemyId = process.env['ALCHEMY_ID'] || process.env['NEXT_PUBLIC_ALCHEMY_ID']

if (!alchemyId) {
  throw Error('NO ALCHEMY ID SET')
}

console.log({allChains})

createClient(configureChains(allChains, [publicProvider(), 
  // alchemyProvider({ apiKey: alchemyId }) 
]))
