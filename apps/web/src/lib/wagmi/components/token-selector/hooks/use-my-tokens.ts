import {
  type TokenListChainId,
  getTokenListBalances,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { NativeAddress } from 'src/lib/constants'
import { Amount } from 'sushi'
import { type EvmCurrency, EvmNative, EvmToken } from 'sushi/evm'
import type { Address } from 'viem'

interface UseMyTokens {
  chainId: TokenListChainId | undefined
  account?: Address
  includeNative?: boolean
}

export function useMyTokens({ chainId, account, includeNative }: UseMyTokens) {
  const { data } = useCustomTokens()

  const customTokens = useMemo(() => {
    return Object.values(data)
      .filter((token) => token.chainId === chainId)
      .map((token) => token.address)
  }, [chainId, data])

  const query = useQuery({
    queryKey: [
      'data-api-token-list-balances',
      { chainId, customTokens, includeNative },
    ],
    queryFn: async () => {
      if (!account) throw new Error('Account is required')
      if (!chainId) throw new Error('ChainId is required')

      return getTokenListBalances({
        chainId,
        account,
        customTokens,
        includeNative,
      })
    },
    enabled: Boolean(account && chainId),
  })

  return useMemo(() => {
    let tokens: EvmCurrency<{ approved: boolean }>[] | undefined = []
    let balanceMap: Map<Address, Amount<EvmCurrency>> | undefined = undefined

    if (query.data) {
      tokens = []
      balanceMap = new Map()

      query.data.forEach((token) => {
        let _token: EvmCurrency<{ approved: boolean }>
        let address: Address

        if (token.address === NativeAddress) {
          _token = EvmNative.fromChainId(chainId!)
          address = NativeAddress
        } else {
          _token = new EvmToken({
            ...token,
            metadata: { approved: token.approved },
          })
          address = _token.address
        }

        tokens!.push(_token)
        balanceMap!.set(address, new Amount(_token, token.balance))
      })
    }

    return {
      ...query,
      data: {
        tokens,
        balanceMap,
      },
    }
  }, [chainId, query])
}
