import { Amount, Token } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { ErrorState, LoadingState, SuccessState } from 'hooks/types'

export type UseTokenBalances = (
  account: string | undefined,
  tokens: (Token | undefined)[],
  fundSource?: FundSource
) =>
  | SuccessState<Record<string, Amount<Token>>>
  | LoadingState<Record<string, Amount<Token>>>
  | ErrorState<Record<string, Amount<Token>>>

export type UseTokenBalance = (
  account: string | undefined,
  token: Token | undefined,
  fundSource?: FundSource
) => SuccessState<Amount<Token>> | LoadingState<Amount<Token>> | ErrorState<Amount<Token>>
