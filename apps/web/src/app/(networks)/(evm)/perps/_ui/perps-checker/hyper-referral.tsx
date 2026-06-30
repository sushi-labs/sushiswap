import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useCallback } from 'react'
import { IS_PERPS_TESTNET, useSetHyperReferrer } from 'src/lib/perps'
import { useActiveAccountState } from '~evm/perps/active-account-provider'

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
  const {
    state: { activeAccount },
  } = useActiveAccountState()

  const handleApproveBuilderFee = useCallback(async () => {
    try {
      await setHyperReferrerCodeAsync({})
    } catch (error) {
      console.log(error)
    }
  }, [setHyperReferrerCodeAsync])

  if (IS_PERPS_TESTNET || activeAccount?.type === 'vault') {
    return <>{children}</>
  }

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
