import {
  Button,
  type ButtonProps,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useSymbolSplit } from 'src/lib/perps/info/use-symbol-split'
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
    state: { isUnifiedAccountModeEnabled, isDexAbstractionEnabled },
  } = useUserSettingsState()
  const { quoteSymbol } = useSymbolSplit({ asset })
  const availableToTrade = useMemo(() => {
    return tradeSide === 'long' ? availableToLong : availableToShort
  }, [tradeSide, availableToLong, availableToShort])

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
    spotUSDCBalance === 0 &&
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
    isDexAbstractionEnabled
  ) {
    return (
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild tabIndex={0}>
          <Button
            fullWidth={fullWidth}
            size={size}
            {...props}
            className={classNames(
              props.className,
              'opacity-50 cursor-not-allowed',
            )}
          >
            Transfer
          </Button>
        </HoverCardTrigger>
        <HoverCardContent
          forceMount
          side="top"
          className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
        >
          <p>Disable HIP-3 Dex Abstraction in Settings to Transfer</p>
        </HoverCardContent>
      </HoverCard>
    )
  }
  if (
    Number(availableToTrade) === 0 &&
    asset?.marketType === 'perp' &&
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
        currencySymbol={quoteSymbol as 'USDC' | 'USDT0' | 'USDH' | 'USDE'}
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
