import { Interface } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Token } from '@sushiswap/core-sdk'
import ERC20_ABI from 'app/constants/abis/erc20.json'
import { useMultipleContractSingleData } from 'app/lib/hooks/multicall'

function bigNumToCurrencyAmount(totalSupply?: BigNumber, token?: Currency) {
  return token?.isToken && totalSupply ? CurrencyAmount.fromRawAmount(token, totalSupply.toString()) : undefined
}

export const useMultipleTotalSupply = (tokens?: (Currency | undefined)[]): Record<string, CurrencyAmount<Token>> => {
  return useMultipleContractSingleData(
    tokens?.map((t) => (t?.isToken ? t.address : undefined)) ?? [],
    new Interface(ERC20_ABI),
    'totalSupply'
  )
    .map((cs, i) => bigNumToCurrencyAmount(cs.result?.[0], tokens?.[i]))
    .reduce((acc, curr, i) => {
      if (curr && tokens?.[i]) {
        acc[tokens[i]!.wrapped.address] = curr
      }
      return acc
    }, {} as Record<string, CurrencyAmount<Token>>)
}

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export const useTotalSupply = (token?: Currency): CurrencyAmount<Token> | undefined => {
  const resultMap = useMultipleTotalSupply([token])
  return token ? resultMap[token.wrapped.address] : undefined
}
