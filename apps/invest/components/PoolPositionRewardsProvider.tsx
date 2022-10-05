import { Amount, Token } from '@sushiswap/currency'
import { Incentive, Pair } from '@sushiswap/graph-client/.graphclient'
import { Chef, RewarderType, useMasterChef } from '@sushiswap/wagmi'
import { useRewarder } from '@sushiswap/wagmi/hooks/useRewarder'
import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { ProviderRpcError, useAccount, UserRejectedRequestError } from 'wagmi'

import { CHEF_TYPE_MAP } from '../lib/constants'
import { incentiveRewardToToken } from '../lib/functions'
import { useTokenAmountDollarValues, useTokensFromPair } from '../lib/hooks'
import { useNotifications } from '../lib/state/storage'

interface PoolPositionRewardsContext {
  pendingRewards: (Amount<Token> | undefined)[]
  rewardTokens: Token[]
  values: number[]
  isLoading: boolean
  isError: boolean
  harvest: undefined | (() => void)
  error?: string
}

const Context = createContext<PoolPositionRewardsContext | undefined>(undefined)

interface PoolPositionRewardsProviderProps {
  pair: Pair
  farmId: number
  chefType: Chef
  children: ReactNode
  incentives: Incentive[]
}

interface PoolPositionStakedProviderProps {
  pair: Pair
  children: ReactNode
}

export const PoolPositionRewardsProvider: FC<PoolPositionStakedProviderProps> = ({ pair, children }) => {
  if (pair?.farm?.id === undefined || !pair?.farm?.chefType || !pair?.farm?.incentives)
    return (
      <Context.Provider
        value={{
          pendingRewards: [],
          rewardTokens: [],
          values: [],
          isLoading: true,
          isError: false,
          harvest: undefined,
        }}
      >
        {children}
      </Context.Provider>
    )

  return (
    <_PoolPositionRewardsProvider
      pair={pair}
      farmId={Number(pair.farm.id)}
      chefType={CHEF_TYPE_MAP[pair.farm.chefType]}
      incentives={pair.farm.incentives}
    >
      {children}
    </_PoolPositionRewardsProvider>
  )
}

export const _PoolPositionRewardsProvider: FC<PoolPositionRewardsProviderProps> = ({
  farmId,
  chefType,
  incentives,
  pair,
  children,
}) => {
  const { address: account } = useAccount()
  const { liquidityToken } = useTokensFromPair(pair)
  const [error, setError] = useState<string>()

  const [, { createNotification }] = useNotifications(account)
  const [rewardTokens, rewarderAddresses, types] = useMemo(() => {
    return incentives.reduce<[Token[], string[], RewarderType[]]>(
      (acc, incentive) => {
        acc[0].push(incentiveRewardToToken(pair.chainId, incentive))
        acc[1].push(incentive.rewarderAddress)
        acc[2].push(incentive.rewarderType === 'Primary' ? RewarderType.Primary : RewarderType.Secondary)
        return acc
      },
      [[], [], []]
    )
  }, [incentives, pair.chainId])

  const {
    data: pendingRewards,
    isLoading,
    isError,
  } = useRewarder({
    chainId: pair.chainId,
    account,
    rewardTokens,
    farmId,
    rewarderAddresses,
    types,
    chef: chefType,
  })

  const { harvest: _harvest } = useMasterChef({
    chainId: pair.chainId,
    chef: chefType,
    pid: farmId,
    token: liquidityToken,
    onSuccess: createNotification,
  })

  const harvest = useCallback(async () => {
    try {
      await _harvest()
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        setError((e as ProviderRpcError).message)
      }

      console.log(e)
    }
  }, [_harvest])

  const values = useTokenAmountDollarValues({ chainId: pair.chainId, amounts: pendingRewards })

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          pendingRewards,
          rewardTokens,
          values,
          isLoading,
          isError,
          harvest,
          error,
        }),
        [error, harvest, isError, isLoading, pendingRewards, rewardTokens, values]
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const usePoolPositionRewards = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Position Context')
  }

  return context
}
