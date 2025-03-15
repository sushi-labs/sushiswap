import { Button } from '@sushiswap/ui'
import type { Row } from '@tanstack/react-table'
import type { FC } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { ChainKey } from 'sushi/chain'
import { ClaimRewardsButton } from './ClaimRewardsButton'

export const ClaimableRewardsActionCell: FC<Row<ClaimableRewards>> = ({
  original,
}) => {
  return (
    <div className="flex gap-3 w-[280px]">
      <Checker.Connect size="default" fullWidth>
        <Checker.Network size="default" fullWidth chainId={original.chainId}>
          <ClaimRewardsButton rewards={original} />
        </Checker.Network>
      </Checker.Connect>

      <Button size="default" fullWidth variant="secondary" asChild>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/${ChainKey[original.chainId]}/pool`}
        >
          View Positions
        </a>
      </Button>
    </div>
  )
}
