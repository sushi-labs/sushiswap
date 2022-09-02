import { Token } from '@sushiswap/currency'
import { Chef, Incentive, useFarmRewards } from '@sushiswap/wagmi'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'

import { Pair } from '../.graphclient'
import { CHEF_TYPE_MAP } from '../lib/constants'

interface PoolPositionContext {
  incentives: Incentive<Token>[] | undefined
  rewardAPR: number
  feeAPR: number
  totalAPR: number
  farmId: number | undefined
  chefType: Chef | undefined
  isFarm: boolean
}

const Context = createContext<PoolPositionContext | undefined>(undefined)

export const PoolFarmRewardsProvider: FC<{ pair: Pair; children: ReactNode }> = ({ pair, children }) => {
  const { data: rewards } = useFarmRewards()

  const incentives = rewards?.[pair.chainId]?.farms[pair.id]?.incentives
  const rewardAPR = (incentives?.reduce((acc, cur) => acc + (cur.apr || 0), 0) || 0) / 100
  const feeAPR = pair.apr / 100
  const totalAPR = rewardAPR + feeAPR
  const farmId = rewards?.[pair.chainId]?.farms[pair.id]?.id
  const chefType = rewards?.[pair.chainId]?.farms[pair.id]?.chefType
    ? CHEF_TYPE_MAP[rewards?.[pair.chainId]?.farms[pair.id]?.chefType]
    : undefined

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          incentives,
          rewardAPR,
          totalAPR,
          feeAPR,
          farmId,
          chefType,
          isFarm: farmId !== undefined,
        }),
        [chefType, farmId, feeAPR, incentives, rewardAPR, totalAPR]
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const usePoolFarmRewards = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Position Context')
  }

  return context
}
