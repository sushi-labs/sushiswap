import { allChains } from '@sushiswap/wagmi-config/chains'
import { configureChains, createClient, mainnet } from '@wagmi/core'
// import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { publicProvider } from '@wagmi/core/providers/public'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

// const alchemyId = process.env['ALCHEMY_ID'] || process.env['NEXT_PUBLIC_ALCHEMY_ID']

// if (!alchemyId) {
//   throw Error('NO ALCHEMY ID SET')
// }
createClient(
  configureChains([mainnet], [
    // publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: 'http://127.0.0.1:8545'
      }),
    }),
    
    // alchemyProvider({ apiKey: alchemyId })
  ])
)
