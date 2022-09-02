import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { Chef, Incentive, RewarderType, useMasterChef } from '@sushiswap/wagmi'
import { useRewarder } from '@sushiswap/wagmi/hooks/useRewarder'
import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { ProviderRpcError, UserRejectedRequestError } from 'wagmi'

import { useTokenAmountDollarValues } from '../lib/hooks'

interface StakedRewardsFetcherRenderProps {
  rewardTokens: Token[]
  pendingRewards: (Amount<Token> | undefined)[]
  values: (number | undefined)[]
  harvest(): void
  isLoading: boolean
  isError: boolean
  error?: string
}

interface StakedRewardsFetcherProps {
  account: string | undefined
  chainId: ChainId
  farmId: number
  incentives: Incentive<Token>[]
  chefType: Chef
  liquidityToken: Token
  children(payload: StakedRewardsFetcherRenderProps): ReactNode
}

export const StakedRewardsFetcher: FC<StakedRewardsFetcherProps> = ({
  account,
  chainId,
  chefType,
  liquidityToken,
  farmId,
  incentives,
  children,
}) => {
  const [error, setError] = useState<string>()
  const [rewardTokens, rewarderAddresses, types] = useMemo(() => {
    return incentives.reduce<[Token[], string[], RewarderType[]]>(
      (acc, incentive) => {
        acc[0].push(incentive.rewardToken)
        acc[1].push(incentive.rewarder.address)
        acc[2].push(incentive.rewarder.type)
        return acc
      },
      [[], [], []]
    )
  }, [incentives])

  const {
    data: pendingRewards,
    isLoading,
    isError,
  } = useRewarder({
    chainId,
    account,
    rewardTokens,
    farmId,
    rewarderAddresses,
    types,
  })

  const { harvest: _harvest } = useMasterChef({
    chainId,
    chef: chefType,
    pid: farmId,
    token: liquidityToken,
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

  const values = useTokenAmountDollarValues({ chainId, amounts: pendingRewards })

  return useMemo(
    () => (
      <>
        {children({
          rewardTokens,
          pendingRewards,
          values,
          harvest,
          isLoading,
          isError,
          error,
        })}
      </>
    ),
    [children, error, harvest, isError, isLoading, pendingRewards, rewardTokens, values]
  )
}
