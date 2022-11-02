import { Signature } from '@ethersproject/bytes'
import { ChainId } from '@sushiswap/chain'
import { Amount, Price, Token, tryParseAmount, Type as Currency, Type } from '@sushiswap/currency'
import { createContext, FC, ReactNode, useContext, useMemo, useReducer } from 'react'
import { SendTransactionResult } from 'wagmi/actions'

import { useBridgeOutput } from '../lib/hooks'

interface _BridgeStateProviderProps {
  initialState: BridgeState
  children: ReactNode
}

export type BridgeState = {
  id: string
  srcChainId: ChainId
  dstChainId: ChainId
  srcToken: Type | undefined
  dstToken: Type | undefined
  srcTypedAmount: string
  dstTypedAmount: string
  amount: Amount<Type> | undefined
  sourceTx?: SendTransactionResult
  signature?: Signature
  timestamp?: number
  gasFee?: Amount<Type>
}

interface BridgeStateDerived {
  dstAmountOut: Amount<Currency> | undefined
  bridgeFee: Amount<Token> | undefined
  price: Price<Type, Type> | undefined
  isLoading: boolean
}

type API = {
  setSrcChainId(chainId: ChainId): void
  setDstChainId(chainId: ChainId): void
  setSrcToken(currency: Type): void
  setDstToken(currency: Type): void
  setSrcTypedAmount(srcTypedAmount: string): void
  switchChainIds(): void
  setSourceTx(tx: SendTransactionResult | undefined): void
  setSignature(sig: Signature | undefined): void
  setTimestamp(ts: number | undefined): void
  setGasFee(gasFee: Amount<Type> | undefined): void
}

const DataContext = createContext<BridgeState>({} as BridgeState)
const DerivedDataContext = createContext<BridgeStateDerived>({} as BridgeStateDerived)
const APIContext = createContext<API>({} as API)

type Actions =
  | { type: 'setSrcChainId'; chainId: ChainId }
  | { type: 'setDstChainId'; chainId: ChainId }
  | { type: 'setSrcToken'; currency: Type }
  | { type: 'setDstToken'; currency: Type }
  | { type: 'setSrcTypedAmount'; srcTypedAmount: string }
  | { type: 'switchChainIds' }
  | { type: 'setSourceTx'; tx: SendTransactionResult | undefined }
  | { type: 'setSignature'; sig: Signature | undefined }
  | { type: 'setTimestamp'; ts: number | undefined }
  | { type: 'setGasFee'; gasFee: Amount<Type> | undefined }

const reducer = (state: BridgeState, action: Actions): BridgeState => {
  switch (action.type) {
    case 'setSrcChainId':
      return { ...state, srcChainId: action.chainId, srcToken: undefined, srcTypedAmount: '', amount: undefined }
    case 'setDstChainId':
      return { ...state, dstChainId: action.chainId, dstToken: undefined, dstTypedAmount: '' }
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
    case 'switchChainIds':
      return {
        ...state,
        srcChainId: state.dstChainId,
        srcToken: state.dstToken,
        dstToken: state.srcToken,
        dstChainId: state.srcChainId,
        srcTypedAmount: '',
        dstTypedAmount: '',
        amount: undefined,
      }
    case 'setSourceTx':
      return {
        ...state,
        sourceTx: action.tx,
      }
    case 'setSignature':
      return {
        ...state,
        signature: action.sig,
      }
    case 'setTimestamp':
      return {
        ...state,
        timestamp: action.ts,
      }
    case 'setGasFee':
      return {
        ...state,
        gasFee: action.gasFee,
      }
  }
}

export const BridgeStateProvider: FC<_BridgeStateProviderProps> = ({ initialState, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const bridgeOutput = useBridgeOutput(state)

  const api = useMemo(() => {
    const setSrcChainId = (chainId: ChainId) => dispatch({ type: 'setSrcChainId', chainId })
    const setDstChainId = (chainId: ChainId) => dispatch({ type: 'setDstChainId', chainId })
    const setSrcToken = (currency: Currency) => dispatch({ type: 'setSrcToken', currency })
    const setDstToken = (currency: Currency) => dispatch({ type: 'setDstToken', currency })
    const setSrcTypedAmount = (srcTypedAmount: string) => dispatch({ type: 'setSrcTypedAmount', srcTypedAmount })
    const switchChainIds = () => dispatch({ type: 'switchChainIds' })
    const setSourceTx = (tx: SendTransactionResult) => dispatch({ type: 'setSourceTx', tx })
    const setSignature = (sig: Signature) => dispatch({ type: 'setSignature', sig })
    const setTimestamp = (ts: number) => dispatch({ type: 'setTimestamp', ts })
    const setGasFee = (gasFee: Amount<Type>) => dispatch({ type: 'setGasFee', gasFee })

    return {
      setSrcChainId,
      setDstChainId,
      setSrcToken,
      setDstToken,
      setSrcTypedAmount,
      switchChainIds,
      setSourceTx,
      setSignature,
      setTimestamp,
      setGasFee,
    }
  }, [])

  return (
    <APIContext.Provider value={api}>
      <DataContext.Provider value={state}>
        <DerivedDataContext.Provider value={useMemo(() => bridgeOutput, [bridgeOutput])}>
          {children}
        </DerivedDataContext.Provider>
      </DataContext.Provider>
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

export const useDerivedBridgeState = () => {
  const context = useContext(DerivedDataContext)
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
