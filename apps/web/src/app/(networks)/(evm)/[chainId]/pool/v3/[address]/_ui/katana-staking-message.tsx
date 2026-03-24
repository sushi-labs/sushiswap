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
      Stake your LP position to earn KAT rewards. Staking is available at{' '}
      <a
        href="https://app.katana.network/portfolio"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline decoration-dotted underline-offset-2"
      >
        app.katana.network/portfolio
      </a>
      . While staked, your position is held in the Katana staker contract and
      won't appear on this page. Staked positions earn KAT emissions instead of
      trading fees.
    </Message>
  )
}
