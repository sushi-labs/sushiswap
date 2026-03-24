import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useUserState } from '~evm/perps/user-provider'
import {
  DepositDialog,
  PerpSpotTransferDialog,
  useUserSettingsState,
} from '../account-management'
import { useAssetState } from '../trade-widget'

export const Deposit: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  variant = 'perps-default',
  size = 'xl',
  ...props
}) => {
  const {
    state: {
      webData2Query: { data, isLoading, error },
    },
  } = useUserState()
  const {
    state: { asset, availableToLong, tradeSide, availableToShort },
  } = useAssetState()
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()

  const availableToTrade = useMemo(() => {
    return tradeSide === 'long' ? availableToLong : availableToShort
  }, [tradeSide, availableToLong, availableToShort])

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
    asset?.dex === '' &&
    !isUnifiedAccountModeEnabled
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
  if (
    Number(availableToTrade) === 0 &&
    asset?.marketType === 'perp' &&
    asset?.dex !== '' &&
    !isUnifiedAccountModeEnabled
  ) {
    return (
      <PerpSpotTransferDialog
        trigger={
          <Button fullWidth={fullWidth} size={size} {...props}>
            Transfer to Perps
          </Button>
        }
        defaultDst="perp"
      />
    )
  }

  if (isUnifiedAccountModeEnabled && Number(availableToTrade) === 0) {
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
