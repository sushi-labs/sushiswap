import { Amount, Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useContractRead, useContractReads } from 'wagmi'

import { RewarderType } from './useFarmRewards'
import { Chef } from './useMasterChef'
import { getMasterChefContractConfig } from './useMasterChefContract'
import { getRewarderConfig } from './useRewarderContract'

interface UseRewarderPayload {
  account: string | undefined
  chainId: number
  farmId: number
  rewardTokens: Token[]
  rewarderAddresses: string[]
  types: RewarderType[]
  chef: Chef
}

interface UseRewarderData extends Pick<ReturnType<typeof useContractRead>, 'isLoading' | 'isError'> {
  data: (Amount<Token> | undefined)[]
}

type UseRewarder = (payload: UseRewarderPayload) => UseRewarderData

export const useRewarder: UseRewarder = ({
  chainId,
  account,
  rewarderAddresses,
  rewardTokens,
  types,
  farmId,
  chef,
}) => {
  const config = useMemo(() => getMasterChefContractConfig(chainId, chef), [chainId, chef])

  const contracts = useMemo(() => {
    if (rewardTokens.length !== rewarderAddresses.length && rewardTokens.length !== types.length) {
      throw new Error('useRewarder: invalid params')
    }

    // TODO
    return rewardTokens.map((el, index) => {
      if (types[index] === RewarderType.Primary) {
        return {
          chainId: chainId,
          ...config,
          functionName: 'pendingSushi',
          args: [farmId, account],
        }
      }

      return {
        chainId,
        ...getRewarderConfig(chainId, rewarderAddresses[index]),
        functionName: 'pendingTokens',
        args: [farmId, account, 0],
      }
    })
  }, [account, chainId, config, farmId, rewardTokens, rewarderAddresses, types])

  const { data, isLoading, isError } = useContractReads({
    contracts,
    watch: true,
    keepPreviousData: true,
    allowFailure: true,
    enabled: !!account,
  })

  return useMemo(() => {
    if (!data)
      return {
        data: rewardTokens.map(() => undefined),
        isLoading,
        isError,
      }

    const _data = data.reduce<(Amount<Token> | undefined)[]>((acc, result, index) => {
      if (types[index] === RewarderType.Primary) {
        acc.push(result ? Amount.fromRawAmount(rewardTokens[index], result.toString()) : undefined)
      } else {
        acc.push(
          ...result.rewardAmounts.map((rewardAmount: BigNumber, index2: number) => {
            return Amount.fromRawAmount(rewardTokens[index + index2], rewardAmount.toString())
          })
        )
      }

      return acc
    }, [])

    return {
      data: _data,
      isLoading,
      isError,
    }
  }, [data, isError, isLoading, rewardTokens, types])
}
