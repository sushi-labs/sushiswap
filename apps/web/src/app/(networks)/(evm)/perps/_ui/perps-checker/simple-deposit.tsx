import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useUserState } from '~evm/perps/user-provider'
import { DepositDialog } from '../account-management'

export const SimpleDeposit: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const {
    state: {
      webData2Query: { data, isLoading, error },
    },
  } = useUserState()

  const spotUSDCBalance = useMemo(() => {
    return Number(
      data?.spotState?.balances?.find((b) => b?.coin === 'USDC')?.total ?? 0,
    )
  }, [data])

  if (isLoading) {
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        Loading User...
      </Button>
    )
  }

  if (error) {
    return (
      <Button fullWidth={fullWidth} size={size} {...props}>
        {error?.message || 'Error Loading User'}
      </Button>
    )
  }

  if (
    Number(data?.clearinghouseState?.withdrawable) === 0 &&
    spotUSDCBalance === 0
  ) {
    return (
      <DepositDialog
        trigger={
          <Button fullWidth={fullWidth} size={size} {...props}>
            Deposit
          </Button>
        }
      />
    )
  }

  return <>{children}</>
}
