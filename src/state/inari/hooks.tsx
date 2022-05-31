import { Token } from '@sushiswap/core-sdk'
import { tryParseAmount } from 'app/functions/parse'
import { useAppSelector } from 'app/state/hooks'
import { useMemo } from 'react'

import useStakeSushiToAaveStrategy from './strategies/useStakeSushiToAaveStrategy'
import useStakeSushiToBentoStrategy from './strategies/useStakeSushiToBentoStrategy'
import { DerivedInariState, InariState } from './types'

export function useInariState(): InariState {
  return useAppSelector((state) => state.inari)
}

// Redux doesn't allow for non-serializable classes so use a derived state hook for complex values
// Derived state may not use any of the strategy hooks to avoid an infinite loop
export function useDerivedInariState(): DerivedInariState {
  const { inputValue, outputValue, tokens, general, ...rest } = useInariState()

  // BalancePanel input token
  const inputToken = useMemo(
    () =>
      new Token(
        tokens.inputToken.chainId,
        tokens.inputToken.address,
        tokens.inputToken.decimals,
        tokens.inputToken.symbol
      ),
    [tokens.inputToken.address, tokens.inputToken.chainId, tokens.inputToken.decimals, tokens.inputToken.symbol]
  )

  // BalancePanel output token
  const outputToken = useMemo(
    () =>
      new Token(
        tokens.outputToken.chainId,
        tokens.outputToken.address,
        tokens.outputToken.decimals,
        tokens.outputToken.symbol
      ),
    [tokens.outputToken.address, tokens.outputToken.chainId, tokens.outputToken.decimals, tokens.outputToken.symbol]
  )

  // @ts-ignore TYPE NEEDS FIXING
  return useMemo(
    () => ({
      ...rest,
      inputValue: tryParseAmount(inputValue, inputToken),
      outputValue: tryParseAmount(outputValue, outputToken),
      general,
      tokens: {
        inputToken,
        outputToken,
      },
    }),
    [general, inputToken, inputValue, outputToken, outputValue, rest]
  )
}

export function useSelectedInariStrategy() {
  const { id: selectedStrategy } = useInariState()
  const strategies = useInariStrategies()
  return useMemo(() => strategies[selectedStrategy], [selectedStrategy, strategies])
}

// Use this hook to register all strategies
export function useInariStrategies() {
  const stakeSushiToBentoStrategy = useStakeSushiToBentoStrategy()
  // const stakeSushiToCreamStrategy = useStakeSushiToCreamStrategy()
  // const stakeSushiToCreamToBentoStrategy = useStakeSushiToCreamToBentoStrategy()
  const stakeSushiToAaveStrategy = useStakeSushiToAaveStrategy()

  return useMemo(
    () => ({
      [stakeSushiToBentoStrategy.id]: stakeSushiToBentoStrategy,
      // [stakeSushiToCreamStrategy.id]: stakeSushiToCreamStrategy,
      // [stakeSushiToCreamToBentoStrategy.id]: stakeSushiToCreamToBentoStrategy,
      [stakeSushiToAaveStrategy.id]: stakeSushiToAaveStrategy,
    }),
    [stakeSushiToAaveStrategy, stakeSushiToBentoStrategy]
  )
}
