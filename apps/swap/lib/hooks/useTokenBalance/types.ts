import { Amount, Token } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'

export type LoadingState<T> = { isLoading: true; isError: boolean; data?: T }
export type SuccessState<T> = { isLoading: false; isError: boolean; data: T }
export type ErrorState<T> = { isLoading: false; isError: true; data?: T }

export type UseTokenBalances = (
  chainId: number,
  account: string | undefined,
  tokens: (Token | undefined)[],
  fundSource?: FundSource
) =>
  | SuccessState<Record<string, Amount<Token>>>
  | LoadingState<Record<string, Amount<Token>>>
  | ErrorState<Record<string, Amount<Token>>>

export type UseTokenBalance = (
  chainId: number,
  account: string | undefined,
  token: Token | undefined,
  fundSource?: FundSource
) => SuccessState<Amount<Token>> | LoadingState<Amount<Token>> | ErrorState<Amount<Token>>
