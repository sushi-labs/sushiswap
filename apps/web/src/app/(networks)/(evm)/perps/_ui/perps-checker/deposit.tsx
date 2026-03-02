import { Button, type ButtonProps } from '@sushiswap/ui'
import type { FC } from 'react'
import { useUserState } from '~evm/perps/user-provider'
import { DepositDialog } from '../account-management/deposit-dialog'
import { PerpSpotTransfer } from '../account-management/perp-spot-transfer'
import { useAssetState } from '../trade-widget/asset-state-provider'

export const Deposit: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'default',
  ...props
}) => {
  const {
    state: {
      webData2Query: { data, isLoading, error },
    },
  } = useUserState()
  const {
    state: { asset, availableToLong },
  } = useAssetState()

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
    asset?.dex === ''
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
    Number(availableToLong) === 0 &&
    asset?.marketType === 'perp' &&
    asset?.dex !== ''
  ) {
    return (
      <PerpSpotTransfer
        trigger={
          <Button fullWidth={fullWidth} size={size} {...props}>
            Transfer to Perps
          </Button>
        }
        defaultDst="perp"
      />
    )
  }

  return <>{children}</>
}
