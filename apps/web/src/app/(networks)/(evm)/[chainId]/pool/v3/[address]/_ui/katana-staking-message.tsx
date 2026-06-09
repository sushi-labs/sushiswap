'use client'

import { Message } from '@sushiswap/ui'
import type { FC } from 'react'
import { useKatanaRewardCampaigns } from 'src/lib/hooks/react-query'
import { type EvmAddress, EvmChainId } from 'sushi/evm'

interface KatanaStakingMessageProps {
  pool: EvmAddress
  chainId: EvmChainId
}

export const KatanaStakingMessage: FC<KatanaStakingMessageProps> = ({
  pool,
  chainId,
}) => {
  const { data: campaigns } = useKatanaRewardCampaigns({
    pool,
    chainId,
    enabled: chainId === EvmChainId.KATANA,
  })

  const hasStakeRequiredCampaigns = campaigns?.some(
    (campaign) => campaign.isLive,
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
