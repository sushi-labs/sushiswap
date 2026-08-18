import type { LaunchpadToken } from '@sushiswap/graph-client/data-api'
import { PoolsFunV1TokenLaunchDetails } from './pools-fun-v1/token-launch-details'
import { SushiV1TokenLaunchDetails } from './sushi-v1/token-launch-details'
import { SushiV2TokenLaunchDetails } from './sushi-v2/token-launch-details'

export function TokenLaunchDetails({ token }: { token: LaunchpadToken }) {
  switch (token.__typename) {
    case 'PoolsFunV1LaunchpadToken':
      return <PoolsFunV1TokenLaunchDetails token={token} />
    case 'SushiV1LaunchpadToken':
      return <SushiV1TokenLaunchDetails token={token} />
    case 'SushiV2LaunchpadToken':
      return <SushiV2TokenLaunchDetails token={token} />
  }
}
