import { otherChains } from '@sushiswap/wagmi-config'
import { allChains, configureChains, createClient } from '@wagmi/core'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from '@wagmi/core/providers/public'

const alchemyId = process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID

if (!alchemyId) {
  throw Error('NO ALCHEMY ID SET')
}

const { provider } = configureChains(
  [...allChains, ...otherChains],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain_) => ({
        http: chain_.rpcUrls.default,
      }),
    }),
    alchemyProvider({ apiKey: alchemyId }),
  ]
)

createClient({
  autoConnect: true,
  provider,
})
