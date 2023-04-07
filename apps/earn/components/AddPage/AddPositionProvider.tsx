'use client'

import {
  Amount,
  currencyFromShortCurrencyName,
  isShortCurrencyName,
  Native,
  Token,
  tryParseAmount,
  Type,
} from '@sushiswap/currency'
import { createContext, FC, ReactNode, useContext, useMemo, useReducer } from 'react'
import { ChainId } from '@sushiswap/chain'
import { z } from 'zod'
import { isUniswapV2FactoryChainId, UniswapV2FactoryChainId } from '@sushiswap/sushiswap'
import { isAddress } from 'ethers/lib/utils'
import { useToken } from '@sushiswap/react-query'
import { useRouter } from 'next/router'
import {
  ConstantProductPoolFactoryChainId,
  isConstantProductPoolFactoryChainId,
  isStablePoolFactoryChainId,
  StablePoolFactoryChainId,
} from '@sushiswap/trident'
import { PoolType, usePoolsAsMap, useTokenWithCache } from '@sushiswap/wagmi/future/hooks'
import { ConstantProductPool, Fee, Pair, StablePool } from '@sushiswap/amm'
import { Signature } from '@ethersproject/bytes'
import { UseQueryResult } from '@tanstack/react-query'

export type EarnChainId = StablePoolFactoryChainId | ConstantProductPoolFactoryChainId | UniswapV2FactoryChainId

export const queryParamsSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .transform((chainId) => chainId as EarnChainId)
    .refine(
      (chainId) =>
        isUniswapV2FactoryChainId(chainId) ||
        isConstantProductPoolFactoryChainId(chainId) ||
        isStablePoolFactoryChainId(chainId),
      {
        message: 'ChainId not supported.',
      }
    ),
  fromCurrency: z.string().default('NATIVE'),
  toCurrency: z.string().default('SUSHI'),
})

interface InternalAddPositionState {
  review: boolean
  value0: string
  value1: string
  fee: Fee
  poolType: PoolType
  bentoboxSignature: Signature | undefined
}

interface AddPositionState {
  token0: Type | undefined
  token1: Type | undefined
  chainId: ChainId
  amount0: Amount<Type> | undefined
  amount1: Amount<Type> | undefined
  poolQuery: UseQueryResult<{
    pool: Pair | ConstantProductPool | StablePool | undefined
    map: Record<string, Pair | ConstantProductPool | StablePool>
  }>
  isTrident: boolean
}

type State = InternalAddPositionState & AddPositionState

type AddPositionApi = {
  setValue(value0: string, value1: string): void
  setValue0(value0: string): void
  setValue1(value1: string): void
  setReview(value: boolean): void
  setChainId(chainId: ChainId): void
  setToken0(token: Type): void
  setToken1(token: Type): void
  setFee(fee: Fee): void
  setPoolType(type: PoolType): void
  setBentoboxSignature(signature: Signature): void
}

export const AddPositionStateContext = createContext<State>({} as State)
export const AddPositionActionsContext = createContext<AddPositionApi>({} as AddPositionApi)

type Actions =
  | { type: 'setValue'; value0: string; value1: string }
  | { type: 'setValue0'; value0: string }
  | { type: 'setValue1'; value1: string }
  | { type: 'setReview'; value: boolean }
  | { type: 'setFee'; value: Fee }
  | { type: 'setPoolType'; value: PoolType }
  | { type: 'setBentoboxSignature'; value: Signature }

const reducer = (state: InternalAddPositionState, action: Actions): InternalAddPositionState => {
  switch (action.type) {
    case 'setFee':
      return { ...state, fee: action.value }
    case 'setPoolType':
      return { ...state, poolType: action.value }
    case 'setValue':
      return { ...state, value0: action.value0, value1: action.value1 }
    case 'setValue0':
      return { ...state, value0: action.value0 }
    case 'setValue1':
      return { ...state, value1: action.value1 }
    case 'setReview':
      return { ...state, review: action.value }
    case 'setBentoboxSignature':
      return { ...state, bentoboxSignature: action.value }
  }
}

interface AddPositionProviderProps {
  children: ReactNode
}

const getTokenFromUrl = (chainId: ChainId, currencyId: string, token: Token | undefined, isLoading: boolean) => {
  if (isLoading) {
    return undefined
  } else if (isShortCurrencyName(chainId, currencyId)) {
    return currencyFromShortCurrencyName(chainId, currencyId)
  } else if (isAddress(currencyId) && token) {
    return token
  } else {
    return Native.onChain(chainId ? chainId : ChainId.ETHEREUM)
  }
}

