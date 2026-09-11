import { formatRawAmount, formatUsd } from '../../_lib/format'
import { LaunchDetailsCard } from '../launch-details-card'
import type { LaunchpadTokenFor } from '../provider-types'

export function SushiV1TokenLaunchDetails({
  token,
}: {
  token: LaunchpadTokenFor<'SUSHI_V1'>
}) {
  return (
    <LaunchDetailsCard
      sections={[
        {
          title: 'Market',
          items: [
            {
              label: 'Supply',
              value: `${formatRawAmount(token.initialSupply, token.decimals, 0)} ${token.symbol}`,
            },
            {
              label: 'Starting FDV',
              value: formatUsd(Number(token.initialFdvUsd)),
            },
            { label: 'Pool fee', value: `${token.pool.feeTier / 10_000}%` },
          ],
        },
        {
          title: 'Liquidity & fees',
          items: [
            { label: 'Liquidity', value: 'Single max range' },
            {
              label: 'Fee split',
              value: `${token.feeSplit.sushiFeeBps / 100}% Sushi · ${token.feeSplit.creatorFeeBps / 100}% creator`,
            },
          ],
        },
      ]}
    />
  )
}
