import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useCallback } from 'react'
import { useSetHyperReferrer } from 'src/lib/perps'

export const HyperReferral: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const {
    hasAcceptedHyperReferral,
    isPending,
    isLoadingHyperReferralCheck,
    setHyperReferrerCodeAsync,
  } = useSetHyperReferrer()

  const handleApproveBuilderFee = useCallback(async () => {
    try {
      await setHyperReferrerCodeAsync({})
    } catch (error) {
      console.log(error)
    }
  }, [setHyperReferrerCodeAsync])

  if (!hasAcceptedHyperReferral) {
    return (
      <Button
        fullWidth={fullWidth}
        size={size}
        onClick={handleApproveBuilderFee}
        loading={isPending || isLoadingHyperReferralCheck}
        {...props}
      >
        Accept Referral (4% discount)
      </Button>
    )
  }

  return <>{children}</>
}
