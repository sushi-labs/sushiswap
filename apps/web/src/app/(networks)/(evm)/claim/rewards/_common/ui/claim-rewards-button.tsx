import { Button } from '@sushiswap/ui'
import type { FC } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import { useClaimRewards } from 'src/lib/wagmi/hooks/rewards/hooks/useClaimRewards'

export const ClaimRewardsButton: FC<{ rewards: ClaimableRewards }> = ({
  rewards,
}) => {
  const { isPending, write } = useClaimRewards({ rewards })

  return (
    <Button
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
