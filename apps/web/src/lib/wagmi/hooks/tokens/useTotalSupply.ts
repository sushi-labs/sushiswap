'use client'

import { keepPreviousData, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { Amount } from 'sushi'
import type { EvmToken } from 'sushi/evm'
import { type Address, erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'

function bigIntToCurrencyAmount(totalSupply?: bigint, token?: EvmToken) {
  return token?.type === 'token' && totalSupply
    ? new Amount(token, totalSupply.toString())
    : undefined
}

export const useMultipleTotalSupply = (
  tokens?: EvmToken[],
): Record<string, Amount<EvmToken> | undefined> | undefined => {
  const contracts = useMemo(() => {
    return (
      tokens?.map((token) => {
        return {
          address: token.wrap().address as Address,
          chainId: token.chainId,
          abi: erc20Abi,
          functionName: 'totalSupply' as const,
        }
      }) || []
    )
  }, [tokens])

  const queryClient = useQueryClient()

  const { data, queryKey } = useReadContracts({
    contracts,
    query: {
      enabled: tokens && tokens.length > 0,
      placeholderData: keepPreviousData,
    },
  })

  // Doesn't make sense to refresh based on one chain's blocknumber
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false })
    }, 4_000)

    return () => clearInterval(interval)
  }, [queryClient, queryKey])

  return useMemo(() => {
    return data
      ?.map((cs, i) => bigIntToCurrencyAmount(cs.result, tokens?.[i]))
      .reduce<Record<string, Amount<EvmToken> | undefined>>((acc, curr, i) => {
        if (curr && tokens?.[i]) {
          acc[tokens[i]?.wrap().address] = curr
        }
        return acc
      }, {})
  }, [data, tokens])
}

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export const useTotalSupply = (
  token?: EvmToken,
): Amount<EvmToken> | undefined => {
  const tokens = useMemo(() => (token ? [token] : undefined), [token])
  const resultMap = useMultipleTotalSupply(tokens)
  return useMemo(
    () => (token ? resultMap?.[token.wrap().address] : undefined),
    [resultMap, token],
  )
}
