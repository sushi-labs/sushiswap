import { ChefType } from '@sushiswap/client'
import { Amount, Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { Address, useContractRead, useContractReads } from 'wagmi'

import { RewarderType } from './useFarmRewards'
import { getMasterChefContractConfig } from './useMasterChefContract'

interface UseRewarderPayload {
  account: string | undefined
  chainId: number
  farmId: number
  rewardTokens: Token[]
  rewarderAddresses: string[]
  types: RewarderType[]
  chef: ChefType
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
  const config = getMasterChefContractConfig(chainId, chef)

  const contracts = useMemo(() => {
    if (
      !account ||
      !config ||
      (rewardTokens.length !== rewarderAddresses.length && rewardTokens.length !== types.length)
    ) {
      return []
    }

    return types.map((type, i) => {
      return type === RewarderType.Primary
        ? ({
            ...config,
            abi: [
              {
                inputs: [
                  {
                    internalType: 'uint256',
                    name: '_pid',
                    type: 'uint256',
                  },
                  {
                    internalType: 'address',
                    name: '_user',
                    type: 'address',
                  },
                ],
                name: 'pendingSushi',
                outputs: [
                  {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                  },
                ],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'pendingSushi',
            args: [BigNumber.from(farmId), account as Address],
          } as const)
        : ({
            // ...getRewarderConfig(rewarderAddresses[i]),
            address: rewarderAddresses[i] as Address,
            chainId,
            abi: [
              {
                inputs: [
                  {
                    internalType: 'uint256',
                    name: 'pid',
                    type: 'uint256',
                  },
                  {
                    internalType: 'address',
                    name: 'user',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                  },
                ],
                name: 'pendingTokens',
                outputs: [
                  {
                    internalType: 'contract IERC20[]',
                    name: 'rewardTokens',
                    type: 'address[]',
                  },
                  {
                    internalType: 'uint256[]',
                    name: 'rewardAmounts',
                    type: 'uint256[]',
                  },
                ],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'pendingTokens',
            args: [BigNumber.from(farmId), account as Address, BigNumber.from(0)],
          } as const)
    })
  }, [account, chainId, config, farmId, rewardTokens.length, rewarderAddresses, types])

  const { isError, isLoading, data } = useContractReads({
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

    const _data = data as (BigNumber | { rewardAmounts: BigNumber[] })[]

    return {
      data: _data
        .filter((el): el is NonNullable<(typeof _data)['0']> => !!el)
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
        }, []),
      isLoading,
      isError,
    }
  }, [data, isError, isLoading, rewardTokens])
}
