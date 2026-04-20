import {
  Button,
  type ButtonProps,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useSendableAssets } from 'src/lib/perps'
import { useUserState } from '~evm/perps/user-provider'
import {
  DepositDialog,
  PerpSpotTransferDialog,
  useUserSettingsState,
} from '../account-management'
import { SwapStablesDialog } from '../account-management/swap-stables-dialog'
import { useAssetListState } from '../asset-selector'
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
  const {
    state: { dexQuoteMap },
  } = useAssetListState()
  const { data: sendableAssets } = useSendableAssets('stable')

  const quoteSymbol = useMemo(() => {
    const dex = asset?.dex
    const quoteSymbol =
      dex !== undefined && dexQuoteMap?.has(dex) ? dexQuoteMap.get(dex) : 'USDC'
    return quoteSymbol || 'USDC'
  }, [asset, dexQuoteMap])

  const stableBalance = useMemo(() => {
    if (asset?.marketType === 'spot') return undefined

    const sendableAsset = sendableAssets?.find((a) => a.symbol === quoteSymbol)
    return sendableAsset ? sendableAsset?.balance : undefined
  }, [asset, sendableAssets, quoteSymbol])

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
    if (Number(stableBalance) < 1) {
      return (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground italic">
            Notice: Your {quoteSymbol} balance is too low. Please swap some of
            your USDC to {quoteSymbol} before transfering them to the{' '}
            {asset?.dex ? ` HIP-3 ` : ''} perp dex
            {asset?.dex ? ` (${asset.dex})` : ''}.
          </p>

          <SwapStablesDialog
            trigger={
              <Button fullWidth={fullWidth} size={size} {...props}>
                Swap to {quoteSymbol}
              </Button>
            }
            nonSelectableSwapData={{
              assetSymbolToSend: 'USDC',
              assetSymbolToBuy: quoteSymbol,
            }}
          />
        </div>
      )
    }
    return (
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground italic">
          Notice: You must transfer your {quoteSymbol} to the{' '}
          {asset?.dex ? ` HIP-3 ` : ''} perp dex{' '}
          {asset?.dex ? ` (${asset.dex}) ` : ''} to trade this asset.
        </p>
        <PerpSpotTransferDialog
          trigger={
            <Button fullWidth={fullWidth} size={size} {...props}>
              Transfer to Perps {asset?.dex ? `(${asset.dex})` : ''}
            </Button>
          }
          defaultDst="perp"
          defaultDex={asset?.dex}
        />
      </div>
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
