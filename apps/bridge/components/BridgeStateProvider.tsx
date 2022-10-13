import { ChainId } from '@sushiswap/chain'
import { Amount, tryParseAmount, Type as Currency } from '@sushiswap/currency'
import { createContext, FC, ReactNode, useContext, useMemo, useReducer } from 'react'

interface _BridgeStateProviderProps {
  initialState: State
  children: ReactNode
}

type State = {
  srcChainId: ChainId
  dstChainId: ChainId
  srcToken: Currency | null
  dstToken: Currency | null
  srcTypedAmount: string
  dstTypedAmount: string
  amount: Amount<Currency> | undefined
}

type API = {
  setSrcChainId(chainId: ChainId): void
  setDstChainId(chainId: ChainId): void
  setSrcToken(currency: Currency): void
  setDstToken(currency: Currency): void
  setSrcTypedAmount(srcTypedAmount: string): void
  setDstTypedAmount(dstTypedAmount: string): void
}

const DataContext = createContext<State>({} as State)
const APIContext = createContext<API>({} as API)

type Actions =
  | { type: 'setSrcChainId'; chainId: ChainId }
  | { type: 'setDstChainId'; chainId: ChainId }
  | { type: 'setSrcToken'; currency: Currency }
  | { type: 'setDstToken'; currency: Currency }
  | { type: 'setSrcTypedAmount'; srcTypedAmount: string }
  | { type: 'setDstTypedAmount'; dstTypedAmount: string }

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'setSrcChainId':
      return { ...state, srcChainId: action.chainId, srcToken: null, srcTypedAmount: '', amount: undefined }
    case 'setDstChainId':
      return { ...state, dstChainId: action.chainId, dstToken: null, dstTypedAmount: '' }
    case 'setSrcToken':
      return { ...state, srcToken: action.currency, amount: tryParseAmount(state.srcTypedAmount, action.currency) }
    case 'setDstToken':
      return { ...state, dstToken: action.currency }
    case 'setSrcTypedAmount':
      return {
        ...state,
        srcTypedAmount: action.srcTypedAmount,
        amount: tryParseAmount(action.srcTypedAmount, state.srcToken),
      }
    case 'setDstTypedAmount':
      return {
        ...state,
        dstTypedAmount: action.dstTypedAmount,
      }
  }
}

export const BridgeStateProvider: FC<_BridgeStateProviderProps> = ({ initialState, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const api = useMemo(() => {
    const setSrcChainId = (chainId: ChainId) => dispatch({ type: 'setSrcChainId', chainId })
    const setDstChainId = (chainId: ChainId) => dispatch({ type: 'setDstChainId', chainId })
    const setSrcToken = (currency: Currency) => dispatch({ type: 'setSrcToken', currency })
    const setDstToken = (currency: Currency) => dispatch({ type: 'setDstToken', currency })
    const setSrcTypedAmount = (srcTypedAmount: string) => dispatch({ type: 'setSrcTypedAmount', srcTypedAmount })
    const setDstTypedAmount = (dstTypedAmount: string) => dispatch({ type: 'setDstTypedAmount', dstTypedAmount })

    return { setSrcChainId, setDstChainId, setSrcToken, setDstToken, setSrcTypedAmount, setDstTypedAmount }
  }, [])

  return (
    <APIContext.Provider value={api}>
      <DataContext.Provider value={state}>{children}</DataContext.Provider>
    </APIContext.Provider>
  )
}

export const useBridgeState = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('Hook can only be used inside Bridge State Context')
  }

  return context
}

export const useBridgeStateActions = () => {
  const context = useContext(APIContext)
  if (!context) {
    throw new Error('Hook can only be used inside Bridge State Actions Context')
  }

  return context
}
