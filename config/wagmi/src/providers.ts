import type { ChainProviderFn } from '@wagmi/core'
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
  publicProvider(),
]
