import {
  type TokenListBalances,
  type TokenListChainId,
  getTokenListBalances,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useMemo } from 'react'
import { type AddressFor, Amount, getNativeAddress } from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  EvmToken,
  isEvmChainId,
} from 'sushi/evm'
import {
  type SvmAddress,
  type SvmChainId,
  type SvmCurrency,
  SvmNative,
  SvmToken,
  isSvmChainId,
} from 'sushi/svm'
import type { Address } from 'viem'

interface UseMyTokens<TChainId extends TokenListChainId> {
  chainId: TChainId | undefined
  account?: AddressFor<TChainId>
  includeNative?: boolean
}

type UseMyTokensDataReturn<TChainId extends TokenListChainId> =
  TChainId extends EvmChainId
    ? ReturnType<typeof processEvmTokens>
    : TChainId extends SvmChainId
      ? ReturnType<typeof processSvmTokens>
      : never

export function useMyTokens<TChainId extends TokenListChainId>({
  chainId,
  account,
  includeNative,
}: UseMyTokens<TChainId>) {
  const { data } = useCustomTokens()

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
    let data

    if (!query.data || !chainId) {
      return {
        ...query,
        data: {
          tokens: [],
          balanceMap: undefined,
        },
      }
    }

    if (isEvmChainId(chainId)) {
      data = processEvmTokens(
        query.data as TokenListBalances<TokenListChainId & EvmChainId>,
        chainId,
      )
    } else if (isSvmChainId(chainId)) {
      data = processSvmTokens(
        query.data as TokenListBalances<TokenListChainId & SvmChainId>,
        chainId,
      )
    }

    return {
      ...query,
      data: data as UseMyTokensDataReturn<TChainId>,
    }
  }, [chainId, query])
}

function processEvmTokens(
  tokens: TokenListBalances<TokenListChainId & EvmChainId>,
  chainId: TokenListChainId & EvmChainId,
) {
  const _tokens: EvmCurrency<{ approved: boolean }>[] | undefined = []
  const balanceMap: Map<Address, Amount<EvmCurrency>> | undefined = new Map()

  const nativeAddress = getNativeAddress(chainId)

  tokens.forEach((token) => {
    let _token: EvmCurrency<{ approved: boolean }>
    let address: EvmAddress

    if (token.address === nativeAddress) {
      _token = EvmNative.fromChainId(chainId)
      address = nativeAddress
    } else {
      _token = new EvmToken({
        ...token,
        metadata: { approved: token.approved },
      })
      address = _token.address
    }

    _tokens.push(_token)
    balanceMap.set(address, new Amount(_token, token.balance))
  })

  return { tokens: _tokens, balanceMap }
}

function processSvmTokens(
  tokens: TokenListBalances<TokenListChainId & SvmChainId>,
  chainId: TokenListChainId & SvmChainId,
) {
  const _tokens: SvmCurrency<{ approved: boolean }>[] | undefined = []
  const balanceMap: Map<SvmAddress, Amount<SvmCurrency>> | undefined = new Map()

  const nativeAddress = getNativeAddress(chainId)

  tokens.forEach((token) => {
    let _token: SvmCurrency<{ approved: boolean }>
    let address: SvmAddress

    if (token.address === nativeAddress) {
      _token = SvmNative.fromChainId(chainId)
      address = nativeAddress
    } else {
      _token = new SvmToken({
        ...token,
        metadata: { approved: token.approved },
      })
      address = _token.address
    }
    _tokens.push(_token)
    balanceMap.set(address, new Amount(_token, token.balance))
  })

  return { tokens: _tokens, balanceMap }
}
