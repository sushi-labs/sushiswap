import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi'
import type { EvmChainId, EvmToken } from 'sushi/evm'
import { isEvmChainId } from 'sushi/evm'
import type { KvmChainId, KvmToken, KvmTokenAddress } from 'sushi/kvm'
import { isKvmChainId } from 'sushi/kvm'
import type { KinesisToken } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { useKinesisTokenList } from './use-kinesis-token-list'

type Params = {
  chainId: KvmChainId | EvmChainId
  address: string
  enabled?: boolean
}

export const useKinesisTokenInfo = ({
  chainId,
  address,
  enabled = true,
}: Params) => {
  const { data: tokenLists } = useKinesisTokenList()

  return useQuery<KinesisToken | undefined>({
    queryKey: ['kinesis-x-chain-token-info', chainId, address, enabled],
    enabled: Boolean(enabled && address && chainId && tokenLists),
    queryFn: async () => {
      if (!tokenLists) return

      if (isKvmChainId(chainId)) {
        const _address =
          address === 'coin'
            ? 'n_e595727b657fbbb3b8e362a05a7bb8d12865c1ff.KDA'
            : address
        return (
          tokenLists.kadena.find(
            (t) =>
              t.address.toLowerCase() ===
              (_address as KvmTokenAddress).toLowerCase(),
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

export function findKinesisEquivalentToken(
  token: KinesisToken,
  tokenLists: { kadena: KvmToken[]; ethereum: EvmToken[] },
): KinesisToken | undefined {
  let tokenSymbol = token.symbol.toLowerCase()
  if (tokenSymbol.includes('kb-')) {
    tokenSymbol = tokenSymbol.replace('kb-', '')
  }

  if (token.chainId === ChainId.KADENA) {
    return tokenLists.ethereum.find(
      (t) => t.symbol.toLowerCase() === tokenSymbol,
    )
  }

  if (token.chainId === ChainId.ETHEREUM) {
    return tokenLists.kadena.find((t) => t.symbol.toLowerCase() === tokenSymbol)
  }

  return undefined
}
