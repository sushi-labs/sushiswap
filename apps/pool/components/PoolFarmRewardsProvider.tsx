import { Token } from '@sushiswap/currency'
import { Chef, FarmMap, Incentive, useFarmRewards } from '@sushiswap/wagmi'
import { createContext, FC, ReactNode, useCallback, useContext, useMemo } from 'react'

import { Pair } from '../.graphclient'
import { CHEF_TYPE_MAP } from '../lib/constants'

interface PoolFarmRewards {
  incentives: Incentive<Token>[] | undefined
  rewardAPR: number
  feeAPR: number
  totalAPR: number
  farmId: number | undefined
  chefType: Chef | undefined
  isFarm: boolean
  isLoading: boolean
  isError: boolean
}

interface PoolFarmRewardsContext {
  rewards: Record<number, FarmMap<Token>> | undefined
  isLoading: boolean
  isError: boolean
  getRewardsForPair(pair: Pair): PoolFarmRewards
}

const Context = createContext<PoolFarmRewardsContext | undefined>(undefined)

export const PoolFarmRewardsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: rewards, isLoading, isError } = useFarmRewards()

  const getRewardsForPair = useCallback(
    (pair) => {
      const incentives = rewards?.[pair.chainId]?.farms[pair.id]?.incentives
      const rewardAPR = (incentives?.reduce((acc, cur) => acc + (cur.apr || 0), 0) || 0) / 100
      const feeAPR = pair.apr / 100
      const totalAPR = rewardAPR + feeAPR
      const farmId = rewards?.[pair.chainId]?.farms[pair.id]?.id
      const chefType = rewards?.[pair.chainId]?.farms[pair.id]?.chefType
        ? CHEF_TYPE_MAP[rewards?.[pair.chainId]?.farms[pair.id]?.chefType]
        : undefined

      return {
        incentives,
        rewardAPR,
        totalAPR,
        feeAPR,
        farmId,
        chefType,
        isFarm: farmId !== undefined,
        isLoading,
        isError,
      }
    },
    [isError, isLoading, rewards]
  )

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          rewards,
          isLoading,
          isError,
          getRewardsForPair,
        }),
        [getRewardsForPair, isError, isLoading, rewards]
      )}
    >
      {children}
    </Context.Provider>
  )
}

export function usePoolFarmRewards<T extends Pair | undefined>(pair: T): T extends Pair ? PoolFarmRewards : undefined {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Position Context')
  }

  return useMemo(() => {
    if (!pair) return undefined as any
    return context.getRewardsForPair(pair)
  }, [context, pair])
}

export function usePoolFarmRewardsContext() {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Position Context')
  }

  return context
}
