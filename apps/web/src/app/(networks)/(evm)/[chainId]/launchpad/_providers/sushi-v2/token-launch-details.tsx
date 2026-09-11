import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { formatRawAmount } from '../../_lib/format'
import { LaunchDetailsCard } from '../launch-details-card'
import type { LaunchpadTokenFor } from '../provider-types'
import { SUSHI_V2_FEE_DISPOSITION_LABELS } from './contract'

export function SushiV2TokenLaunchDetails({
  token,
}: {
  token: LaunchpadTokenFor<'SUSHI_V2'>
}) {
  return (
    <LaunchDetailsCard
      showItemDividers={false}
      sections={[
        {
          title: 'Market',
          items: [
            {
              label: 'Supply',
              value: `${formatRawAmount(token.currentSupply, token.decimals, 0)} ${token.symbol}`,
            },
            {
              label: 'Launched',
              value: formatDistanceToNow(new Date(token.poolInitializedAt), {
                addSuffix: true,
              }),
            },
          ],
        },
        {
          title: 'Liquidity & fees',
          items: [
            {
              label: 'Mode',
              value: token.liquidityMode === 'MOON' ? 'Moon' : 'Standard',
            },
            {
              label: 'Fee mode',
              value: SUSHI_V2_FEE_DISPOSITION_LABELS[token.feeDisposition],
            },
          ],
        },
        {
          title: 'Activity',
          items: [
            {
              label: 'Total burned',
              value: `${formatRawAmount(token.burns.totalBurned, token.decimals, 4)} ${token.symbol}`,
            },
            {
              label: 'Developer buy',
              value: token.devBuy
                ? `${formatRawAmount(token.devBuy.launchTokenReceived, token.decimals, 2)} ${token.symbol}`
                : 'None',
            },
          ],
        },
      ]}
    />
  )
}
