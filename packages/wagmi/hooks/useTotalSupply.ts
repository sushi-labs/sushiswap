import { Amount, Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { erc20ABI, useContractReads } from 'wagmi'

function bigNumToCurrencyAmount(totalSupply?: BigNumber, token?: Token) {
  return token?.isToken && totalSupply ? Amount.fromRawAmount(token, totalSupply.toString()) : undefined
}

export const useMultipleTotalSupply = (tokens?: Token[]): Record<string, Amount<Token> | undefined> | undefined => {
  const { data } = useContractReads({
    contracts:
      tokens?.map((token) => {
        return {
          addressOrName: token.wrapped.address,
          chainId: token.chainId,
          contractInterface: erc20ABI,
          functionName: 'totalSupply',
        }
      }) || [],
    enabled: tokens && tokens.length > 0,
  })

  return data
    ?.map((cs, i) => bigNumToCurrencyAmount(cs.result?.[0], tokens?.[i]))
    .reduce<Record<string, Amount<Token> | undefined>>((acc, curr, i) => {
      if (curr && tokens?.[i]) {
        acc[tokens[i]!.wrapped.address] = curr
      }
      return acc
    }, {})
}

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export const useTotalSupply = (token?: Token): Amount<Token> | undefined => {
  const resultMap = useMultipleTotalSupply(token ? [token] : undefined)
  return token ? resultMap?.[token.wrapped.address] : undefined
}
