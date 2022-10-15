import { Amount, Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useContractRead, useContractReads } from 'wagmi'
import { ReadContractsConfig } from 'wagmi/actions'

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
  // const config = useMemo(() => getMasterChefContractConfig(chainId, chef), [chainId, chef])

  const contracts = useMemo<ReadContractsConfig['contracts']>(() => {
    if (rewardTokens.length !== rewarderAddresses.length && rewardTokens.length !== types.length) {
      console.error('useRewarder: invalid params')
      return []
    }
    const config = getMasterChefContractConfig(chainId, chef)
    return rewardTokens.map((el, index) => {
      if (types[index] === RewarderType.Primary) {
        return {
          ...config,
          functionName: 'pendingSushi',
          args: [farmId, account],
        }
      }
      return {
        chainId,
        ...getRewarderConfig(rewarderAddresses[index]),
        functionName: 'pendingTokens',
        args: [farmId, account, 0],
      }
    })
  }, [account, chainId, chef, farmId, rewardTokens, rewarderAddresses, types])

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

    const _data = data.filter(Boolean).reduce<(Amount<Token> | undefined)[]>((acc, result, index) => {
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
