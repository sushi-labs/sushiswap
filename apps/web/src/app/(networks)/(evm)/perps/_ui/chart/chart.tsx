'use client'

import { formatPrice } from '@nktkas/hyperliquid/utils'
import { useIsMounted } from '@sushiswap/hooks'
import { createFailedToast } from '@sushiswap/notifications'
import { classNames } from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import { useTheme } from 'next-themes'
import type {
  IChartingLibraryWidget,
  IOrderLineAdapter,
  IPositionLineAdapter,
} from 'public/trading-view/charting_library/charting_library'
import { widget } from 'public/trading-view/charting_library/charting_library.esm.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  TOAST_AUTOCLOSE_TIME,
  prepModifyOrderData,
  useAssetName,
  useCancelOpenOrders,
  useModifyOrder,
  useUserOpenOrders,
  useUserPositions,
} from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { PerpsCard } from '../_common/perps-card'
import { useUserSettingsState } from '../account-management'
import { useAssetListState } from '../asset-selector'
import { useAssetState } from '../trade-widget'
import { registerNoDataSetter } from './datafeed'
import {
  NEGATIVE_COLOR,
  POSITIVE_COLOR,
  applyCommonLineStyles,
  createChartWidgetOptions,
  formatPnlLabel,
  formatTriggerCondition,
  removeAllOrderLines,
  removeLine,
} from './utils'

