import { Button } from '@sushiswap/ui'
import type { FC } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import { useClaimRewards } from 'src/lib/wagmi/hooks/rewards/hooks/useClaimRewards'

export const ClaimRewardsButton: FC<{
  rewards: ClaimableRewards
  className?: string
  fullWidth?: boolean
}> = ({ rewards, className, fullWidth = true }) => {
  const { isPending, write } = useClaimRewards({ rewards })

  return (
    <Button
      className={className}
      size="default"
      fullWidth={fullWidth}
      disabled={!write}
      loading={isPending}
      onClick={() => write?.()}
    >
      Claim
    </Button>
  )
}
