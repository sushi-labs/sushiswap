import { Amount, Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { Address, useContractRead, useContractReads } from 'wagmi'

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
  const contracts = useMemo(() => {
    if (rewardTokens.length !== rewarderAddresses.length && rewardTokens.length !== types.length) {
      console.error('useRewarder: invalid params')
      return []
    }
    const config = getMasterChefContractConfig(chainId, chef)
    return rewardTokens.map((el, index) => {
      if (types[index] === RewarderType.Primary) {
        return {
          ...config,
          functionName: 'pendingSushi' as const,
          args: [BigNumber.from(farmId), (account ?? '') as Address] as const,
        }
      }

      return {
        chainId,
        ...getRewarderConfig(rewarderAddresses[index]),
        functionName: 'pendingTokens' as const,
        args: [BigNumber.from(farmId), (account ?? '') as Address, BigNumber.from(0)] as const,
      }
    })
  }, [account, chainId, chef, farmId, rewardTokens, rewarderAddresses, types])

  const read = useContractReads({
    contracts,
    watch: true,
    keepPreviousData: true,
    allowFailure: true,
    enabled: !!account,
  })

  // Can't have 2 different types in one read, have to assign manually
  const { isError, isLoading } = read
  const data = read.data as (BigNumber | { rewardAmounts: BigNumber[] } | undefined)[]

  return useMemo(() => {
    if (!data)
      return {
        data: rewardTokens.map(() => undefined),
        isLoading,
        isError,
      }

    const _data = data
      .filter((el): el is NonNullable<typeof data['0']> => el !== undefined)
      .reduce<(Amount<Token> | undefined)[]>((acc, result, index) => {
        if (BigNumber.isBigNumber(result)) {
          acc.push(result ? Amount.fromRawAmount(rewardTokens[index], result.toString()) : undefined)
        } else {
          acc.push(
            ...result.rewardAmounts.map((rewardAmount, index2: number) => {
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
  }, [data, isError, isLoading, rewardTokens])
}
