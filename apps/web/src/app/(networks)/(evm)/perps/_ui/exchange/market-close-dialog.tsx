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
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
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
  isOpen,
  onOpenChange,
}: {
  positionToClose: UserPositionsItemType
  trigger?: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [open, setOpen] = useState(false)
  const [sizeSide, setSizeSide] = useState<'base' | 'quote'>('base')
  const [percentToClose, setPercentToClose] = useState(100)
  const {
    state: { quickCloseMarketPositionEnabled },
    mutate: { setQuickCloseMarketPositionEnabled },
  } = useUserSettingsState()
  const initBase =
    positionToClose?.position?.szi?.split('-')?.[1] ||
    positionToClose?.position?.szi ||
    '0'
  const initQuote = Number.parseFloat(
    positionToClose?.position?.positionValue ?? '0',
  )
  const [sizeToClose, setSizeToClose] = useState<{
    base: string
    quote: string
  }>({
    base: initBase.toString() || '0',
    quote: initQuote.toString() || '0',
  })
  const { executeOrders, isPending } = useExecuteOrders()
  const {
    state: {
      assetListQuery: { data: assetListData },
    },
  } = useAssetListState()
  const { midPrice } = useMidPrice({
    assetString: positionToClose.position.coin,
  })

  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(nextOpen)
      } else {
        setOpen(nextOpen)
      }
    },
    [isControlled, onOpenChange],
  )

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

      const size = initBase
      try {
        const { baseSize, quoteSize, percentage } =
          getSizeAndPercentageFromPercentageInput({
            percentageInput: val,
            maxSize: size,
            priceUsd: midPrice ?? '0',
            decimals: asset.formatParseDecimals,
          })

        setSizeToClose({ base: baseSize, quote: quoteSize })
        setPercentToClose(percentage)
      } catch (e) {
        console.error('Error formatting size:', e)
        setSizeToClose({ base: '0', quote: '0' })
        setPercentToClose(val)
      }
    },
    [positionToClose, asset, midPrice, initBase],
  )

  const handleSetSizeToClose = useCallback(
    (value: string) => {
      if (!positionToClose || !asset) return

      const size = initBase
      try {
        const { baseSize, quoteSize, percentage } =
          getSizeAndPercentageFromInput({
            inputValue: value,
            sizeSide,
            maxSize: size,
            priceUsd: midPrice ?? '0',
            decimals: asset.formatParseDecimals,
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
    [positionToClose, asset, sizeSide, midPrice, initBase],
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

    const _midPrice = parseUnits(midPrice ?? '0', asset?.formatParseDecimals)
    const adjustedPrice =
      positionToClose.side === 'A'
        ? (_midPrice * BigInt(108)) / BigInt(100) // 8% higher than market price for sell orders
        : (_midPrice * BigInt(92)) / BigInt(100) // 8% lower for buy orders

    //8% higher than market price for sell orders, 8% lower for buy orders to ensure fills
    const marketPrice = formatPrice(
      formatUnits(adjustedPrice, asset?.formatParseDecimals),
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
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <TableButton disabled={isPending || !positionToClose}>
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
            <PerpsChecker.Legal size="default" variant="perps-default">
              <PerpsChecker.EnableTrading
                size="default"
                variant="perps-default"
              >
                <PerpsChecker.BuilderFee size="default" variant="perps-default">
                  <PerpsChecker.Referral size="default" variant="perps-default">
                    <Button
                      size="default"
                      variant="perps-default"
                      onClick={() => {
                        if (!orderData) return
                        executeOrders(
                          { orderData },
                          {
                            onSuccess: () => {
                              handleOpenChange(false)
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
                  </PerpsChecker.Referral>
                </PerpsChecker.BuilderFee>
              </PerpsChecker.EnableTrading>
            </PerpsChecker.Legal>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
