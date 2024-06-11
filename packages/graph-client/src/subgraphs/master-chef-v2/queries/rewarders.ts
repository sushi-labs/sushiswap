import type { VariablesOf } from 'gql.tada'
import { ChainId } from 'sushi/chain'
import { MASTERCHEF_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'

import type { RequestOptions } from 'src/lib/request'
import { requestPaged } from 'src/lib/request-paged'
import { graphql } from '../graphql'

export const MasterChefV2RewardersQuery = graphql(
  `
  query MasterChefV2Rewarders(
    $first: Int = 1000
    $skip: Int = 0
    $where: Rewarder_filter
    $block: Block_height
  ) {
    rewarders(first: $first, skip: $skip, where: $where, block: $block) {
      id
      rewardToken
      rewardPerSecond
    }
  }
`,
)

export type GetMasterChefV2Rewarders = VariablesOf<
  typeof MasterChefV2RewardersQuery
>

export async function getMasterChefV2Rewarders(
  { ...variables }: GetMasterChefV2Rewarders,
  options?: RequestOptions,
) {
  const url = `https://${MASTERCHEF_V2_SUBGRAPH_URL}`

  const result = await requestPaged({
    chainId: ChainId.ETHEREUM,
    url,
    query: MasterChefV2RewardersQuery,
    variables,
    options,
  })

  return result.rewarders.map((rewarder) => {
    // TODO: multichain id for rewardToken?
    return {
      id: rewarder.id,
      address: rewarder.rewardToken,
      rewardPerSecond: BigInt(rewarder.rewardPerSecond),
    }
  })
}

export type MasterChefV2Rewarders = Awaited<
  ReturnType<typeof getMasterChefV2Rewarders>
>
