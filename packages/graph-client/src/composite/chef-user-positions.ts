import type { ChainIdVariable, ChainIdsVariable } from 'src/lib/types/chainId'
import {
  MINICHEF_SUPPORTED_CHAIN_IDS,
  type MiniChefChainId,
  isMiniChefChainId,
} from 'sushi/config'

import type { RequestOptions } from 'src/lib/request'
import {
  type GetMasterChefV1UserPositions,
  type MasterChefV1UserPositions,
  getMasterChefV1UserPositions,
} from 'src/subgraphs/master-chef-v1'
import {
  type GetMasterChefV2UserPositions,
  type MasterChefV2UserPositions,
  getMasterChefV2UserPositions,
} from 'src/subgraphs/master-chef-v2'
import {
  type GetMiniChefUserPositions,
  type MiniChefUserPositions,
  getMiniChefUserPositions,
} from 'src/subgraphs/mini-chef'
import { ChainId } from 'sushi/chain'

export type GetChefUserPositions = Omit<
  GetMasterChefV1UserPositions &
    GetMasterChefV2UserPositions &
    GetMiniChefUserPositions,
  'chainId'
> &
  ChainIdsVariable<1 | MiniChefChainId>

type CombinedPosition = (
  | MasterChefV1UserPositions
  | MasterChefV2UserPositions
  | MiniChefUserPositions
)[number]

export type ChefPosition = Omit<CombinedPosition, 'pool'> & {
  pool: Omit<CombinedPosition['pool'], 'chainId'> &
    ChainIdVariable<NonNullable<CombinedPosition['pool']>['chainId']>
}

export async function getChefUserPositions(
  {
    chainIds = [ChainId.ETHEREUM, ...MINICHEF_SUPPORTED_CHAIN_IDS],
    ...variables
  }: GetChefUserPositions,
  options?: RequestOptions,
) {
  const miniChefChainIds = chainIds.filter(isMiniChefChainId)

  const masterChefPromises = chainIds.includes(ChainId.ETHEREUM)
    ? [
        getMasterChefV1UserPositions(variables, options),
        getMasterChefV2UserPositions(variables, options),
      ]
    : []

  const promises = await Promise.allSettled([
    ...masterChefPromises,
    ...miniChefChainIds.map((chainId) =>
      getMiniChefUserPositions(
        {
          ...variables,
          chainId,
        },
        options,
      ),
    ),
  ])

  const data = [] as ChefPosition[]
  const errors = []

  for (const promise of promises) {
    if (promise.status === 'fulfilled') {
      data.push(...promise.value)
    } else {
      errors.push(promise.reason)
    }
  }

  return { data, errors }
}