export const Chart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null)
  const pnlPositionLineRef = useRef<IPositionLineAdapter | null>(null)
  const liquidationLineRef = useRef<IPositionLineAdapter | null>(null)
  const ordersPositionLineRefs = useRef<Record<number, IOrderLineAdapter>>({})

  const { resolvedTheme } = useTheme()
  const isMounted = useIsMounted()
  const [hasNoData, setHasNoData] = useState(false)
  const [chartReady, setChartReady] = useState(false)
  const [pendingOrderPriceOverrides, setPendingOrderPriceOverrides] = useState<
    Record<number, string>
  >({})
  const {
    state: { activeAsset },
  } = useAssetState()

  const address = useAccount('evm')
  const { data: assetName } = useAssetName({ assetString: activeAsset })
  const {
    state: {
      assetListQuery: { data },
    },
  } = useAssetListState()

  const { data: position } = useUserPositions(activeAsset)
  const { data: openOrdersForAsset } = useUserOpenOrders({ coin: activeAsset })
  const { cancelOrders, isPending: isPendingCancelOrders } =
    useCancelOpenOrders()
  const { modifyOrder, isPending: isPendingModifyOrder } = useModifyOrder()

  const {
    state: { showBuySellInChart },
  } = useUserSettingsState()

  const asset = useMemo(() => data?.get?.(activeAsset), [data, activeAsset])

  const { decimals, szDecimals, marketType } = useMemo(
    () => ({
      decimals: asset?.decimals || 6,
      szDecimals: asset?.decimals,
      marketType: asset?.marketType,
    }),
    [asset?.decimals, asset?.marketType],
  )

  const tradeLines = useMemo(() => {
    const pos = position?.[0]

    return {
      entryPrice: pos?.position?.entryPx,
      markPrice: asset?.markPrice || asset?.midPrice,
      pnl: pos?.position?.unrealizedPnl,
      posSize: pos?.position?.szi,
      side: pos?.side,
      openOrders: openOrdersForAsset,
      liquidationPrice: pos?.position?.liquidationPx,
    }
  }, [position, openOrdersForAsset, asset?.markPrice, asset?.midPrice])

  useEffect(() => {
    registerNoDataSetter((nextHasNoData) => {
      console.log('No data available for chart:', nextHasNoData)
      setHasNoData(nextHasNoData)
    })
  }, [])

  useEffect(() => {
    if (!isMounted || !resolvedTheme || !chartContainerRef.current) return
    if (!assetName || decimals === undefined || !marketType) return
    if (tvWidgetRef.current) return

    const intervalQuicks = ['5', '60', '1D']

    localStorage.setItem(
      'tradingview.IntervalWidget.quicks',
      JSON.stringify(intervalQuicks),
    )
    localStorage.setItem('tradingview.current_theme.name', resolvedTheme)
    const widgetOptions = createChartWidgetOptions({
      activeAsset,
      assetName,
      decimals,
      marketType,
      address,
      showBuySellInChart,
      resolvedTheme,
      container: chartContainerRef.current,
    })

    const tvWidget = new widget(widgetOptions)
    tvWidgetRef.current = tvWidget

    tvWidget.onChartReady(() => {
      setChartReady(true)
    })

    return () => {
      removeLine(pnlPositionLineRef.current)
      pnlPositionLineRef.current = null

      removeAllOrderLines(ordersPositionLineRefs.current)
      ordersPositionLineRefs.current = {}

      removeLine(liquidationLineRef.current)
      liquidationLineRef.current = null

      tvWidget.remove()
      tvWidgetRef.current = null
      setChartReady(false)
    }
  }, [
    isMounted,
    resolvedTheme,
    activeAsset,
    assetName,
    decimals,
    marketType,
    address,
    showBuySellInChart,
  ])

  // Position Line
  useEffect(() => {
    try {
      const widget = tvWidgetRef.current

      if (!isMounted || !resolvedTheme || !widget || !chartReady || hasNoData) {
        return
      }

      const chart = widget.activeChart?.()
      if (!chart) return

      if (!tradeLines?.pnl) {
        removeLine(pnlPositionLineRef.current)
        pnlPositionLineRef.current = null
        return
      }

      if (!pnlPositionLineRef.current) {
        pnlPositionLineRef.current = chart.createPositionLine?.() ?? null
      }

      const pnlPositionLine = pnlPositionLineRef.current
      if (!pnlPositionLine) return

      const color = Number(tradeLines.pnl) < 0 ? NEGATIVE_COLOR : POSITIVE_COLOR

      pnlPositionLine.setText(
        formatPnlLabel({
          pnl: tradeLines.pnl,
        }),
      )
      pnlPositionLine.setPrice(Number.parseFloat(tradeLines.entryPrice))

      applyCommonLineStyles({
        line: pnlPositionLine,
        quantity: tradeLines.posSize,
        resolvedTheme,
        color,
      })
    } catch {
      console.warn('Error updating position line')
    }
  }, [
    chartReady,
    hasNoData,
    tradeLines?.entryPrice,
    tradeLines?.posSize,
    tradeLines?.pnl,
    resolvedTheme,
    isMounted,
  ])

  // Liquidation Line
  useEffect(() => {
    try {
      const widget = tvWidgetRef.current

      if (!isMounted || !resolvedTheme || !widget || !chartReady || hasNoData) {
        return
      }

      const chart = widget.activeChart?.()
      if (!chart) return

      if (!tradeLines?.liquidationPrice) {
        removeLine(liquidationLineRef.current)
        liquidationLineRef.current = null
        return
      }

      if (!liquidationLineRef.current) {
        liquidationLineRef.current = chart.createPositionLine?.() ?? null
      }

      const liquidationLine = liquidationLineRef.current
      if (!liquidationLine) return

      liquidationLine.setText('Liq. Price')
      liquidationLine.setPrice(Number.parseFloat(tradeLines.liquidationPrice))

      applyCommonLineStyles({
        line: liquidationLine,
        quantity: undefined,
        resolvedTheme,
        color: NEGATIVE_COLOR,
        lengthMultiplier: 3,
      })
      liquidationLine.setQuantity('')
    } catch {
      console.warn('Error updating position line liq line')
    }
  }, [
    chartReady,
    hasNoData,
    tradeLines?.liquidationPrice,
    resolvedTheme,
    isMounted,
  ])

  // Order Lines
  useEffect(() => {
    try {
      const widget = tvWidgetRef.current

      if (!isMounted || !resolvedTheme || !widget || !chartReady || hasNoData) {
        return
      }

      const chart = widget.activeChart?.()
      if (!chart) return

      const orders = tradeLines.openOrders ?? []
      const lineMap = ordersPositionLineRefs.current
      if (!orders.length) {
        removeAllOrderLines(lineMap)
        ordersPositionLineRefs.current = {}
        return
      }

      const currentOrderIds = new Set(orders.map((order) => order.oid))

      for (const oid of Object.keys(lineMap)) {
        const numericOid = Number(oid)

        if (!currentOrderIds.has(numericOid)) {
          removeLine(lineMap[numericOid])
          delete lineMap[numericOid]
        }
      }

      for (const order of orders) {
        let line = lineMap[order.oid]

        if (!line) {
          line = chart.createOrderLine?.()
          if (!line) continue
          lineMap[order.oid] = line
        }

        const color = order.side === 'A' ? NEGATIVE_COLOR : POSITIVE_COLOR
        const quantity =
          order.sz === '0.0' ? tradeLines?.posSize || '0' : order.sz

        line.setText(
          `${formatTriggerCondition(order.type, order.triggerCondition, order.limitPx)}`,
        )
        if (order.type === 'limit') {
          const effectivePrice =
            pendingOrderPriceOverrides[order.oid] ?? order.limitPx
          console.log(effectivePrice, 'effectivePrice')
          line.setPrice(Number.parseFloat(effectivePrice))
        } else {
          const effectivePrice =
            pendingOrderPriceOverrides[order.oid] ?? order.triggerPx
          line.setPrice(Number.parseFloat(effectivePrice))
        }

        applyCommonLineStyles({
          line,
          quantity,
          resolvedTheme,
          color,
          lengthMultiplier: 5,
        })
        line.setEditable(true)
        line.setCancellable(true)
        line.setModifyTooltip('Drag to update price')
        line.setCancelTooltip('Click to cancel')
        line.onMove(() => {
          if (isPendingModifyOrder) return
          if (szDecimals === undefined || !marketType) return
          const preppedData = prepModifyOrderData(order)
          const newPrice = line.getPrice()?.toString() ?? ''

          if (
            'limit' in preppedData.orderType &&
            (order.side === 'A'
              ? Number(newPrice) < Number(tradeLines.markPrice)
              : Number(newPrice) > Number(tradeLines.markPrice))
          ) {
            return createFailedToast({
              summary: `Limit price must be ${order.side === 'A' ? 'higher' : 'lower'} than current price. To close position immediately, use the position table or order form.`,
              account: '0x',
              chainId: 1,
              type: 'burn',
              timestamp: Date.now(),
              groupTimestamp: Date.now(),
              autoClose: TOAST_AUTOCLOSE_TIME,
              variant: 'perps',
            })
          }

          if (
            'trigger' in preppedData.orderType &&
            preppedData.orderType.trigger.tpsl === 'tp' &&
            (order.side === 'A'
              ? Number(newPrice) < Number(tradeLines.markPrice)
              : Number(newPrice) > Number(tradeLines.markPrice))
          ) {
            return createFailedToast({
              summary: `TP price must be higher than current price. To close position immediately, use the position table or order form.`,
              account: '0x',
              chainId: 1,
              type: 'burn',
              timestamp: Date.now(),
              groupTimestamp: Date.now(),
              autoClose: TOAST_AUTOCLOSE_TIME,
              variant: 'perps',
            })
          }
          if (
            'trigger' in preppedData.orderType &&
            preppedData.orderType.trigger.tpsl === 'sl' &&
            (order.side === 'A'
              ? Number(newPrice) > Number(tradeLines.markPrice)
              : Number(newPrice) < Number(tradeLines.markPrice))
          ) {
            return createFailedToast({
              summary: `SL price must be lower than current price. To close position immediately, use the position table or order form.`,
              account: '0x',
              chainId: 1,
              type: 'burn',
              timestamp: Date.now(),
              groupTimestamp: Date.now(),
              autoClose: TOAST_AUTOCLOSE_TIME,
              variant: 'perps',
            })
          }

          setPendingOrderPriceOverrides((prev) => ({
            ...prev,
            [order.oid]: newPrice,
          }))

          const price = formatPrice(newPrice, szDecimals, marketType)
          modifyOrder(
            {
              ...preppedData,
              price:
                'limit' in preppedData.orderType ? price : preppedData.price,
              orderType:
                'limit' in preppedData.orderType
                  ? {
                      limit: {
                        timeInForce: preppedData.orderType.limit.timeInForce,
                      },
                    }
                  : {
                      trigger: {
                        isMarket: preppedData.orderType.trigger.isMarket,
                        triggerPrice: price,
                        tpsl: preppedData.orderType.trigger.tpsl,
                      },
                    },
            },
            {
              onError: () => {
                setPendingOrderPriceOverrides((prev) => {
                  const next = { ...prev }
                  delete next[order.oid]
                  return next
                })
              },
            },
          )
        })
        line.onCancel(() => {
          if (isPendingCancelOrders) return
          cancelOrders({
            cancelData: [
              {
                asset: order.coin,
                orderId: order.oid,
              },
            ],
          })
        })
      }
    } catch {
      console.warn('Error updating position line')
    }
  }, [
    chartReady,
    hasNoData,
    resolvedTheme,
    isMounted,
    cancelOrders,
    isPendingCancelOrders,
    tradeLines,
    szDecimals,
    modifyOrder,
    isPendingModifyOrder,
    marketType,
    pendingOrderPriceOverrides,
  ])

  return (
    <PerpsCard className="flex flex-col lg:h-[560px] flex-grow p-0 lg:p-2">
      <div className="flex-grow">
        <div
          ref={chartContainerRef}
          className={classNames(
            'h-[385px] lg:h-full',
            !chartReady ? 'hidden' : 'flex',
          )}
        />
        {
          !chartReady ? (
            <div className={classNames('h-[385px] lg:h-full relative')}>
              <div className="absolute top-[calc(50%-20px)] left-[calc(50%-20px)]">
                <div className="w-[50px] h-[50px] animate-[bounce_.5s_linear_infinite_0.17s] absolute">
                  <SushiIcon width={50} height={50} />
                </div>
                <div className="w-[50px] h-[5px] bg-black opacity-20 absolute top-[51px] left-0 rounded-[50%] animate-shadow" />
              </div>
            </div>
          ) : null
          // <div
          //   className={classNames(
          //     'h-[335px] lg:h-full rounded-xl text-muted-foreground items-center justify-center italic text-sm',
          //     hasNoData ? 'flex' : 'hidden',
          //   )}
          // >
          //   No price chart available
          // </div>
        }
      </div>
    </PerpsCard>
  )
}
