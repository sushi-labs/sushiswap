import { ChainId, CurrencyAmount, Token } from '@sushiswap/core-sdk'

import { BaseStrategyHook } from './strategies/useBaseStrategy'
import { BaseStrategyWithBentoBoxTraitHook } from './traits/useBentoBoxTrait'
import { BaseStrategyWithHasPermitTokenHook } from './traits/useHasPermitTokenTrait'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export interface Strategy {
  id: string
  general: StrategyGeneralInfo
  tokenDefinitions: StrategyTokenDefinitions
}

export interface StrategyGeneralInfo {
  name: string
  steps: string[]
  zapMethod: string
  unzapMethod: string
  description: string
  inputSymbol: string
  outputSymbol: string
}

export interface StrategyTokenDefinitions {
  inputToken: StrategyToken
  outputToken: StrategyToken
}

export interface StrategyToken {
  chainId: ChainId
  address: string
  decimals: number
  symbol: string
}

export interface StrategyBalances {
  inputTokenBalance: CurrencyAmount<Token>
  outputTokenBalance: CurrencyAmount<Token>
}

export type StrategyHook = BaseStrategyHook | BaseStrategyWithBentoBoxTraitHook | BaseStrategyWithHasPermitTokenHook

// --------------------------------
// STATE
// --------------------------------
export interface InariState {
  id: string
  zapIn: boolean
  inputValue: string
  outputValue: string
  general: StrategyGeneralInfo
  tokens: StrategyTokenDefinitions
}

export interface DerivedInariState extends Omit<InariState, 'inputValue' | 'outputValue' | 'tokens'> {
  inputValue: CurrencyAmount<Token>
  outputValue: CurrencyAmount<Token>
  tokens: {
    inputToken: Token
    outputToken: Token
  }
}
