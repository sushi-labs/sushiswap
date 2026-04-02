import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useCallback } from 'react'
import { useSetReferrer } from 'src/lib/perps'

export const Referral: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const {
    hasAcceptedReferral,
    isPending,
    isLoadingReferralCheck,
    setReferrerCodeAsync,
  } = useSetReferrer()

  const handleApproveBuilderFee = useCallback(async () => {
    try {
      await setReferrerCodeAsync({})
    } catch (error) {
      console.log(error)
    }
  }, [setReferrerCodeAsync])

  if (!hasAcceptedReferral) {
    return (
      <Button
        fullWidth={fullWidth}
        size={size}
        onClick={handleApproveBuilderFee}
        loading={isPending || isLoadingReferralCheck}
        {...props}
      >
        Accept Referral (4% discount)
      </Button>
    )
  }

  return <>{children}</>
}
