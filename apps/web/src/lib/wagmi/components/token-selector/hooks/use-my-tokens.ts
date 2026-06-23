import {
  type TokenListBalances,
  type TokenListChainId,
  getTokenListBalances,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useMemo } from 'react'
import type { WalletAddressFor } from 'src/lib/wallet'
import { Amount } from 'sushi'
import {
  type TokenListTokenMetadata,
  createTokenListCurrency,
} from './token-list-token'

interface UseMyTokens<TChainId extends TokenListChainId> {
  chainId: TChainId | undefined
  account?: WalletAddressFor<TChainId>
  includeNative?: boolean
}

type UseMyTokensDataReturn<TChainId extends TokenListChainId> = {
  tokens: CurrencyFor<TChainId, TokenListTokenMetadata>[]
  balanceMap:
    | Map<AddressFor<TChainId>, Amount<CurrencyFor<TChainId>>>
    | undefined
}

export function useMyTokens<TChainId extends TokenListChainId>({
  chainId,
  account,
  includeNative,
}: UseMyTokens<TChainId>) {
  const { data } = useCustomTokens({ chainId })

  const customTokens = useMemo(() => {
    return Object.values(data)
      .filter((token) => token.chainId === chainId)
      .map((token) => token.address)
  }, [chainId, data])

  const query = useQuery({
    queryKey: [
      'data-api-token-list-balances',
      { chainId, account, customTokens, includeNative },
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
    refetchInterval: ms('10s'),
  })

  return useMemo(() => {
    if (!query.data || !chainId) {
      return {
        ...query,
        data: {
          tokens: [],
          balanceMap: undefined,
        },
      }
    }

    return {
      ...query,
      data: processTokens(query.data, chainId),
    }
  }, [chainId, query])
}

function processTokens<TChainId extends TokenListChainId>(
  tokens: TokenListBalances<TChainId>,
  chainId: TChainId,
): UseMyTokensDataReturn<TChainId> {
  const _tokens: CurrencyFor<TChainId, TokenListTokenMetadata>[] | undefined =
    []
  const balanceMap:
    | Map<AddressFor<TChainId>, Amount<CurrencyFor<TChainId>>>
    | undefined = new Map()

  tokens.forEach((token) => {
    const _token = createTokenListCurrency(chainId, token)

    _tokens.push(_token)
    balanceMap.set(token.address, new Amount(_token, token.balance))
  })

  return { tokens: _tokens, balanceMap }
}
