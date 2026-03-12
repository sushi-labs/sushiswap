import { Button } from '@sushiswap/ui'
import { useCallback, useMemo } from 'react'
import {
  BUILDER_FEE_PERPS,
  BUILDER_FEE_SPOT,
  type OrderData,
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
        console.log('Executing orders with data:', twapOrderData)
        await executeTwapOrderAsync(twapOrderData)
        onMutate?.()
      } catch (error) {
        console.log(error)
      }
    } else {
      if (!orderData || orderData.orders.length === 0) return
      try {
        console.log('Executing orders with data:', orderData)
        await executeOrdersAsync({ orderData })
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
    if (asset?.marketType === 'spot') {
      return tradeSide === 'long' ? 'Buy' : 'Sell'
    }
    return tradeSide === 'long' ? 'Buy / Long' : 'Sell / Short'
  }, [quickConfirmPositionEnabled, onMutate, tradeSide, asset])

  return (
    <Button
      loading={tradeType === 'TWAP' ? isTwapPending : isPending}
      variant={tradeSide === 'long' ? 'default' : 'destructive'}
      onClick={handleExecuteOrders}
      size="lg"
    >
      {buttonText}
    </Button>
  )
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

//todo: clean up and move hooks to own files
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
    },
  } = useAssetState()
  const marketPrice = _useMarketPrice()
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
  ])
}

const _useBuilderFee = () => {
  const {
    state: { asset },
  } = useAssetState()

  return useMemo(() => {
    if (!asset) return BUILDER_FEE_PERPS
    return asset?.marketType === 'perp' ? BUILDER_FEE_PERPS : BUILDER_FEE_SPOT
  }, [asset])
}

const _useMarketPrice = () => {
  const {
    state: { activeAsset, asset, tradeSide },
  } = useAssetState()
  const { midPrice } = useMidPrice({
    assetString: activeAsset,
  })
  const {
    state: { marketOrderSlippage },
  } = useUserSettingsState()

  return useMemo(() => {
    if (!midPrice || !asset) return undefined
    const _midPrice = parseUnits(midPrice ?? '0', asset?.sizePriceDecimals)

    const slippage =
      tradeSide === 'long'
        ? Number(marketOrderSlippage) + 10_000
        : 10_000 - Number(marketOrderSlippage)
    const adjustedPrice = (_midPrice * BigInt(slippage)) / BigInt(10_000) // 8% lower for buy orders

    try {
      return formatPrice(
        formatUnits(adjustedPrice, asset?.sizePriceDecimals),
        asset?.decimals,
        asset?.marketType,
      )
    } catch {
      return undefined
    }
  }, [midPrice, marketOrderSlippage, asset, tradeSide])
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
    const _tpPrice = parseUnits(tpPrice ?? '0', asset?.sizePriceDecimals)
    const _slPrice = parseUnits(slPrice ?? '0', asset?.sizePriceDecimals)
    const tpOrder =
      hasTpSl && tpPrice
        ? {
            asset: activeAsset,
            side: tradeSide === 'long' ? ('short' as const) : ('long' as const),
            price: formatPrice(
              formatUnits(
                (_tpPrice * BigInt(90)) / BigInt(100), //todo: check to make sure this doesnt need to be reversed for shorts
                asset?.sizePriceDecimals,
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
                (_slPrice * BigInt(90)) / BigInt(100), //todo: check to make sure this doesnt need to be reversed for shorts
                asset?.sizePriceDecimals,
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
