import { Amount, Token } from '@sushiswap/currency'
import { useMemo } from 'react'
import { useContractRead, useContractReads } from 'wagmi'

import { RewarderType } from './useFarmRewards'
import { getRewarderConfig } from './useRewarderContract'

interface UseRewarderPayload {
  account: string | undefined
  chainId: number
  farmId: number
  rewardTokens: Token[]
  rewarderAddresses: string[]
  types: RewarderType[]
}

interface UseRewarderData extends Pick<ReturnType<typeof useContractRead>, 'isLoading' | 'isError'> {
  data: (Amount<Token> | undefined)[]
}

type UseRewarder = (payload: UseRewarderPayload) => UseRewarderData

export const useRewarder: UseRewarder = ({ chainId, account, rewarderAddresses, rewardTokens, types, farmId }) => {
  const contracts = useMemo(() => {
    if (rewardTokens.length !== rewarderAddresses.length && rewardTokens.length !== types.length) {
      throw new Error('useRewarder: invalid params')
    }

    return rewardTokens.map((el, index) => ({
      chainId,
      ...getRewarderConfig(chainId, rewarderAddresses[index]),
      functionName: types[index] === RewarderType.Primary ? 'pendingSushi' : 'pendingTokens',
      args: types[index] === RewarderType.Primary ? [farmId, account] : [farmId, account, '0'],
    }))
  }, [account, chainId, farmId, rewardTokens, rewarderAddresses, types])

  const { data, isLoading, isError } = useContractReads({
    contracts,
    watch: true,
    cacheOnBlock: true,
    keepPreviousData: true,
    enabled: !!account,
  })

  return useMemo(() => {
    if (!data)
      return {
        data: rewardTokens.map(() => undefined),
        isLoading,
        isError,
      }

    const _data = rewardTokens.map((token, index) => {
      return data?.[index] ? Amount.fromRawAmount(token, data?.[index].toString()) : undefined
    })

    return {
      data: _data,
      isLoading,
      isError,
    }
  }, [data, isError, isLoading, rewardTokens])
}
