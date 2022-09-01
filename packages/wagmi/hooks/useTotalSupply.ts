import { Result } from '@ethersproject/abi'
import { Amount, Token } from '@sushiswap/currency'
import { useMemo } from 'react'
import { erc20ABI, useContractReads } from 'wagmi'

function bigNumToCurrencyAmount(totalSupply?: Result, token?: Token) {
  return token?.isToken && totalSupply ? Amount.fromRawAmount(token, totalSupply.toString()) : undefined
}

export const useMultipleTotalSupply = (tokens?: Token[]): Record<string, Amount<Token> | undefined> | undefined => {
  const contracts = useMemo(() => {
    return (
      tokens?.map((token) => {
        return {
          addressOrName: token.wrapped.address,
          chainId: token.chainId,
          contractInterface: erc20ABI,
          functionName: 'totalSupply',
        }
      }) || []
    )
  }, [tokens])

  const { data } = useContractReads({
    contracts,
    enabled: tokens && tokens.length > 0,
    watch: true,
    cacheOnBlock: true,
    keepPreviousData: true,
  })

  return useMemo(() => {
    return data
      ?.map((cs, i) => bigNumToCurrencyAmount(cs, tokens?.[i]))
      .reduce<Record<string, Amount<Token> | undefined>>((acc, curr, i) => {
        if (curr && tokens?.[i]) {
          acc[tokens[i]?.wrapped.address] = curr
        }
        return acc
      }, {})
  }, [data, tokens])
}

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export const useTotalSupply = (token?: Token): Amount<Token> | undefined => {
  const tokens = useMemo(() => (token ? [token] : undefined), [token])
  const resultMap = useMultipleTotalSupply(tokens)
  return useMemo(() => (token ? resultMap?.[token.wrapped.address] : undefined), [resultMap, token])
}
