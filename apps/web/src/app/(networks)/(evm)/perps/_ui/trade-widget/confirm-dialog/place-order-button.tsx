import { Button } from '@sushiswap/ui'
import { useCallback, useMemo } from 'react'
import {
  BUILDER_FEE_PERPS,
  BUILDER_FEE_SPOT,
  type OrderData,
  type PerpOrSpotAsset,
  type TwapOrder,
  formatPrice,
  formatSize,
  useExecuteOrders,
  useExecuteTwapOrder,
  useMidPrice,
  useScaleOrders,
} from 'src/lib/perps'
import { formatUnits, parseUnits } from 'viem'
import { useUserSettingsState } from '../../account-management'
import { useAssetState } from '../asset-state-provider'

export const PlaceOrderButton = ({ onMutate }: { onMutate?: () => void }) => {
  const {
    state: { tradeSide, tradeType, asset },
  } = useAssetState()
  const orderData = _useOrderData()
  const twapOrderData = _useTwapOrderData()
  const { executeOrdersAsync, isPending } = useExecuteOrders()
  const { executeTwapOrderAsync, isPending: isTwapPending } =
    useExecuteTwapOrder()
  const {
    state: { quickConfirmPositionEnabled },
  } = useUserSettingsState()

  const handleExecuteOrders = useCallback(async () => {
    if (tradeType === 'TWAP') {
      if (!twapOrderData) return
      try {
        // console.log('Executing orders with data:', twapOrderData)
        await executeTwapOrderAsync({
          orderData: twapOrderData,
        })
        onMutate?.()
      } catch (error) {
        console.log(error)
      }
    } else {
      if (!orderData || orderData.orders.length === 0) return
      try {
        if (tradeType === 'basis trade') {
          const singleLegOrders = getBasisTradeSingleLegOrderData(orderData)

          for (const singleLegOrderData of singleLegOrders) {
            await executeOrdersAsync({ orderData: singleLegOrderData })
          }
        } else {
          // console.log('Executing orders with data:', orderData)
          await executeOrdersAsync({ orderData })
        }
        onMutate?.()
      } catch (error) {
        console.log(error)
      }
    }
  }, [
    executeOrdersAsync,
    executeTwapOrderAsync,
    orderData,
    twapOrderData,
    onMutate,
    tradeType,
  ])

  const buttonText = useMemo(() => {
    if (quickConfirmPositionEnabled && !onMutate) {
      return 'Place Order'
    }
    if (tradeType === 'basis trade') {
      return tradeSide === 'long' ? 'Buy / Short' : 'Sell / Long'
    }
    if (asset?.marketType === 'spot') {
      return tradeSide === 'long' ? 'Buy' : 'Sell'
    }
    return tradeSide === 'long' ? 'Buy / Long' : 'Sell / Short'
  }, [quickConfirmPositionEnabled, onMutate, tradeType, tradeSide, asset])

  return (
    <Button
      loading={tradeType === 'TWAP' ? isTwapPending : isPending}
      variant={tradeSide === 'long' ? 'perps-long' : 'perps-short'}
      onClick={handleExecuteOrders}
      size="sm"
    >
      {buttonText}
    </Button>
  )
}

function getBasisTradeSingleLegOrderData(orderData: OrderData): OrderData[] {
  return orderData.orders.map((order) => ({
    orders: [order],
    grouping: 'na' as const,
    builder: {
      // https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/asset-ids#perps
      builderFee:
        Number(order.asset) >= 10_000 && Number(order.asset) < 100_000
          ? BUILDER_FEE_SPOT
          : BUILDER_FEE_PERPS,
    },
  }))
}

const _useTwapOrderData = () => {
  const {
    state: {
      tradeSide,
      tradeType,
      activeAsset,
      size,
      asset,
      reduceOnly,
      twapRandomize,
      totalRunningTimeInMinutes,
    },
  } = useAssetState()
  return useMemo<TwapOrder | undefined>(() => {
    if (tradeType !== 'TWAP' || !asset) return undefined
    const _size = formatSize(size.base, asset?.decimals)
    if (totalRunningTimeInMinutes < 5 || totalRunningTimeInMinutes > 1440) {
      return undefined
    }
    return {
      asset: activeAsset,
      side: tradeSide,
      size: _size,
      reduceOnly: asset?.marketType === 'perp' ? reduceOnly : false, // spot market orders cannot be reduce only
      ramdonize: twapRandomize,
      minutes: totalRunningTimeInMinutes,
    }
  }, [
    tradeSide,
    tradeType,
    activeAsset,
    size,
    asset,
    reduceOnly,
    twapRandomize,
    totalRunningTimeInMinutes,
  ])
}

