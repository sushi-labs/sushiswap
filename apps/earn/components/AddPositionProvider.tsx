import { Fee } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { PoolFinder, PoolFinderType, PoolStateUnion } from '@sushiswap/wagmi'
import React, { createContext, FC, ReactNode, useContext, useMemo, useReducer } from 'react'

import { AMM_ENABLED_NETWORKS, TRIDENT_ENABLED_NETWORKS } from '../config'

interface AddPositionState {
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  fee: Fee
  poolType: PoolFinderType
}

type AddPositionApi = {
  setChainId(chainId: ChainId): void
  setToken0(currency: Type): void
  setToken1(currency: Type): void
  setPoolType(pooLType: PoolFinderType): void
  setFee(fee: Fee): void
}

const DataContext = createContext<AddPositionState>({} as AddPositionState)
const APIContext = createContext<AddPositionApi>({} as AddPositionApi)

type Actions =
  | { type: 'setChainId'; chainId: ChainId }
  | { type: 'setToken0'; currency: Type }
  | { type: 'setToken1'; currency: Type }
  | { type: 'setPoolType'; poolType: PoolFinderType }
  | { type: 'setFee'; fee: Fee }

const reducer = (state: AddPositionState, action: Actions): AddPositionState => {
  switch (action.type) {
    case 'setChainId':
      return {
        ...state,
        chainId: action.chainId,
        token0: undefined,
        token1: undefined,
        poolType: !TRIDENT_ENABLED_NETWORKS.includes(action.chainId) ? PoolFinderType.Classic : state.poolType,
        fee: !TRIDENT_ENABLED_NETWORKS.includes(action.chainId) ? Fee.DEFAULT : state.fee,
      }
    case 'setToken0':
      return { ...state, token0: action.currency }
    case 'setToken1':
      return { ...state, token1: action.currency }
    case 'setPoolType':
      return { ...state, poolType: action.poolType }
    case 'setFee':
      return { ...state, fee: action.fee }
  }
}

interface AddPositionProviderProps {
  children({ pool }: { pool: PoolStateUnion }): ReactNode
}

export const AddPositionProvider: FC<AddPositionProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    chainId: ChainId.ETHEREUM,
    fee: Fee.DEFAULT,
    poolType: PoolFinderType.Classic,
    token0: undefined,
    token1: undefined,
  })

  const { chainId, fee, poolType, token0, token1 } = state

  const api = useMemo(() => {
    const setChainId = (chainId: ChainId) => dispatch({ type: 'setChainId', chainId })
    const setToken0 = (currency: Type) => dispatch({ type: 'setToken0', currency })
    const setToken1 = (currency: Type) => dispatch({ type: 'setToken1', currency })
    const setPoolType = (poolType: PoolFinderType) => dispatch({ type: 'setPoolType', poolType })
    const setFee = (fee: number) => dispatch({ type: 'setFee', fee })

    return {
      setChainId,
      setToken0,
      setToken1,
      setPoolType,
      setFee,
    }
  }, [])

  return (
    <PoolFinder
      components={
        <PoolFinder.Components>
          <PoolFinder.LegacyPool
            chainId={chainId}
            token0={token0}
            token1={token1}
            enabled={AMM_ENABLED_NETWORKS.includes(chainId)}
          />
          <PoolFinder.ConstantProductPool
            chainId={chainId}
            token0={token0}
            token1={token1}
            enabled={TRIDENT_ENABLED_NETWORKS.includes(chainId) && poolType === PoolFinderType.Classic}
            fee={fee}
            twap={false}
          />
          <PoolFinder.StablePool
            chainId={chainId}
            token0={token0}
            token1={token1}
            enabled={TRIDENT_ENABLED_NETWORKS.includes(chainId) && poolType === PoolFinderType.Stable}
            fee={fee}
            twap={false}
          />
        </PoolFinder.Components>
      }
    >
      {({ pool }) => (
        <APIContext.Provider value={api}>
          <DataContext.Provider value={state}>{children({ pool })} </DataContext.Provider>
        </APIContext.Provider>
      )}
    </PoolFinder>
  )
}

export const useAddPositionState = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('Hook can only be used inside Add Position State Context')
  }

  return context
}

export const useAddPositionActions = () => {
  const context = useContext(APIContext)
  if (!context) {
    throw new Error('Hook can only be used inside Add Position State Actions Context')
  }

  return context
}
