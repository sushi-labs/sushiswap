import { Button, type ButtonProps } from '@sushiswap/ui'
import type { FC } from 'react'
import { useUserState } from '~evm/perps/user-provider'
import { DepositDialog } from '../account-management/deposit-dialog'

export const Deposit: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'lg',
  ...props
}) => {
  const {
    state: {
      webData3Query: { data, isLoading, error },
    },
  } = useUserState()

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

  if (Number(data?.userState?.cumLedger) === 0) {
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