const _useOrderData = () => {
  const {
    state: {
      tradeSide,
      tradeType,
      activeAsset,
      size,
      asset,
      reduceOnly,
      limitPrice,
      timeInForce,
      triggerPrice,
      basisTradeAsset,
      basisTradeSize,
    },
  } = useAssetState()
  const marketPrice = _useMarketPrice()
  const basisSpotMarketPrice = _useMarketPriceForAsset({
    assetString: basisTradeAsset?.spotAsset.name,
    asset: basisTradeAsset?.spotAsset,
    tradeSide: tradeSide === 'long' ? 'long' : 'short',
  })
  const basisPerpMarketPrice = _useMarketPriceForAsset({
    assetString: basisTradeAsset?.perpAsset.name,
    asset: basisTradeAsset?.perpAsset,
    tradeSide: tradeSide === 'long' ? 'short' : 'long',
  })
  const { tpOrder, slOrder } = _useTpSlOrder()
  const builderFee = _useBuilderFee()
  const { data: scaleOrderData } = useScaleOrders()

  return useMemo<OrderData | undefined>(() => {
    if (!asset || tradeType === 'TWAP') return undefined
    switch (tradeType) {
      case 'market': {
        const _size = formatSize(size.base, asset?.decimals)
        if (!marketPrice) return undefined
        const mainOrder = {
          asset: activeAsset,
          side: tradeSide,
          price: marketPrice,
          size: _size,
          reduceOnly: asset?.marketType === 'perp' ? reduceOnly : false, // spot market orders cannot be reduce only
          orderType: { limit: { timeInForce: 'FrontendMarket' as const } },
        }

        return {
          orders: [
            mainOrder,
            ...(tpOrder ? [tpOrder] : []),
            ...(slOrder ? [slOrder] : []),
          ],
          grouping:
            tpOrder || slOrder ? ('normalTpsl' as const) : ('na' as const),
          builder: {
            builderFee: builderFee,
          },
        }
      }
      case 'limit': {
        const _size = formatSize(size.base, asset?.decimals)
        const price = formatPrice(
          limitPrice,
          asset?.decimals,
          asset?.marketType,
        )
        const mainOrder = {
          asset: activeAsset,
          side: tradeSide,
          price: price,
          size: _size,
          reduceOnly: asset?.marketType === 'perp' ? reduceOnly : false, // spot market orders cannot be reduce only
          orderType: { limit: { timeInForce: timeInForce } },
        }

        return {
          orders: [
            mainOrder,
            ...(tpOrder ? [tpOrder] : []),
            ...(slOrder ? [slOrder] : []),
          ],
          grouping:
            tpOrder || slOrder ? ('normalTpsl' as const) : ('na' as const),
          builder: {
            builderFee: builderFee,
          },
        }
      }
      case 'basis trade': {
        if (
          !basisTradeAsset ||
          !basisSpotMarketPrice ||
          !basisPerpMarketPrice
        ) {
          return undefined
        }

        const spotSize = formatSize(
          basisTradeSize.spot.base,
          basisTradeAsset.spotAsset.decimals,
        )
        const perpSize = formatSize(
          basisTradeSize.perp.base,
          basisTradeAsset.perpAsset.decimals,
        )

        return {
          orders: [
            {
              asset: basisTradeAsset.spotAsset.name,
              side:
                tradeSide === 'long' ? ('long' as const) : ('short' as const),
              price: basisSpotMarketPrice,
              size: spotSize,
              reduceOnly: false,
              orderType: {
                limit: { timeInForce: 'FrontendMarket' as const },
              },
            },
            {
              asset: basisTradeAsset.perpAsset.name,
              side:
                tradeSide === 'long' ? ('short' as const) : ('long' as const),
              price: basisPerpMarketPrice,
              size: perpSize,
              reduceOnly: false,
              orderType: {
                limit: { timeInForce: 'FrontendMarket' as const },
              },
            },
          ],
          grouping: 'na' as const,
          builder: {
            builderFee: builderFee,
          },
        }
      }
      case 'scale': {
        const orders = scaleOrderData?.orders
        if (!orders || orders.length === 0) return undefined

        const scaleOrders = orders?.map((order) => ({
          asset: activeAsset,
          side: tradeSide,
          price: order.price,
          size: order.size,
          reduceOnly: asset?.marketType === 'perp' ? reduceOnly : false, // spot market orders cannot be reduce only
          orderType: { limit: { timeInForce: timeInForce } },
        }))

        return {
          orders: scaleOrders,
          grouping: 'na' as const,
          builder: {
            builderFee: builderFee,
          },
        }
      }
      case 'stop limit': {
        const _size = formatSize(size.base, asset?.decimals)
        const price = formatPrice(
          limitPrice,
          asset?.decimals,
          asset?.marketType,
        )
        const _triggerPrice = formatPrice(
          triggerPrice,
          asset?.decimals,
          asset?.marketType,
        )
        const order = {
          asset: activeAsset,
          side: tradeSide,
          price: price,
          size: _size,
          reduceOnly,
          orderType: {
            trigger: {
              isMarket: false,
              tpsl: 'sl' as const,
              triggerPrice: _triggerPrice,
            },
          },
        }

        return {
          orders: [order],
          grouping: 'na' as const,
          builder: {
            builderFee: builderFee,
          },
        }
      }
      case 'stop market': {
        const _size = formatSize(size.base, asset?.decimals)
        if (!marketPrice) return undefined
        const _triggerPrice = formatPrice(
          triggerPrice,
          asset?.decimals,
          asset?.marketType,
        )
        const order = {
          asset: activeAsset,
          side: tradeSide,
          price: marketPrice,
          size: _size,
          reduceOnly,
          orderType: {
            trigger: {
              isMarket: true,
              tpsl: 'sl' as const,
              triggerPrice: _triggerPrice,
            },
          },
        }

        return {
          orders: [order],
          grouping: 'na' as const,
          builder: {
            builderFee: builderFee,
          },
        }
      }
      case 'take limit': {
        const _size = formatSize(size.base, asset?.decimals)
        const price = formatPrice(
          limitPrice,
          asset?.decimals,
          asset?.marketType,
        )
        const _triggerPrice = formatPrice(
          triggerPrice,
          asset?.decimals,
          asset?.marketType,
        )
        const order = {
          asset: activeAsset,
          side: tradeSide,
          price: price,
          size: _size,
          reduceOnly,
          orderType: {
            trigger: {
              isMarket: false,
              tpsl: 'tp' as const,
              triggerPrice: _triggerPrice,
            },
          },
        }

        return {
          orders: [order],
          grouping: 'na' as const,
          builder: {
            builderFee: builderFee,
          },
        }
      }
      case 'take market': {
        const _size = formatSize(size.base, asset?.decimals)
        if (!marketPrice) return undefined
        const _triggerPrice = formatPrice(
          triggerPrice,
          asset?.decimals,
          asset?.marketType,
        )
        const order = {
          asset: activeAsset,
          side: tradeSide,
          price: marketPrice,
          size: _size,
          reduceOnly,
          orderType: {
            trigger: {
              isMarket: true,
              tpsl: 'tp' as const,
              triggerPrice: _triggerPrice,
            },
          },
        }

        return {
          orders: [order],
          grouping: 'na' as const,
          builder: {
            builderFee: builderFee,
          },
        }
      }
      default:
        throw new Error('Invalid trade type')
    }
  }, [
    tradeSide,
    tradeType,
    activeAsset,
    size,
    asset,
    reduceOnly,
    marketPrice,
    limitPrice,
    timeInForce,
    tpOrder,
    slOrder,
    builderFee,
    triggerPrice,
    scaleOrderData,
    basisTradeAsset,
    basisTradeSize,
    basisSpotMarketPrice,
    basisPerpMarketPrice,
  ])
}

