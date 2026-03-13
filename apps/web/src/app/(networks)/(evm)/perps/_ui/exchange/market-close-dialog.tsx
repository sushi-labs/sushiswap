'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  classNames,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import {
  BUILDER_FEE_PERPS,
  type UserPositionsItemType,
  formatPrice,
  getSizeAndPercentageFromInput,
  getSizeAndPercentageFromPercentageInput,
  getTextColorClass,
  useExecuteOrders,
  useMidPrice,
  useSymbolSplit,
} from 'src/lib/perps'
import { formatUnits, parseUnits } from 'viem'
import {
  CheckboxSetting,
  PercentageSlider,
  SizeInput,
  StatItem,
  TableButton,
} from '../_common'
import { useUserSettingsState } from '../account-management'
import { useAssetListState } from '../asset-selector'
import { PerpsChecker } from '../perps-checker'

export const MarketCloseDialog = ({
  positionToClose,
  trigger,
}: { positionToClose: UserPositionsItemType; trigger?: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [sizeSide, setSizeSide] = useState<'base' | 'quote'>('base')
  const [percentToClose, setPercentToClose] = useState(100)
  const {
    state: { quickCloseMarketPositionEnabled },
    mutate: { setQuickCloseMarketPositionEnabled },
  } = useUserSettingsState()
  const [sizeToClose, setSizeToClose] = useState<{
    base: string
    quote: string
  }>({
    base:
      positionToClose?.position?.szi?.split('-')?.[1] ||
      positionToClose?.position?.szi ||
      '0',
    quote: '0',
  })
  const { executeOrdersAsync, isPending } = useExecuteOrders()
  const {
    state: {
      assetListQuery: { data: assetListData },
    },
  } = useAssetListState()
  const { midPrice } = useMidPrice({
    assetString: positionToClose.position.coin,
  })

  const asset = useMemo(() => {
    if (!positionToClose) return undefined
    const _asset = assetListData?.get?.(positionToClose.position.coin)
    if (!_asset) {
      throw new Error(
        `Asset data not available for ${positionToClose.position.coin}`,
      )
    }
    return _asset
  }, [assetListData, positionToClose])

  const { baseSymbol } = useSymbolSplit({ asset })

  const handeleSetPercentToClose = useCallback(
    (val: number) => {
      if (!positionToClose || !asset || midPrice == null) {
        setSizeToClose({ base: '0', quote: '0' })
        setPercentToClose(100)
        return
      }

      const size = positionToClose.position.szi
      try {
        const { baseSize, quoteSize, percentage } =
          getSizeAndPercentageFromPercentageInput({
            percentageInput: val,
            maxSize: size,
            priceUsd: midPrice ?? '0',
            decimals: asset.decimals,
          })

        setSizeToClose({ base: baseSize, quote: quoteSize })
        setPercentToClose(percentage)
      } catch (e) {
        console.error('Error formatting size:', e)
        setSizeToClose({ base: '0', quote: '0' })
        setPercentToClose(val)
      }
    },
    [positionToClose, asset, midPrice],
  )

  const handleSetSizeToClose = useCallback(
    (value: string) => {
      if (!positionToClose || !asset) return

      const size = positionToClose.position.szi
      try {
        const { baseSize, quoteSize, percentage } =
          getSizeAndPercentageFromInput({
            inputValue: value,
            sizeSide,
            maxSize: size,
            priceUsd: midPrice ?? '0',
            decimals: asset.decimals,
          })
        setPercentToClose(percentage)

        setSizeToClose({
          base: sizeSide === 'base' ? value : baseSize,
          quote: sizeSide === 'quote' ? value : quoteSize,
        })
      } catch (e) {
        console.error('Error formatting size:', e)
        setSizeToClose({
          base: sizeSide === 'base' ? value : '0',
          quote: sizeSide === 'quote' ? value : '0',
        })
      }
    },
    [positionToClose, asset, sizeSide, midPrice],
  )

  const _sizeToClose = useMemo(() => {
    const maxSize = Math.abs(
      Number.parseFloat(positionToClose?.position?.szi ?? '0'),
    )

    if (!sizeToClose.base || Number.parseFloat(sizeToClose.base) === 0) {
      return maxSize.toString()
    }

    const baseSize = Number.parseFloat(sizeToClose.base)

    if (baseSize > maxSize) {
      return maxSize.toString()
    }

    return sizeToClose.base
  }, [positionToClose, sizeToClose.base])

  const orderData = useMemo(() => {
    if (!positionToClose || !asset) return null

    const position = positionToClose.position

    const _midPrice = parseUnits(midPrice ?? '0', asset?.decimals)
    const adjustedPrice =
      positionToClose.side === 'A'
        ? (_midPrice * BigInt(108)) / BigInt(100) // 8% higher than market price for sell orders
        : (_midPrice * BigInt(92)) / BigInt(100) // 8% lower for buy orders

    //8% higher than market price for sell orders, 8% lower for buy orders to ensure fills
    const marketPrice = formatPrice(
      formatUnits(adjustedPrice, asset?.decimals),
      asset?.decimals,
      asset?.marketType,
    )

    const order = {
      asset: position.coin,
      side:
        positionToClose.side === 'A' ? ('long' as const) : ('short' as const),
      price: marketPrice,
      size: _sizeToClose,
      reduceOnly: true,
      orderType: { limit: { timeInForce: 'FrontendMarket' as const } },
    }

    return {
      orders: [order],
      builder: {
        builderFee: BUILDER_FEE_PERPS,
      },
    }
  }, [positionToClose, midPrice, asset, _sizeToClose])

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (quickCloseMarketPositionEnabled && !open) return
        setOpen(state)
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <TableButton
            disabled={isPending || !positionToClose}
            onClick={async () => {
              if (quickCloseMarketPositionEnabled) {
                if (!orderData) return
                await executeOrdersAsync({ orderData })
              }
            }}
          >
            Market
          </TableButton>
        )}
      </DialogTrigger>
      {/* dont autofocus the size input */}
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        variant="perps-default"
      >
        <DialogHeader className="!text-left">
          <DialogTitle>Market Close</DialogTitle>
          <DialogDescription>
            Attempts to close the position immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-2 text-sm">
              <StatItem
                title="Size"
                value={
                  <p
                    className={classNames(
                      getTextColorClass(positionToClose?.side === 'A' ? 1 : -1),
                    )}
                  >
                    {_sizeToClose} {baseSymbol}
                  </p>
                }
              />
              <StatItem title="Price" value={'Market'} />
            </div>
            <SizeInput
              asset={asset}
              value={sizeToClose}
              onChange={handleSetSizeToClose}
              sizeSide={sizeSide}
              setSizeSide={setSizeSide}
              className="!px-2 text-sm !py-0"
            />
            <PercentageSlider
              value={percentToClose}
              onChange={handeleSetPercentToClose}
              disabled={isPending || !positionToClose}
            />
            <CheckboxSetting
              value={quickCloseMarketPositionEnabled}
              onChange={setQuickCloseMarketPositionEnabled}
              label="Don't show this again"
            />
            {/* connect checker not needed, wont be able to get here unless connected anyway */}
            <PerpsChecker.Legal>
              <PerpsChecker.EnableTrading>
                <PerpsChecker.BuilderFee>
                  <Button
                    variant="perps-default"
                    onClick={async () => {
                      if (!orderData) return
                      await executeOrdersAsync(
                        { orderData },
                        {
                          onSuccess: () => {
                            setOpen(false)
                          },
                        },
                      )
                    }}
                    disabled={
                      isPending ||
                      !positionToClose ||
                      Number.parseFloat(_sizeToClose) === 0
                    }
                    loading={isPending}
                  >
                    Market Close
                  </Button>
                </PerpsChecker.BuilderFee>
              </PerpsChecker.EnableTrading>
            </PerpsChecker.Legal>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
