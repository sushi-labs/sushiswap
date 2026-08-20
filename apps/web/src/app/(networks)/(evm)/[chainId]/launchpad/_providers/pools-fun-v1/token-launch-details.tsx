import { formatRawAmount, formatUsd } from '../../_lib/format'
import { LaunchDetailsCard } from '../launch-details-card'
import type { LaunchpadTokenFor } from '../provider-types'

export function PoolsFunV1TokenLaunchDetails({
  token,
}: {
  token: LaunchpadTokenFor<'POOLS_FUN_V1'>
}) {
  return (
    <LaunchDetailsCard
      sections={[
        {
          items: [
            {
              label: 'Supply',
              value: `${formatRawAmount(token.initialSupply, token.decimals, 0)} ${token.symbol}`,
            },
            { label: 'Pool fee', value: `${token.pool.feeTier / 10_000}%` },
            {
              label: 'Starting FDV',
              value: formatUsd(Number(token.initialFdvUsd)),
            },
          ],
        },
      ]}
    />
  )
}
