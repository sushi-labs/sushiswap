import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useCallback } from 'react'
import { useApproveBuilderFee } from 'src/lib/perps/exchange/use-approve-builder-fee'

export const BuilderFee: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'default',
  ...props
}) => {
  const { approveBuilderFeeAsync, isPending, hasApprovedBuilder } =
    useApproveBuilderFee()

  const handleApproveBuilderFee = useCallback(async () => {
    try {
      await approveBuilderFeeAsync()
    } catch (error) {
      console.log(error)
    }
  }, [approveBuilderFeeAsync])

  if (!hasApprovedBuilder) {
    return (
      <Button
        fullWidth={fullWidth}
        size={size}
        onClick={handleApproveBuilderFee}
        loading={isPending}
        {...props}
      >
        Approve Builder
      </Button>
    )
  }

  return <>{children}</>
}