const _useBuilderFee = () => {
  const {
    state: { asset, tradeType },
  } = useAssetState()

  return useMemo(() => {
    if (tradeType === 'basis trade') return BUILDER_FEE_PERPS
    if (!asset) return BUILDER_FEE_PERPS
    return asset?.marketType === 'perp' ? BUILDER_FEE_PERPS : BUILDER_FEE_SPOT
  }, [asset, tradeType])
}

const _useMarketPrice = () => {
  const {
    state: { activeAsset, asset, tradeSide },
  } = useAssetState()
  return _useMarketPriceForAsset({
    assetString: activeAsset,
    asset,
    tradeSide,
  })
}

const _useMarketPriceForAsset = ({
  assetString,
  asset,
  tradeSide,
}: {
  assetString: string | undefined
  asset: PerpOrSpotAsset | undefined
  tradeSide: 'long' | 'short'
}) => {
  const { midPrice } = useMidPrice({
    assetString,
  })
  const {
    state: { marketOrderSlippage },
  } = useUserSettingsState()

  return useMemo(() => {
    return getMarketPrice({
      midPrice,
      marketOrderSlippage,
      asset,
      tradeSide,
    })
  }, [midPrice, marketOrderSlippage, asset, tradeSide])
}

function getMarketPrice({
  midPrice,
  marketOrderSlippage,
  asset,
  tradeSide,
}: {
  midPrice: string | null
  marketOrderSlippage: number
  asset: PerpOrSpotAsset | undefined
  tradeSide: 'long' | 'short'
}): string | undefined {
  if (!midPrice || !asset) return undefined

  const parsedMidPrice = parseUnits(midPrice, asset.formatParseDecimals)
  const slippage =
    tradeSide === 'long'
      ? Number(marketOrderSlippage) + 10_000
      : 10_000 - Number(marketOrderSlippage)
  const adjustedPrice = (parsedMidPrice * BigInt(slippage)) / BigInt(10_000)

  try {
    return formatPrice(
      formatUnits(adjustedPrice, asset.formatParseDecimals),
      asset.decimals,
      asset.marketType,
    )
  } catch {
    return undefined
  }
}

