import {
  TokenListChainId,
  getTokenListBalances,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { NativeAddress } from 'src/lib/hooks/react-query'
import { Amount, Native, Token, Type } from 'sushi/currency'
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
    let tokens: Type[] | undefined = []
    let balanceMap: Map<Address, Amount<Type>> | undefined = undefined

    if (query.data) {
      tokens = []
      balanceMap = new Map()

      query.data.forEach((token) => {
        let _token: Type
        let address: Address

        if (token.address === NativeAddress) {
          _token = Native.onChain(chainId!)
          address = NativeAddress
        } else {
          _token = new Token(token)
          address = _token.address
        }

        tokens!.push(_token)
        balanceMap!.set(address, Amount.fromRawAmount(_token, token.balance))
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
