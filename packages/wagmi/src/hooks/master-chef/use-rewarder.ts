'use client'

import { ChefType } from '@sushiswap/client'
import { useMemo } from 'react'
import { Amount, Token } from 'sushi/currency'
import { Address, useContractRead, useContractReads } from 'wagmi'
import { getMasterChefContractConfig } from './use-master-chef-contract'

interface UseRewarderPayload {
  account: string | undefined
  chainId: number
  farmId: number
  rewardTokens: Token[]
  rewarderAddresses: string[]
  types: RewarderType[]
  chef: ChefType
  enabled?: boolean
}

interface UseRewarderData
  extends Pick<ReturnType<typeof useContractRead>, 'isLoading' | 'isError'> {
  data: (Amount<Token> | undefined)[]
}

type UseRewarder = (payload: UseRewarderPayload) => UseRewarderData

export enum RewarderType {
  Primary = 'Primary',
  Secondary = 'Secondary',
}

export const useRewarder: UseRewarder = ({
  chainId,
  account,
  rewarderAddresses,
  rewardTokens,
  types,
  farmId,
  chef,
  enabled,
}) => {
  const config = getMasterChefContractConfig(chainId, chef)

  const contracts = useMemo(() => {
    if (
      !account ||
      !config ||
      (rewardTokens.length !== rewarderAddresses.length &&
        rewardTokens.length !== types.length)
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
            functionName: 'pendingSushi' as const,
            args: [BigInt(farmId), account as Address],
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
            functionName: 'pendingTokens' as const,
            args: [BigInt(farmId), account as Address, 0n],
          } as const)
    })
  }, [
    account,
    chainId,
    config,
    farmId,
    rewardTokens.length,
    rewarderAddresses,
    types,
  ])

  const { isError, isLoading, data } = useContractReads({
    contracts,
    watch: true,
    keepPreviousData: true,
    allowFailure: true,
    enabled: !!account && !!enabled,
    select: (results) => results.map((r) => r.result),
  })

  return useMemo(() => {
    if (!data)
      return {
        data: rewardTokens.map(() => undefined),
        isLoading,
        isError,
      }

    // ! POSSIBLY BROKE IT, TEST
    return {
      data: data
        .filter((el): el is NonNullable<typeof data[0]> => !!el)
        .reduce<(Amount<Token> | undefined)[]>((acc, result, index) => {
          if (typeof result === 'bigint') {
            acc.push(
              result
                ? Amount.fromRawAmount(rewardTokens[index], result)
                : undefined,
            )
          } else {
            acc.push(
              ...result[1].map((rewardAmount, index2: number) => {
                return Amount.fromRawAmount(
                  rewardTokens[index + index2],
                  rewardAmount,
                )
              }),
            )
          }

          return acc
        }, []),
      isLoading,
      isError,
    }
  }, [data, isError, isLoading, rewardTokens])
}
