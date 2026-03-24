'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  currencyFormatter,
  formatPrice,
  getSizeAndPercentageFromInput,
  getSizeAndPercentageFromPercentageInput,
  getTextColorClass,
  useAllMids,
  useExecuteOrders,
  useMidPrice,
} from 'src/lib/perps'
import { formatUnits, parseUnits } from 'viem'
import {
  LimitInput,
  PercentageSlider,
  SizeInput,
  TableButton,
} from '../_common'
import { useAssetListState } from '../asset-selector'
import { PerpsChecker } from '../perps-checker'

export const LimitCloseDialog = ({
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
  const initSize =
    positionToClose?.position?.szi?.split('-')?.[1] ||
    positionToClose?.position?.szi ||
    '0'
  const [open, setOpen] = useState(false)
  const [sizeSide, setSizeSide] = useState<'base' | 'quote'>('base')
  const [percentToClose, setPercentToClose] = useState(100)
  const [sizeToClose, setSizeToClose] = useState<{
    base: string
    quote: string
  }>({
    base: initSize,
    quote: '0',
  })
  const [limitPriceToCloseAt, setLimitPriceToCloseAt] = useState<string>('')
  const { executeOrders, isPending } = useExecuteOrders()
  const {
    state: {
      assetListQuery: { data: assetListData },
    },
  } = useAssetListState()
  const { data: allMidsData } = useAllMids()

  const currentMidPrice = useMemo(() => {
    if (!positionToClose.position.coin) return null
    return allMidsData?.mids?.[positionToClose.position.coin ?? '']
  }, [allMidsData?.mids, positionToClose.position.coin])
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

  useEffect(() => {
    if (
      sizeToClose.quote === '0' &&
      initSize !== '0' &&
      percentToClose === 100 &&
      asset
    ) {
      const { baseSize, quoteSize } = getSizeAndPercentageFromPercentageInput({
        percentageInput: 100,
        maxSize: initSize,
        priceUsd: midPrice ?? '0',
        decimals: asset?.formatParseDecimals,
      })

      setSizeToClose({ base: baseSize, quote: quoteSize })
    }
  }, [asset, initSize, midPrice, percentToClose, sizeToClose.quote])

  const handeleSetPercentToClose = useCallback(
    (val: number) => {
      if (!positionToClose || !asset || midPrice == null) {
        setSizeToClose({ base: '0', quote: '0' })
        setPercentToClose(100)
        return
      }

      const size = initSize
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
    [positionToClose, asset, midPrice, initSize],
  )

  const handleSetSizeToClose = useCallback(
    (value: string) => {
      if (!positionToClose || !asset) return

      const size = initSize
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
    [positionToClose, initSize, asset, sizeSide, midPrice],
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
    if (!positionToClose || !asset || !limitPriceToCloseAt) return null

    const position = positionToClose.position

    const _price = parseUnits(
      limitPriceToCloseAt ?? '0',
      asset?.formatParseDecimals,
    )

    const limitPrice = formatPrice(
      formatUnits(_price, asset?.formatParseDecimals),
      asset?.decimals,
      asset?.marketType,
    )

    const order = {
      asset: position.coin,
      side:
        positionToClose.side === 'A' ? ('long' as const) : ('short' as const),
      price: limitPrice,
      size: _sizeToClose,
      reduceOnly: true,
      orderType: { limit: { timeInForce: 'Gtc' as const } },
    }

    return {
      orders: [order],
      builder: {
        builderFee: BUILDER_FEE_PERPS,
      },
    }
  }, [positionToClose, limitPriceToCloseAt, asset, _sizeToClose])

  const estimatedPnL = useMemo(() => {
    if (!positionToClose || !orderData || !limitPriceToCloseAt || !asset) {
      return null
    }

    const orderToClose = orderData.orders?.[0]
    if (!orderToClose) return null

    const decimals = asset.formatParseDecimals
    const SCALE = 10n ** BigInt(decimals)

    try {
      // scaled prices
      const entryPrice = parseUnits(positionToClose.position.entryPx, decimals)
      const closePrice = parseUnits(limitPriceToCloseAt, decimals)

      // scaled base size
      const size = parseUnits(orderToClose.size, decimals)

      // signed price diff (scaled)
      const priceDiff =
        positionToClose.side === 'B'
          ? closePrice - entryPrice // long
          : entryPrice - closePrice // short

      // pnl (scaled quote) = priceDiff * size / SCALE
      const pnlScaled = (priceDiff * size) / SCALE

      return formatUnits(pnlScaled, decimals)
    } catch {
      return null
    }
  }, [positionToClose, orderData, limitPriceToCloseAt, asset])

  return (
    <Dialog
      open={isOpen !== undefined ? isOpen : open}
      onOpenChange={(state) => {
        if (onOpenChange) {
          onOpenChange(state)
        } else {
          setOpen(state)
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <TableButton disabled={isPending || !positionToClose}>
            Limit
          </TableButton>
        )}
      </DialogTrigger>
      {/* dont autofocus the size input */}
      <DialogContent
        variant="perps-default"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="!text-left">
          <DialogTitle>Limit Close</DialogTitle>
          <DialogDescription>
            Send an order to close you position at the limit price.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="flex flex-col gap-4 text-sm">
            <LimitInput
              currentMidPrice={currentMidPrice ?? null}
              value={limitPriceToCloseAt}
              onChange={setLimitPriceToCloseAt}
              maxDecimals={asset?.decimals ?? 6}
              size="sm"
            />
            <SizeInput
              asset={asset}
              value={sizeToClose}
              onChange={handleSetSizeToClose}
              sizeSide={sizeSide}
              setSizeSide={setSizeSide}
              className="!px-2 !py-0 !text-sm"
            />
            <PercentageSlider
              value={percentToClose}
              onChange={handeleSetPercentToClose}
              disabled={isPending || !positionToClose}
            />
            {estimatedPnL !== null ? (
              <div className="text-xs whitespace-nowrap">
                Estimated closed PNL (without fees):{' '}
                <span className={getTextColorClass(Number(estimatedPnL))}>
                  {currencyFormatter.format(Number.parseFloat(estimatedPnL))}
                </span>
              </div>
            ) : null}
            {/* connect checker not needed, wont be able to get here unless connected anyway */}
            <PerpsChecker.Legal>
              <PerpsChecker.EnableTrading>
                <PerpsChecker.BuilderFee>
                  <PerpsChecker.Referral>
                    <Button
                      variant="perps-default"
                      onClick={() => {
                        if (!orderData) return
                        executeOrders(
                          { orderData },
                          {
                            onSuccess: () => {
                              setOpen(false)
                              if (onOpenChange) onOpenChange(false)
                            },
                          },
                        )
                      }}
                      disabled={
                        isPending ||
                        !positionToClose ||
                        !limitPriceToCloseAt ||
                        Number.parseFloat(_sizeToClose) <
                          Number.parseFloat(sizeToClose.base)
                      }
                      loading={isPending}
                    >
                      Limit Close
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
