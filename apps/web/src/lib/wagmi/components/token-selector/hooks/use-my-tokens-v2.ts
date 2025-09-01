import {
  type TokenListV2ChainId,
  getTokenListBalancesV2,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { NativeAddress } from 'src/lib/constants'
import { Amount } from 'sushi'
import { type EvmCurrency, EvmNative, EvmToken } from 'sushi/evm'
import type { Address } from 'viem'

interface UseMyTokensV2 {
  chainIds: TokenListV2ChainId[] | undefined
  account?: Address
  includeNative?: boolean
}

export function useMyTokensV2({
  chainIds,
  account,
  includeNative,
}: UseMyTokensV2) {
  const { data } = useCustomTokens()

  const customTokens = useMemo(() => {
    return Object.values(data)
      .filter((token) =>
        chainIds?.includes(token.chainId as TokenListV2ChainId),
      )
      .map((token) => ({
        address: token.address,
        chainId: token.chainId as unknown,
      }))
  }, [chainIds, data])

  const query = useQuery({
    queryKey: [
      'data-api-token-list-balances-v2',
      { chainIds, customTokens, includeNative },
    ],
    queryFn: async () => {
      if (!account) throw new Error('Account is required')
      if (!chainIds) throw new Error('ChainIds are required')

      return getTokenListBalancesV2({
        chainIds,
        account,
        customTokens,
        includeNative,
      })
    },
    enabled: Boolean(account && chainIds),
  })

  return useMemo(() => {
    let tokens: EvmCurrency[] | undefined = []
    let balanceMap: Map<string, Amount<EvmCurrency>> | undefined = undefined
    let priceMap: Map<string, number> | undefined = undefined
    // let bridgeInfoMap: Map<string, { address: string; chainId: TokenListV2ChainId; decimals: number }> | undefined = undefined;
    let bridgeInfoMap:
      | Map<
          string,
          { address: string; chainId: unknown; decimals: number }[] | null
        >
      | undefined = undefined

    if (query.data) {
      tokens = []
      balanceMap = new Map()
      priceMap = new Map()
      bridgeInfoMap = new Map()

      query.data.forEach((token) => {
        let _token: EvmCurrency
        // token.

        if (token.address === NativeAddress) {
          _token = EvmNative.fromChainId(token.chainId as TokenListV2ChainId)
        } else {
          _token = new EvmToken({
            chainId: token.chainId as TokenListV2ChainId,
            address: token.address,
            decimals: token.decimals,
            symbol: token.symbol,
            name: token.name,
            metadata: {
              approved: token.approved,
            },
          })
        }

        tokens!.push(_token)
        balanceMap!.set(_token.id, new Amount(_token, token.balance))
        priceMap!.set(_token.id, token.priceUSD)
        bridgeInfoMap!.set(_token.id, token?.bridgeInfo ?? null)
      })
    }

    return {
      ...query,
      data: {
        tokens,
        balanceMap,
        priceMap,
        bridgeInfoMap,
      },
    }
  }, [query])
}
