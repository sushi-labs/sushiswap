import { createContext, FC, ReactNode, useContext, useMemo, useReducer } from 'react'
import { Field } from '../lib/constants'

type FullRange = true

interface State {
  independentField: Field
  typedValue: string
  startPriceTypedValue: string // for the case when there's no liquidity
  leftRangeTypedValue: string | FullRange
  rightRangeTypedValue: string | FullRange
}

type Api = {
  onFieldAInput(typedValue: string, noLiquidity: boolean | undefined): void
  onFieldBInput(typedValue: string, noLiquidity: boolean | undefined): void
  onLeftRangeInput(typedValue: string): void
  onRightRangeInput(typedValue: string): void
  onStartPriceInput(typedValue: string): void
  resetMintState(): void
  setFullRange(): void
}

const initialState: State = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  startPriceTypedValue: '',
  leftRangeTypedValue: '',
  rightRangeTypedValue: '',
}

type Actions =
  | { type: 'resetMintState' }
  | { type: 'typeLeftRangeInput'; typedValue: string }
  | { type: 'typeInput'; field: Field; typedValue: string; noLiquidity: boolean }
  | { type: 'typeRightRangeInput'; typedValue: string }
  | { type: 'setFullRange' }
  | { type: 'typeStartPriceInput'; typedValue: string }

const ConcentratedLiquidityStateContext = createContext<State>(initialState)
const ConcentratedLiquidityActionsContext = createContext<Api>({} as Api)

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'resetMintState':
      return initialState
    case 'setFullRange':
      return { ...state, leftRangeTypedValue: true, rightRangeTypedValue: true }
    case 'typeStartPriceInput':
      return { ...state, startPriceTypedValue: action.typedValue }
    case 'typeLeftRangeInput':
      return { ...state, leftRangeTypedValue: action.typedValue }
    case 'typeRightRangeInput':
      return { ...state, rightRangeTypedValue: action.typedValue }
    case 'typeInput': {
      return {
        ...state,
        independentField: action.field,
        typedValue: action.typedValue,
      }
    }
  }
}

/*
  Provider only used whenever a user selects Concentrated Liquidity
 */
export const ConcentratedLiquidityProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const api = useMemo(() => {
    const onFieldAInput = (typedValue: string, noLiquidity: boolean | undefined) =>
      dispatch({ type: 'typeInput', field: Field.CURRENCY_A, typedValue, noLiquidity: noLiquidity === true })

    const onFieldBInput = (typedValue: string, noLiquidity: boolean | undefined) =>
      dispatch({ type: 'typeInput', field: Field.CURRENCY_B, typedValue, noLiquidity: noLiquidity === true })

    const onLeftRangeInput = (typedValue: string) => {
      dispatch({ type: 'typeLeftRangeInput', typedValue })
      // TODO searchParams
      // const paramMinPrice = searchParams.get('minPrice')
      // if (!paramMinPrice || (paramMinPrice && paramMinPrice !== typedValue)) {
      //   searchParams.set('minPrice', typedValue)
      //   setSearchParams(searchParams)
      // }
    }

    const onRightRangeInput = (typedValue: string) => {
      dispatch({ type: 'typeRightRangeInput', typedValue })
      // TODO searchParams
      // const paramMaxPrice = searchParams.get('maxPrice')
      // if (!paramMaxPrice || (paramMaxPrice && paramMaxPrice !== typedValue)) {
      //   searchParams.set('maxPrice', typedValue)
      //   setSearchParams(searchParams)
      // }
    }

    const onStartPriceInput = (typedValue: string) => dispatch({ type: 'typeStartPriceInput', typedValue })
    const resetMintState = () => dispatch({ type: 'resetMintState' })
    const setFullRange = () => dispatch({ type: 'setFullRange' })

    return {
      resetMintState,
      setFullRange,
      onFieldAInput,
      onFieldBInput,
      onLeftRangeInput,
      onRightRangeInput,
      onStartPriceInput,
    }
  }, [])

  return (
    <ConcentratedLiquidityActionsContext.Provider value={api}>
      <ConcentratedLiquidityStateContext.Provider value={state}>{children}</ConcentratedLiquidityStateContext.Provider>
    </ConcentratedLiquidityActionsContext.Provider>
  )
}

export const useConcentratedMintState = () => {
  const context = useContext(ConcentratedLiquidityStateContext)
  if (!context) {
    throw new Error('Hook can only be used Concentrated Liquidity Provider State Context')
  }

  return context
}

export const useConcentratedMintActionHandlers = () => {
  const context = useContext(ConcentratedLiquidityActionsContext)

  if (!context) {
    throw new Error('Hook can only be used Concentrated Liquidity Provider Actions Context')
  }

  return context
}
