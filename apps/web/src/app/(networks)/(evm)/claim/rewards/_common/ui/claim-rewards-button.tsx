import { Button } from '@sushiswap/ui'
import type { FC } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import { useClaimRewards } from 'src/lib/wagmi/hooks/rewards/hooks/useClaimRewards'

export const ClaimRewardsButton: FC<{
  rewards: ClaimableRewards | undefined
  className?: string
  size?: 'default' | 'sm'
  fullWidth?: boolean
  disabled?: boolean
}> = ({
  rewards,
  className,
  size = 'default',
  fullWidth = true,
  disabled = false,
}) => {
  const { isPending, write } = useClaimRewards({ rewards })

  const isDisabled = !write || disabled
  return (
    <Button
      className={className}
      size={size}
      fullWidth={fullWidth}
      disabled={isDisabled}
      loading={isPending}
      onClick={() => write?.()}
    >
      Claim
    </Button>
  )
}