const _useTpSlOrder = () => {
  const {
    state: { tradeSide, activeAsset, asset, hasTpSl, tpPrice, slPrice, size },
  } = useAssetState()
  return useMemo(() => {
    if (!asset || !size?.base) return { tpOrder: undefined, slOrder: undefined }
    if (asset.marketType === 'spot') {
      return { tpOrder: undefined, slOrder: undefined }
    }
    const _size = formatSize(size.base, asset?.decimals)
    const _tpPrice = parseUnits(tpPrice ?? '0', asset?.formatParseDecimals)
    const _slPrice = parseUnits(slPrice ?? '0', asset?.formatParseDecimals)
    const tpOrder =
      hasTpSl && tpPrice
        ? {
            asset: activeAsset,
            side: tradeSide === 'long' ? ('short' as const) : ('long' as const),
            price: formatPrice(
              formatUnits(
                (_tpPrice * BigInt(tradeSide === 'long' ? 92 : 108)) /
                  BigInt(100),
                asset?.formatParseDecimals,
              ),
              asset?.decimals,
              asset?.marketType,
            ),

            size: _size,
            reduceOnly: true,
            orderType: {
              trigger: {
                isMarket: true,
                triggerPrice: formatPrice(
                  tpPrice,
                  asset?.decimals,
                  asset?.marketType,
                ),
                tpsl: 'tp' as const,
              },
            },
          }
        : undefined

    const slOrder =
      hasTpSl && slPrice
        ? {
            asset: activeAsset,
            side: tradeSide === 'long' ? ('short' as const) : ('long' as const),
            price: formatPrice(
              formatUnits(
                (_slPrice * BigInt(tradeSide === 'long' ? 92 : 108)) /
                  BigInt(100),
                asset?.formatParseDecimals,
              ),
              asset?.decimals,
              asset?.marketType,
            ),
            size: _size,
            reduceOnly: true,
            orderType: {
              trigger: {
                isMarket: true,
                triggerPrice: formatPrice(
                  slPrice,
                  asset?.decimals,
                  asset?.marketType,
                ),
                tpsl: 'sl' as const,
              },
            },
          }
        : undefined
    return { tpOrder, slOrder }
  }, [tradeSide, activeAsset, asset, hasTpSl, tpPrice, slPrice, size?.base])
}
