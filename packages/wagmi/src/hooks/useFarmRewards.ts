import { chainShortName } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useMemo } from 'react'

export interface FarmMap<T> {
  chainId: number
  farms: Record<string, Farm<T>>
  updatedAtTimestamp: number
  updatedSecondsAgo: number
}

export interface Farm<T> {
  id: number
  feeApy: number | null
  incentives: Incentive<T>[]
  chefType: ChefType
  poolType: PoolType
}

export enum ChefType {
  MasterChefV1 = 'MasterChefV1',
  MasterChefV2 = 'MasterChefV2',
}

export interface Incentive<T> {
  apr: number | null
  rewardPerDay: number
  rewardToken: T
  rewarder: {
    address: string
    type: RewarderType
  }
}

export interface RewardToken {
  address: string
  symbol: string
}

export enum RewarderType {
  Primary = 'Primary',
  Secondary = 'Secondary',
}

export enum PoolType {
  Legacy = 'Legacy',
}

export const useFarmRewards = ({
  options,
}: {
  options?: Omit<
    UseQueryOptions<Record<number, FarmMap<RewardToken>>, unknown, Record<number, FarmMap<RewardToken>>, string[]>,
    'queryKey' | 'queryFn' | 'initialData'
  >
}) => {
  const queryKey = useMemo(() => ['https://farm.sushi.com/v0'], [])
  const {
    data: farmsMap,
    isError,
    isLoading,
  } = useQuery(queryKey, () => fetch('https://farm.sushi.com/v0').then((response) => response.json()), {
    staleTime: 2000,
    ...options,
  })

  return useMemo(() => {
    return {
      isError,
      isLoading,
      data:
        farmsMap && !isError && !isLoading
          ? Object.entries(farmsMap).reduce<Record<number, FarmMap<Token>>>((acc, [_chainId, j]) => {
              const chainId = Number(_chainId)
              acc[chainId] = {
                ...j,
                farms: Object.entries(farmsMap[chainId].farms).reduce<Record<string, Farm<Token>>>((acc, [farm, v]) => {
                  acc[`${chainShortName[chainId]}:${farm.toLowerCase()}`] = {
                    ...v,
                    incentives: farmsMap[chainId].farms[farm].incentives
                      .filter((el) => el.rewardToken.address !== '')
                      .map((el) => {
                        return {
                          ...el,
                          rewardToken: new Token({
                            chainId,
                            address: el.rewardToken.address,
                            symbol: el.rewardToken.symbol,
                            decimals: 18,
                          }),
                        }
                      }),
                  }
                  return acc
                }, {}),
              }

              return acc
            }, {})
          : undefined,
    }
  }, [farmsMap, isError, isLoading])
}
