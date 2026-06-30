import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useCallback } from 'react'
import { IS_PERPS_TESTNET, useApproveBuilderFee } from 'src/lib/perps'
import { useActiveAccountState } from '~evm/perps/active-account-provider'

export const BuilderFee: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const {
    approveBuilderFeeAsync,
    isPending,
    hasApprovedBuilder,
    isLoadingApprovedBuilders,
  } = useApproveBuilderFee()
  const {
    state: { activeAccount },
  } = useActiveAccountState()

  const handleApproveBuilderFee = useCallback(async () => {
    try {
      await approveBuilderFeeAsync()
    } catch (error) {
      console.log(error)
    }
  }, [approveBuilderFeeAsync])

  if (IS_PERPS_TESTNET || activeAccount?.type === 'vault') {
    return <>{children}</>
  }

  if (!hasApprovedBuilder) {
    return (
      <Button
        fullWidth={fullWidth}
        size={size}
        onClick={handleApproveBuilderFee}
        loading={isPending || isLoadingApprovedBuilders}
        {...props}
      >
        Approve Builder
      </Button>
    )
  }

  return <>{children}</>
}
