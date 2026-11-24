import { Button } from '@sushiswap/ui'
import { type FC, useRef } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import { useClaimRewards } from 'src/lib/wagmi/hooks/rewards/hooks/use-claim-rewards'

export const ClaimRewardsButton: FC<{
  rewards: ClaimableRewards
  onRewardsClaimed?(): void
}> = ({ rewards, onRewardsClaimed }) => {
  const claimButton = useRef<HTMLButtonElement>(null)
  const { isPending, write } = useClaimRewards({
    rewards,
    onRewardsClaimed: () => {
      if (claimButton.current) onRewardsClaimed?.()
    },
  })

  return (
    <Button
      ref={claimButton}
      size="default"
      fullWidth
      disabled={!write}
      loading={isPending}
      onClick={() => write?.()}
    >
      Claim
    </Button>
  )
}