export const AddPositionProvider: FC<AddPositionProviderProps> = ({ children }) => {
  const { query, push } = useRouter()
  const [internalState, dispatch] = useReducer(reducer, {
    value0: '',
    value1: '',
    review: false,
    fee: Fee.DEFAULT,
    poolType: PoolType.ConstantProduct,
    bentoboxSignature: undefined,
  })

  const { chainId, fromCurrency, toCurrency } = queryParamsSchema.parse(query)
  const { data: tokenFrom, isInitialLoading: isTokenFromLoading } = useTokenWithCache({
    chainId,
    address: fromCurrency,
  })
  const { data: tokenTo, isInitialLoading: isTokenToLoading } = useTokenWithCache({ chainId, address: toCurrency })

  const token0 = useMemo(
    () => getTokenFromUrl(chainId, fromCurrency, tokenFrom, isTokenFromLoading),
    [chainId, fromCurrency, isTokenFromLoading, tokenFrom]
  )
  const token1 = useMemo(
    () => getTokenFromUrl(chainId, toCurrency, tokenTo, isTokenToLoading),
    [chainId, isTokenToLoading, toCurrency, tokenTo]
  )

  const poolQuery = usePoolsAsMap({
    chainId,
    currencyA: token0,
    currencyB: token1,
    fee: internalState.fee,
    poolType: internalState.poolType,
  })

  const state = useMemo(() => {
    return {
      ...internalState,
      token0,
      token1,
      chainId,
      amount0: tryParseAmount(internalState.value0 ? internalState.value0.toString() : undefined, token0),
      amount1: tryParseAmount(internalState.value1 ? internalState.value1.toString() : undefined, token1),
      tokensLoading: isTokenFromLoading || isTokenToLoading,
      poolQuery,
      isTrident: internalState.poolType !== PoolType.V2,
    }
  }, [chainId, internalState, isTokenFromLoading, isTokenToLoading, poolQuery, token0, token1])

  const api = useMemo(() => {
    const setChainId = (chainId: ChainId) => {
      void push(
        {
          pathname: '/add/[chainId]/[fromCurrency]/[toCurrency]',
          query: {
            ...query,
            chainId,
            fromCurrency: Native.onChain(chainId).symbol,
            toCurrency: 'SUSHI',
          },
        },
        undefined,
        { shallow: true }
      )
    }

    const setToken0 = (currency: Type) => {
      const fromCurrency = currency.isNative ? currency.symbol : currency.wrapped.address
      void push(
        {
          pathname: '/add/[chainId]/[fromCurrency]/[toCurrency]',
          query: {
            ...query,
            fromCurrency,
            toCurrency: query.toCurrency === fromCurrency ? query.fromCurrency : query.toCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setToken1 = (currency: Type) => {
      const toCurrency = currency.isNative ? currency.symbol : currency.wrapped.address
      void push(
        {
          pathname: '/add/[chainId]/[fromCurrency]/[toCurrency]',
          query: {
            ...query,
            fromCurrency: query.fromCurrency === toCurrency ? query.toCurrency : query.fromCurrency,
            toCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    }

    const setValue0 = (value0: string) => {
      if (token0 && !poolQuery?.data?.pool) {
        dispatch({ type: 'setValue0', value0 })
      }
      if (token0 && poolQuery?.data?.pool) {
        const parsedAmount = tryParseAmount(value0, token0)
        dispatch({
          type: 'setValue',
          value0,
          value1: parsedAmount ? poolQuery.data.pool.priceOf(token0.wrapped).quote(parsedAmount.wrapped).toExact() : '',
        })
      }
    }

    const setValue1 = (value1: string) => {
      if (token0 && !poolQuery?.data?.pool) {
        dispatch({ type: 'setValue1', value1 })
      }

      if (token1 && poolQuery?.data?.pool) {
        const parsedAmount = tryParseAmount(value1, token1)
        dispatch({
          type: 'setValue',
          value0: parsedAmount ? poolQuery.data.pool.priceOf(token1.wrapped).quote(parsedAmount.wrapped).toExact() : '',
          value1,
        })
      }
    }

    const setValue = (value0: string, value1: string) => dispatch({ type: 'setValue', value0, value1 })
    const setReview = (value: boolean) => dispatch({ type: 'setReview', value })
    const setFee = (value: Fee) => dispatch({ type: 'setFee', value })
    const setPoolType = (value: PoolType) => dispatch({ type: 'setPoolType', value })
    const setBentoboxSignature = (value: Signature) => dispatch({ type: 'setBentoboxSignature', value })

    return {
      setChainId,
      setValue,
      setValue0,
      setValue1,
      setReview,
      setToken0,
      setToken1,
      setFee,
      setPoolType,
      setBentoboxSignature,
    }
  }, [poolQuery.data?.pool, push, query, token0, token1])

  return (
    <AddPositionActionsContext.Provider value={api}>
      <AddPositionStateContext.Provider value={state}>{children}</AddPositionStateContext.Provider>
    </AddPositionActionsContext.Provider>
  )
}

export const useAddPositionState = () => {
  const context = useContext(AddPositionStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside State Context')
  }

  return context
}

export const useAddPositionActions = () => {
  const context = useContext(AddPositionActionsContext)
  if (!context) {
    throw new Error('Hook can only be used inside State Actions Context')
  }

  return context
}
