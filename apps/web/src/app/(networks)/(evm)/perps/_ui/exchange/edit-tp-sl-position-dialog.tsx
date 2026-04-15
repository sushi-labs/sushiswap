'use client'
import PencilIcon from '@heroicons/react/20/solid/PencilIcon'
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
  type TpSlGainLossType,
  type UserPositionsItemType,
  calculateGainFromTp,
  calculateLossFromSl,
  formatPrice,
  formatSize,
  getExistingPositionTpSlOrders,
  getTextColorClass,
  perpsNumberFormatter,
  useExecuteOrders,
  useSymbolSplit,
  useUserOpenOrders,
} from 'src/lib/perps'
import { formatUnits, parseUnits } from 'viem'
import {
  CheckboxSetting,
  ConfigureAmount,
  StatItem,
  TableButton,
  TpSlInput,
  TpSlLimitInput,
} from '../_common'
import { useAssetListState } from '../asset-selector'
import { PerpsChecker } from '../perps-checker'
import { CancelOpenOrder } from './cancel-open-order'

export const EditTpSlPositionDialog = ({
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
  const [tpPrice, setTpPrice] = useState<string>('')
  const [slPrice, setSlPrice] = useState<string>('')
  const [configureAmount, setConfigureAmount] = useState(false)
  const [size, setSize] = useState<number>(0)
  const [hasLimitPrice, setHasLimitPrice] = useState(false)
  const [tpLimitPrice, setTpLimitPrice] = useState<string>('')
  const [slLimitPrice, setSlLimitPrice] = useState<string>('')
  const [type, setType] = useState<TpSlGainLossType>('percent')

  const { data: openOrders } = useUserOpenOrders({
    coin: positionToClose?.position?.coin,
  })
  const { executeOrders, isPending } = useExecuteOrders()
  const {
    state: {
      assetListQuery: { data: assetListData },
    },
  } = useAssetListState()
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

  const { existingTpOrder, existingSlOrder } = useMemo(() => {
    return getExistingPositionTpSlOrders(openOrders)
  }, [openOrders])

  const { baseSymbol } = useSymbolSplit({ asset })

  const positionSize = useMemo(() => {
    if (!positionToClose || !asset) return '0'
    const size = Math.abs(Number(positionToClose.position.szi))
    try {
      return formatSize(size, asset.decimals)
    } catch (error) {
      console.log('error formatting size:', error)
      return '0'
    }
  }, [positionToClose, asset])

  useEffect(() => {
    if (
      !configureAmount &&
      size === 0 &&
      size !== Number.parseFloat(positionSize)
    ) {
      setSize(Number.parseFloat(positionSize))
    }
  }, [positionSize, configureAmount, size])

  const entryPrice = useMemo(() => {
    if (!positionToClose || !asset) return '0'

    try {
      return formatPrice(
        positionToClose.position.entryPx,
        asset.decimals,
        asset.marketType,
      )
    } catch (error) {
      console.log('error formatting entry price:', error)
      return '0'
    }
  }, [positionToClose, asset])

  const markPrice = useMemo(() => {
    if (!positionToClose || !asset) return '0'

    try {
      return formatPrice(
        positionToClose.markPrice,
        asset.decimals,
        asset.marketType,
      )
    } catch (error) {
      console.log('error formatting mark price:', error)
      return '0'
    }
  }, [positionToClose, asset])

  const orderData = useMemo(() => {
    if (!positionToClose || !asset) return null

    const position = positionToClose.position
    const _size = configureAmount
      ? formatSize(Math.abs(Number(size)), asset.decimals)
      : '0' //zero is entire size

    const _tpPrice = parseUnits(tpPrice ?? '0', asset?.formatParseDecimals)
    const _slPrice = parseUnits(slPrice ?? '0', asset?.formatParseDecimals)

    const adjustedTpPrice = formatPrice(
      formatUnits(
        (_tpPrice * BigInt(positionToClose.side === 'B' ? 92 : 108)) /
          BigInt(100),
        asset?.formatParseDecimals,
      ),
      asset?.decimals,
      asset?.marketType,
    )
    const adjustedSlPrice = formatPrice(
      formatUnits(
        (_slPrice * BigInt(positionToClose.side === 'B' ? 108 : 92)) /
          BigInt(100),
        asset?.formatParseDecimals,
      ),
      asset?.decimals,
      asset?.marketType,
    )

    const formattedTpPrice = formatPrice(
      tpPrice || '0',
      asset?.decimals,
      asset?.marketType,
    )
    const formattedTpLimitPrice = formatPrice(
      tpLimitPrice || '0',
      asset?.decimals,
      asset?.marketType,
    )

    const formattedSlPrice = formatPrice(
      slPrice || '0',
      asset?.decimals,
      asset?.marketType,
    )
    const formattedSlLimitPrice = formatPrice(
      slLimitPrice || '0',
      asset?.decimals,
      asset?.marketType,
    )
    const isTpLimit = hasLimitPrice && Number.parseFloat(tpLimitPrice) > 0
    const isSlLimit = hasLimitPrice && Number.parseFloat(slLimitPrice) > 0

    const orders = []

    const tpOrder = {
      asset: position.coin,
      side:
        positionToClose.side === 'B' ? ('short' as const) : ('long' as const),
      price: isTpLimit ? formattedTpLimitPrice : adjustedTpPrice,
      size: _size,
      reduceOnly: true,
      orderType: {
        trigger: {
          isMarket: !isTpLimit,
          tpsl: 'tp' as const,
          triggerPrice: formattedTpPrice,
        },
      },
    }

    if (tpOrder.orderType.trigger.triggerPrice !== '0') {
      orders.push(tpOrder)
    }

    const slOrder = {
      asset: position.coin,
      side:
        positionToClose.side === 'B' ? ('short' as const) : ('long' as const),
      price: isSlLimit ? formattedSlLimitPrice : adjustedSlPrice,
      size: _size,
      reduceOnly: true,
      orderType: {
        trigger: {
          isMarket: !isSlLimit,
          tpsl: 'sl' as const,
          triggerPrice: formattedSlPrice,
        },
      },
    }

    if (slOrder.orderType.trigger.triggerPrice !== '0') {
      orders.push(slOrder)
    }
    // console.log(orders)
    return {
      orders: orders,
      grouping: 'positionTpsl' as const,
      builder: {
        builderFee: BUILDER_FEE_PERPS,
      },
    }
  }, [
    asset,
    configureAmount,
    size,
    positionToClose,
    tpPrice,
    hasLimitPrice,
    slPrice,
    tpLimitPrice,
    slLimitPrice,
  ])

  const expectedProfitUsdc = useMemo(() => {
    if (!positionToClose || !existingTpOrder || !asset) return '0'

    const { gainUsd } = calculateGainFromTp({
      entryPrice,
      positionSize:
        existingTpOrder.sz === '0.0' ? positionSize : existingTpOrder.sz,
      tpPrice: existingTpOrder.triggerPx,
      side: existingTpOrder.side === 'A' ? 'B' : 'A',
      leverage: BigInt(positionToClose?.position.leverage.value),
      decimals: asset?.decimals || 18,
    })
    return gainUsd
  }, [positionToClose, existingTpOrder, asset, entryPrice, positionSize])

  const expectedLossUsdc = useMemo(() => {
    if (!positionToClose || !existingSlOrder || !asset) return '0'

    const { lossUsd } = calculateLossFromSl({
      entryPrice,
      positionSize:
        existingSlOrder.sz === '0.0' ? positionSize : existingSlOrder.sz,
      slPrice: existingSlOrder.triggerPx,
      side: existingSlOrder.side === 'A' ? 'B' : 'A',
      leverage: BigInt(positionToClose?.position.leverage.value),
      decimals: asset?.decimals || 18,
    })
    return lossUsd
  }, [positionToClose, existingSlOrder, asset, entryPrice, positionSize])

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

  return (
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <TableButton disabled={isPending || !positionToClose}>
            <PencilIcon className="w-4 h-4" />
          </TableButton>
        )}
      </DialogTrigger>
      {/* dont autofocus the input */}
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        variant="perps-default"
      >
        <DialogHeader className="!text-left">
          <DialogTitle>TP/SL for Position</DialogTitle>
          <DialogDescription>
            Edit your take profit and stop loss orders for this position.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-2 text-sm">
              <StatItem title="Coin" value={baseSymbol} />
              <StatItem
                title="Size"
                value={
                  <p
                    className={classNames(
                      getTextColorClass(positionToClose?.side === 'B' ? 1 : -1),
                    )}
                  >
                    {positionSize} {baseSymbol}
                  </p>
                }
              />
              <StatItem
                title="Entry Price"
                value={perpsNumberFormatter({
                  value: entryPrice,
                  maxFraxDigits: asset?.formatParseDecimals,
                })}
              />
              <StatItem
                title="Mark Price"
                value={perpsNumberFormatter({
                  value: markPrice,
                  maxFraxDigits: asset?.formatParseDecimals,
                })}
              />

              {existingTpOrder ? (
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">Take Profit</div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <div className="font-medium whitespace-nowrap">
                        <p>{existingTpOrder?.triggerCondition}</p>
                      </div>
                      <CancelOpenOrder
                        orderId={existingTpOrder.oid}
                        coin={positionToClose.position.coin}
                      />
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Expected Profit:{' '}
                      {perpsNumberFormatter({
                        value: expectedProfitUsdc,
                        maxFraxDigits: asset?.formatParseDecimals,
                      })}{' '}
                      USDC
                    </div>
                  </div>
                </div>
              ) : null}
              {existingSlOrder ? (
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">Stop Loss</div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <div className="font-medium whitespace-nowrap">
                        <p>{existingSlOrder?.triggerCondition}</p>
                      </div>
                      <CancelOpenOrder
                        orderId={existingSlOrder.oid}
                        coin={positionToClose.position.coin}
                      />
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Expected Loss: -
                      {perpsNumberFormatter({
                        value: expectedLossUsdc,
                        maxFraxDigits: asset?.formatParseDecimals,
                      })}{' '}
                      USDC
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <TpSlInput
              asset={asset}
              tpPrice={tpPrice}
              onChangeTpPrice={setTpPrice}
              slPrice={slPrice}
              onChangeSlPrice={setSlPrice}
              entryPrice={entryPrice}
              side={positionToClose?.side}
              positionSize={configureAmount ? size.toString() : positionSize}
              positionLeverage={positionToClose?.position.leverage.value}
              showExpectedProfit={true}
              hideSl={Boolean(existingSlOrder)}
              hideTp={Boolean(existingTpOrder)}
              type={type}
              setType={setType}
              inputSize="sm"
            />
            {Boolean(existingSlOrder) && Boolean(existingTpOrder) ? null : (
              <>
                <div className="flex flex-col gap-2">
                  <CheckboxSetting
                    value={configureAmount}
                    onChange={(val) => {
                      setConfigureAmount(val)
                    }}
                    label="Configure amount"
                  />
                  {configureAmount ? (
                    <ConfigureAmount
                      maxDecimals={asset?.formatParseDecimals ?? 6}
                      coinSymbol={baseSymbol}
                      maxValue={Number.parseFloat(positionSize)}
                      value={size}
                      onChange={setSize}
                      step={1 / 10 ** (asset?.decimals || 6)}
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <CheckboxSetting
                    value={hasLimitPrice}
                    onChange={(val) => {
                      setHasLimitPrice(val)
                    }}
                    label="Limit Price"
                  />
                  {hasLimitPrice ? (
                    <TpSlLimitInput
                      asset={asset}
                      tpLimitPrice={tpLimitPrice}
                      onChangeTpLimitPrice={setTpLimitPrice}
                      slLimitPrice={slLimitPrice}
                      onChangeSlLimitPrice={setSlLimitPrice}
                      className="!text-sm !py-0 !px-2"
                    />
                  ) : null}
                </div>
                {/* connect checker not needed, wont be able to get here unless connected anyway */}
                <PerpsChecker.Legal size="default" variant="perps-default">
                  <PerpsChecker.EnableTrading
                    size="default"
                    variant="perps-default"
                  >
                    <PerpsChecker.BuilderFee
                      size="default"
                      variant="perps-default"
                    >
                      <PerpsChecker.HyperReferral
                        size="default"
                        variant="perps-default"
                      >
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
                          disabled={isPending || !positionToClose}
                          loading={isPending}
                        >
                          Confirm
                        </Button>
                      </PerpsChecker.HyperReferral>
                    </PerpsChecker.BuilderFee>
                  </PerpsChecker.EnableTrading>
                </PerpsChecker.Legal>

                <div>
                  <div className="bg-accent w-full h-[1px]" />
                  <p className="text-xs text-muted-foreground italic mt-2">
                    By default take-profit and stop-loss orders apply to the
                    entire position. Take-profit and stop-loss automatically
                    cancel after closing the position. A market order is
                    triggered when the stop loss or take profit price is
                    reached.
                  </p>
                  <p className="text-xs text-muted-foreground italic mt-2">
                    If the order size is configured above, the TP/SL order will
                    be for that size no matter how the position changes in the
                    future.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
