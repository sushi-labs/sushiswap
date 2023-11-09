import type { ChainProviderFn } from '@wagmi/core'
// import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from '@wagmi/core/providers/public'
import { type RpcEnabledChainId, rpcUrls } from './rpc-urls.js'

export const allProviders: ChainProviderFn[] = [
  jsonRpcProvider({
    rpc: (chain) => {
      // we can add others here, but for now we only support drpc
      if (!rpcUrls[chain.id as RpcEnabledChainId]) {
        return null
      }
      return {
        http: rpcUrls[chain.id as RpcEnabledChainId][0] as string,
      }
    },
  }),
  // alchemyProvider({
  //   apiKey: (process.env['ALCHEMY_ID'] ||
  //     process.env['NEXT_PUBLIC_ALCHEMY_ID']) as string,
  // }),
  // infuraProvider({ infuraId }),
  publicProvider(),
]
