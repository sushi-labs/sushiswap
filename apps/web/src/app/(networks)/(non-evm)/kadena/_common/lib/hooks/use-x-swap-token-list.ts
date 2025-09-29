import type {
  GetTokenListParams,
  GetTokenListResponse,
} from '@kinesis-bridge/kinesis-sdk/dist/types'
import { useQuery } from '@tanstack/react-query'
import { EvmChainId, EvmToken } from 'sushi/evm'
import { KvmChainId, KvmToken, type KvmTokenAddress } from 'sushi/kvm'
import { kinesisClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'

export type XSwapToken = KvmToken | EvmToken

export type XSwapTokenList = {
  kadena: KvmToken[]
  ethereum: EvmToken[]
}

export const useXSwapTokenList = () => {
  const { data, isLoading, isError } = useQuery<
    [GetTokenListResponse, GetTokenListResponse], // queryFn returns tuple
    Error,
    XSwapTokenList
  >({
    queryKey: ['xswap-token-list'],
    queryFn: async () => {
      return Promise.all([
        // Ethereum mainnet
        kinesisClient.getTokenList({
          network: 'ethereum',
          chainId: 1 as const, // mainnet
        }),
        // Kadena mainnet01 (your configured chain)
        kinesisClient.getTokenList({
          network: KADENA_NETWORK_ID,
          chainId: Number(KADENA_CHAIN_ID) as GetTokenListParams['chainId'],
        }),
      ])
    },
    select: ([ethRes, kadenaRes]) => {
      const kadena: KvmToken[] = kadenaRes.tokens.map(
        (token) =>
          new KvmToken({
            chainId: KvmChainId.KADENA,
            address: token.tokenAddress as KvmTokenAddress,
            symbol: token.symbol,
            decimals: token.decimals,
            name: token.symbol,
            metadata: {
              imageUrl: token.imageUri ?? undefined,
              validated: false,
              kadenaChainId: token.chainId.toString(),
              kadenaNetworkId: token.network,
            },
          }),
      )

      const ethereum: EvmToken[] = ethRes.tokens.map(
        (token) =>
          new EvmToken({
            chainId: EvmChainId.ETHEREUM,
            address: token.tokenAddress as `0x${string}`,
            symbol: token.symbol,
            decimals: token.decimals,
            name: token.symbol,
            metadata: {
              imageUrl: token.imageUri ?? undefined,
              validated: false,
            },
          }),
      )

      return { kadena, ethereum }
    },
  })

  return {
    data,
    isLoading,
    isError,
  }
}
