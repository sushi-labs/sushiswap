'use client'

import { type FC, createContext, useContext, useMemo, useReducer } from 'react'

type Action =
  | { type: 'setPercentage'; value: number }
  | { type: 'setIsTxnPending'; value: boolean }
  | { type: 'setAmountToken0PerLP'; value: number }
  | { type: 'setAmountToken1PerLP'; value: number }
  | { type: 'setLPBalance'; value: number }
  | { type: 'setLPToRemove'; value: number }
  | { type: 'setMinAmountToken0'; value: number }
  | { type: 'setMinAmountToken1'; value: number }

type Dispatch = {
  setIsTxnPending(isPending: boolean): void
  setPercentage(percentage: number): void
  setAmountToken0PerLP(amount: number): void
  setAmountToken1PerLP(amount: number): void
  setLPBalance(amount: number): void
  setLPToRemove(amount: number): void
  setMinAmountToken0(amount: number): void
  setMinAmountToken1(amount: number): void
}

type State = {
  percentage: number
  isTxnPending: boolean
  amountToken0PerLP: number
  amountToken1PerLP: number
  lpBalance: number
  lpToRemove: number
  minAmountToken0: number
  minAmountToken1: number
}

type RemoveProviderProps = { children: React.ReactNode }

const RemoveContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

function removeReducer(_state: State, action: Action) {
  switch (action.type) {
    case 'setPercentage': {
      return { ..._state, percentage: action.value }
    }
    case 'setIsTxnPending': {
      return { ..._state, isTxnPending: action.value }
    }
    case 'setAmountToken0PerLP': {
      return { ..._state, amountToken0PerLP: action.value }
    }
    case 'setAmountToken1PerLP': {
      return { ..._state, amountToken1PerLP: action.value }
    }
    case 'setLPBalance': {
      return { ..._state, lpBalance: action.value }
    }
    case 'setLPToRemove': {
      return { ..._state, lpToRemove: action.value }
    }
    case 'setMinAmountToken0': {
      return { ..._state, minAmountToken0: action.value }
    }
    case 'setMinAmountToken1': {
      return { ..._state, minAmountToken1: action.value }
    }
  }
}

const RemoveProvider: FC<RemoveProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(removeReducer, {
    percentage: 0, //0-100
    isTxnPending: false,
    amountToken0PerLP: 0,
    amountToken1PerLP: 0,
    lpBalance: 0,
    lpToRemove: 0,
    minAmountToken0: 0,
    minAmountToken1: 0,
  })

  const dispatchWithAction = useMemo(
    () => ({
      setPercentage: (value: number) =>
        dispatch({ type: 'setPercentage', value }),
      setIsTxnPending: (value: boolean) =>
        dispatch({ type: 'setIsTxnPending', value }),
      setAmountToken0PerLP: (value: number) =>
        dispatch({ type: 'setAmountToken0PerLP', value }),
      setAmountToken1PerLP: (value: number) =>
        dispatch({ type: 'setAmountToken1PerLP', value }),
      setLPBalance: (value: number) =>
        dispatch({ type: 'setLPBalance', value }),
      setLPToRemove: (value: number) =>
        dispatch({ type: 'setLPToRemove', value }),
      setMinAmountToken0: (value: number) =>
        dispatch({ type: 'setMinAmountToken0', value }),
      setMinAmountToken1: (value: number) =>
        dispatch({ type: 'setMinAmountToken1', value }),
    }),
    [],
  )

  return (
    <RemoveContext.Provider
      value={useMemo(() => {
        return { state, dispatch: dispatchWithAction }
      }, [state, dispatchWithAction])}
    >
      {children}
    </RemoveContext.Provider>
  )
}

const useRemoveContext = () => {
  const context = useContext(RemoveContext)
  if (!context) {
    throw new Error('Hook can only be used inside Remove Liq Provider')
  }

  return context
}

const useRemoveLiqState = () => {
  const context = useRemoveContext()
  return context.state
}

const useRemoveLiqDispatch = () => {
  const context = useRemoveContext()
  return context.dispatch
}

export { RemoveProvider, useRemoveLiqState, useRemoveLiqDispatch }
