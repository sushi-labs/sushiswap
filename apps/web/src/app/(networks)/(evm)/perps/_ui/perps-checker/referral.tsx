import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useCallback } from 'react'
import { useSetReferrer } from 'src/lib/perps'

export const Referral: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  variant = 'perps-default',
  size = 'xl',
  ...props
}) => {
  const { hasAcceptedReferral, isPending, setReferrerCodeAsync } =
    useSetReferrer()

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
        loading={isPending}
        {...props}
      >
        Accept Referral (4% discount)
      </Button>
    )
  }

  return <>{children}</>
}
