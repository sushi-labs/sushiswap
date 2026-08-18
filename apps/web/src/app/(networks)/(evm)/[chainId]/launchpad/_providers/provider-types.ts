import type {
  LaunchpadProvider,
  LaunchpadToken,
} from '@sushiswap/graph-client/data-api'

export interface LaunchpadTokenByProvider {
  POOLS_FUN_V1: Extract<
    LaunchpadToken,
    { __typename: 'PoolsFunV1LaunchpadToken' }
  >
  SUSHI_V1: Extract<LaunchpadToken, { __typename: 'SushiV1LaunchpadToken' }>
  SUSHI_V2: Extract<LaunchpadToken, { __typename: 'SushiV2LaunchpadToken' }>
}

export type LaunchpadTokenFor<Provider extends LaunchpadProvider> =
  LaunchpadTokenByProvider[Provider]

export function getLaunchCreator(
  token: LaunchpadToken,
): LaunchpadToken['creator'] {
  return token.__typename === 'SushiV2LaunchpadToken'
    ? token.launchCreator
    : token.creator
}
