'use client'

import type { Pool } from '@sushiswap/graph-client/data-api'
import {
  Currency,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { useKatanaRewardCampaigns } from 'src/lib/hooks/react-query'
import { formatPercent } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { getAddress } from 'viem/utils'

interface KatanaStakingAPRHoverCardProps {
  pool: Pool
}

export const KatanaStakingAPRHoverCard: FC<KatanaStakingAPRHoverCardProps> = ({
  pool,
}) => {
  const { data: katanaRewardCampaigns } = useKatanaRewardCampaigns({
    pool: getAddress(pool.address),
    chainId: pool.chainId,
    enabled: pool.chainId === EvmChainId.KATANA,
  })

  if (pool.chainId !== EvmChainId.KATANA) return null

  const liveKatanaRewardCampaigns = katanaRewardCampaigns?.filter(
    (campaign) => campaign.isLive,
  )

  const katanaStakingApr = liveKatanaRewardCampaigns?.reduce(
    (total, campaign) => total + campaign.apr,
    0,
  )

  const showKatanaStakingApr =
    typeof katanaStakingApr === 'number' && katanaStakingApr > 0

  const card = (
    <div className="flex flex-col gap-3 p-6">
      <p className="font-medium">Stake to earn these emissions</p>
      <p className="text-sm text-muted-foreground">
        Stake to earn KAT rewards. Go to{' '}
        <a
          href="https://app.katana.network/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline decoration-dotted underline-offset-2"
        >
          app.katana.network/portfolio
        </a>{' '}
        to stake and opt in.
      </p>
      <p className="text-sm text-muted-foreground">
        Your position moves to the external Katana staker contract while staked.
      </p>
    </div>
  )

  const trigger = (
    <div className="flex items-center gap-1">
      <span className="underline decoration-dotted underline-offset-2">
        {formatPercent(katanaStakingApr)}
      </span>
      {liveKatanaRewardCampaigns?.map((campaign) => (
        <Currency.Icon
          key={campaign.id}
          width={16}
          height={16}
          currency={campaign.rewardToken}
        />
      ))}
    </div>
  )

  return (
    <div className="pl-2 min-w-[84px] shrink-0">
      {showKatanaStakingApr ? (
        <>
          <span className="text-muted-foreground">/</span>
          <div className="hidden sm:block">
            <HoverCard openDelay={300} closeDelay={0}>
              <HoverCardTrigger asChild className="cursor-pointer">
                {trigger}
              </HoverCardTrigger>
              <HoverCardContent side="right" className="!p-0 max-w-[320px]">
                {card}
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="block sm:hidden">
            <Popover>
              <PopoverTrigger
                onClick={(e) => e.stopPropagation()}
                asChild
                className="cursor-pointer"
              >
                {trigger}
              </PopoverTrigger>
              <PopoverContent side="right" className="!p-0 max-w-[320px]">
                {card}
              </PopoverContent>
            </Popover>
          </div>
        </>
      ) : null}
    </div>
  )
}
