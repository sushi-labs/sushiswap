import { Amount, Currency, Token } from '@sushiswap/currency'
import { Pair } from '@sushiswap/graph-client/.graphclient'
import { Chef, useMasterChef } from '@sushiswap/wagmi'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'

import { CHEF_TYPE_MAP } from '../lib/constants'
import {
  useCreateNotification,
  useTokenAmountDollarValues,
  useTokensFromPair,
  useUnderlyingTokenBalanceFromPair,
} from '../lib/hooks'

interface PoolPositionStakedContext {
  balance: Amount<Token> | undefined
  value0: number
  value1: number
  underlying0: Amount<Currency> | undefined
  underlying1: Amount<Currency> | undefined
  isLoading: boolean
  isError: boolean
  withdraw: ((amount: Amount<Token> | undefined) => void) | undefined
  deposit: ((amount: Amount<Token> | undefined) => void) | undefined
  isWritePending: boolean
  isWriteError: boolean
}

const Context = createContext<PoolPositionStakedContext | undefined>(undefined)

interface PoolPositionStakedProviderProps {
  pair: Pair
  children: ReactNode
  watch?: boolean
}

export const PoolPositionStakedProvider: FC<PoolPositionStakedProviderProps> = ({ pair, children, watch = true }) => {
  if (pair?.farm?.id === undefined || !pair?.farm?.chefType)
    return (
      <Context.Provider
        value={{
          balance: undefined,
          value0: 0,
          value1: 0,
          underlying0: undefined,
          underlying1: undefined,
          isLoading: false,
          isError: false,
          withdraw: undefined,
          deposit: undefined,
          isWriteError: false,
          isWritePending: false,
        }}
      >
        {children}
      </Context.Provider>
    )

  return (
    <_PoolPositionStakedProvider
      watch={watch}
      pair={pair}
      farmId={Number(pair.farm.id)}
      chefType={CHEF_TYPE_MAP[pair.farm.chefType]}
    >
      {children}
    </_PoolPositionStakedProvider>
  )
}

interface _PoolPositionStakedProviderProps {
  pair: Pair
  children: ReactNode
  farmId: number
  chefType: Chef
  watch: boolean
}

const _PoolPositionStakedProvider: FC<_PoolPositionStakedProviderProps> = ({
  watch,
  pair,
  farmId,
  chefType,
  children,
}) => {
  const createNotification = useCreateNotification()
  const { reserve0, reserve1, totalSupply, liquidityToken } = useTokensFromPair(pair)
  const { balance, isLoading, isError, withdraw, deposit, isWritePending, isWriteError } = useMasterChef({
    chainId: pair.chainId,
    chef: chefType,
    pid: farmId,
    token: liquidityToken,
    onSuccess: createNotification,
    watch,
  })

  const stakedUnderlying = useUnderlyingTokenBalanceFromPair({
    reserve0: reserve0,
    reserve1: reserve1,
    totalSupply,
    balance,
  })

  const [underlying0, underlying1] = stakedUnderlying
  const [value0, value1] = useTokenAmountDollarValues({ chainId: pair.chainId, amounts: stakedUnderlying })

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          balance,
          value0,
          value1,
          underlying0,
          underlying1,
          isLoading,
          isError,
          withdraw,
          deposit,
          isWritePending,
          isWriteError,
        }),
        [
          balance,
          deposit,
          isError,
          isLoading,
          isWriteError,
          isWritePending,
          underlying0,
          underlying1,
          value0,
          value1,
          withdraw,
        ]
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const usePoolPositionStaked = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Position Staked Context')
  }

  return context
}
