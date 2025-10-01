import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi'
import type { EvmChainId, EvmToken } from 'sushi/evm'
import { isEvmChainId } from 'sushi/evm'
import type { KvmChainId, KvmToken, KvmTokenAddress } from 'sushi/kvm'
import { isKvmChainId } from 'sushi/kvm'
import { useXSwapTokenList } from './use-x-swap-token-list'

export type XSwapToken = KvmToken | EvmToken

type Params = {
  chainId: KvmChainId | EvmChainId
  address: string
  enabled?: boolean
}

export const useXChainSwapTokenInfo = ({
  chainId,
  address,
  enabled = true,
}: Params) => {
  const { data: tokenLists } = useXSwapTokenList()

  return useQuery<XSwapToken | undefined>({
    queryKey: ['xswap-token-info', chainId, address, enabled],
    enabled: Boolean(enabled && address && chainId && tokenLists),
    queryFn: async () => {
      if (!tokenLists) return

      if (isKvmChainId(chainId)) {
        return (
          tokenLists.kadena.find(
            (t) => t.address === (address as KvmTokenAddress),
          ) ?? undefined
        )
      }

      if (isEvmChainId(chainId)) {
        return (
          tokenLists.ethereum.find(
            (t) =>
              t.address.toLowerCase() ===
              (address as `0x${string}`).toLowerCase(),
          ) ?? undefined
        )
      }

      return undefined
    },
  })
}

export function findCrossChainEquivalentToken(
  token: XSwapToken,
  tokenLists: { kadena: KvmToken[]; ethereum: EvmToken[] },
): XSwapToken | undefined {
  if (token.chainId === ChainId.KADENA) {
    return tokenLists.ethereum.find(
      (t) => t.symbol.toLowerCase() === token.symbol.toLowerCase(),
    )
  }

  if (token.chainId === ChainId.ETHEREUM) {
    return tokenLists.kadena.find(
      (t) => t.symbol.toLowerCase() === token.symbol.toLowerCase(),
    )
  }

  return undefined
}
