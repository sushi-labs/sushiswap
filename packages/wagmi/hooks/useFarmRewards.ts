import { chainShortName } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useMemo } from 'react'
import { UseQueryOptions } from 'react-query'
import { useQuery } from 'wagmi'

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

type UseFarmRewards = ({
  options,
}?: {
  options?: UseQueryOptions<string, unknown, Record<number, FarmMap<RewardToken>>, string[]>
}) => Pick<ReturnType<typeof useQuery>, 'isLoading' | 'isError'> & { data: Record<number, FarmMap<Token>> | undefined }

export const useFarmRewards: UseFarmRewards = ({ options } = {}) => {
  const {
    data: farmsMap,
    isError,
    isLoading,
  } = useQuery<string, unknown, Record<number, FarmMap<RewardToken>>, string[]>(
    ['https://farm.sushi.com/v0'],
    () => fetch(`https://farm.sushi.com/v0`).then((response) => response.json()),
    { staleTime: 2000, ...options }
  )

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
