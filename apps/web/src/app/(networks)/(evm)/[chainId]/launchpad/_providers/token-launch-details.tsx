import type { LaunchpadToken } from '@sushiswap/graph-client/data-api'
import type { ReactElement } from 'react'
import { PoolsFunTokenLaunchDetails } from './pools-fun/token-launch-details'
import { SushiV1TokenLaunchDetails } from './sushi-v1/token-launch-details'
import { SushiV2TokenLaunchDetails } from './sushi-v2/token-launch-details'

export function TokenLaunchDetails({
  token,
}: { token: LaunchpadToken }): ReactElement {
  switch (token.__typename) {
    case 'PoolsFunV1LaunchpadToken':
    case 'PoolsFunV2LaunchpadToken':
    case 'PoolsFunV3LaunchpadToken':
      return <PoolsFunTokenLaunchDetails token={token} />
    case 'SushiV1LaunchpadToken':
      return <SushiV1TokenLaunchDetails token={token} />
    case 'SushiV2LaunchpadToken':
      return <SushiV2TokenLaunchDetails token={token} />
  }
}
