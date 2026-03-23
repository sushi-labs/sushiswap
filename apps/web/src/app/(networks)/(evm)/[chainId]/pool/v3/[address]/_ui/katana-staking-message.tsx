'use client'

import { Message } from '@sushiswap/ui'
import type { FC } from 'react'
import type { RewardCampaign } from 'src/lib/hooks/react-query'
import { isKatanaStakeRequiredCampaign } from '../_lib/reward-campaign-utils'

interface KatanaStakingMessageProps {
  campaigns?: RewardCampaign[]
}

export const KatanaStakingMessage: FC<KatanaStakingMessageProps> = ({
  campaigns,
}) => {
  const hasStakeRequiredCampaigns = campaigns?.some(
    isKatanaStakeRequiredCampaign,
  )

  if (!hasStakeRequiredCampaigns) return null

  return (
    <Message variant="warning" size="sm">
      Some active emissions require staking in the Katana LP staker contract to
      receive them. Stake and opt in at{' '}
      <a
        href="https://app.katana.network/portfolio"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline decoration-dotted underline-offset-2"
      >
        app.katana.network/portfolio
      </a>
      .
      <br />
      <br />
      While staked, positions disappear from the Sushi positions page and do not
      earn trading fees. Katana staking is a third-party flow that Sushi does
      not control, and Sushi is not responsible for any issues or losses that
      may occur.
    </Message>
  )
}
