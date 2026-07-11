import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { getClearinghouseStateForDex } from 'src/lib/perps'
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
      allDexClearinghouseStateQuery: {
        data: allDexClearinghouseState,
        isLoading: isClearinghouseStateLoading,
        error: clearinghouseStateError,
      },
      spotStateQuery: {
        data: spotState,
        isLoading: isSpotStateLoading,
        error: spotStateError,
      },
    },
  } = useUserState()
  const isLoading = isClearinghouseStateLoading || isSpotStateLoading
  const error = clearinghouseStateError || spotStateError

  const spotUSDCBalance = useMemo(() => {
    return Number(
      spotState?.spotState?.balances?.find((b) => b.coin === 'USDC')?.total ??
        0,
    )
  }, [spotState?.spotState?.balances])

  const mainClearinghouseState = useMemo(() => {
    return getClearinghouseStateForDex(
      allDexClearinghouseState?.clearinghouseStates,
      '',
    )
  }, [allDexClearinghouseState])

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
    Number(mainClearinghouseState?.withdrawable) === 0 &&
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
