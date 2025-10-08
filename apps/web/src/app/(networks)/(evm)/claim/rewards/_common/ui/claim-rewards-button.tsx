import { Button } from '@sushiswap/ui'
import type { FC } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import { useClaimRewards } from 'src/lib/wagmi/hooks/rewards/hooks/useClaimRewards'

export const ClaimRewardsButton: FC<{
  rewards: ClaimableRewards | undefined
  className?: string
  fullWidth?: boolean
  disabled?: boolean
}> = ({ rewards, className, fullWidth = true, disabled = false }) => {
  const { isPending, write } = useClaimRewards({ rewards })

  const isDisabled = !write || disabled
  return (
    <Button
      className={className}
      size="default"
      fullWidth={fullWidth}
      disabled={isDisabled}
      loading={isPending}
      onClick={() => write?.()}
    >
      Claim
    </Button>
  )
}
