'use client'

import { useAccount } from '@sushiswap/wagmi'
import { FC, ReactNode, createContext, useContext, useMemo } from 'react'
import {
  useVotingPowerBreakdown,
  useVotingPower as useVotingPowerQuery,
} from 'src/lib/bar'
import { Amount, Type } from 'sushi/currency'
import { Fraction } from 'sushi/math'

interface VotingPowerContext {
  votingPower: number | undefined
  balances:
    | {
        xsushi: Amount<Type>
        slp: Amount<Type>
        xsushiPolygon: Amount<Type>
      }
    | undefined
  weights:
    | {
        xsushi: Fraction
        slp: Fraction
        xsushiPolygon: Fraction
      }
    | undefined
  isConnected: boolean
  isLoading: boolean
  isError: boolean
}

const Context = createContext<VotingPowerContext | undefined>(undefined)

export const VotingPowerProvider: FC<{
  children: ReactNode
  watch?: boolean
}> = ({ children }) => {
  const { address, isConnected } = useAccount()

  const {
    data: votingPower,
    isLoading,
    isError,
  } = useVotingPowerQuery({ address })

  const { balances, weights } = useVotingPowerBreakdown({ address })

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          votingPower,
          balances,
          weights,
          isConnected,
          isLoading,
          isError,
        }),
        [votingPower, balances, weights, isConnected, isError, isLoading],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const useVotingPower = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside VotingPower Context')
  }

  return context
}
