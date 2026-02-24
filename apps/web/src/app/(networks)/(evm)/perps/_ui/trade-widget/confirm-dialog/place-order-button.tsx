import { formatPrice, formatSize } from '@nktkas/hyperliquid/utils'
import { Button } from '@sushiswap/ui'
import { useCallback, useMemo } from 'react'
import { BUILDER_FEE_PERPS, BUILDER_FEE_SPOT } from 'src/lib/perps/config'
import {
  type OrderData,
  useExecuteOrders,
} from 'src/lib/perps/exchange/use-execute-orders'
import { useMidPrice } from 'src/lib/perps/use-mid-price'
import { formatUnits, parseUnits } from 'viem'
import { useUserSettingsState } from '../../account-management/settings-provider'
import { useAssetState } from '../asset-state-provider'

export const PlaceOrderButton = ({ onMutate }: { onMutate?: () => void }) => {
  const {
    state: { tradeSide },
  } = useAssetState()
  const orderData = _useOrderData()
  const { executeOrdersAsync, isPending } = useExecuteOrders()
  const {
    state: { quickConfirmPositionEnabled },
  } = useUserSettingsState()
  const handleExecuteOrders = useCallback(async () => {
    if (!orderData || orderData.orders.length === 0) return
    try {
      console.log('Executing orders with data:', orderData)
      await executeOrdersAsync({ orderData })
      onMutate?.()
    } catch (error) {
      console.log(error)
    }
  }, [executeOrdersAsync, orderData, onMutate])
  return (
    <Button
      loading={isPending}
      variant={tradeSide === 'long' ? 'default' : 'destructive'}
      onClick={handleExecuteOrders}
      size="lg"
    >
      {quickConfirmPositionEnabled && !onMutate
        ? 'Place Order'
        : tradeSide === 'long'
          ? 'Buy / Long'
          : 'Sell / Short'}
    </Button>
  )
}

//todo: clean up and move this hooks to own files
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

  return useMemo<OrderData | undefined>(() => {
    if (!asset) return undefined
    switch (tradeType) {
      case 'market': {
        const _size = formatSize(size.base, asset?.decimals)
        if (!marketPrice) return undefined
        const mainOrder = {
          asset: activeAsset,
          side: tradeSide,
          price: marketPrice,
          size: _size,
          reduceOnly,

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
          reduceOnly,

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
      case 'scale':
        return {
          orders: [],
          builder: {
            builderFee: builderFee,
          },
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
      case 'TWAP':
        return {
          orders: [],
          builder: {
            builderFee: builderFee,
          },
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
    const _midPrice = parseUnits(midPrice ?? '0', asset?.decimals)
    const slippage =
      tradeSide === 'long'
        ? Number(marketOrderSlippage) + 10_000
        : 10_000 - Number(marketOrderSlippage)
    const adjustedPrice = (_midPrice * BigInt(slippage)) / BigInt(10_000) // 8% lower for buy orders

    try {
      return formatPrice(
        formatUnits(adjustedPrice, asset?.decimals),
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
    const _size = formatSize(size.base, asset?.decimals)
    const _tpPrice = parseUnits(tpPrice ?? '0', asset?.decimals)
    const _slPrice = parseUnits(slPrice ?? '0', asset?.decimals)
    const tpOrder =
      hasTpSl && tpPrice
        ? {
            asset: activeAsset,
            side: tradeSide === 'long' ? ('short' as const) : ('long' as const),
            price: formatPrice(
              formatUnits(
                (_tpPrice * BigInt(90)) / BigInt(100), //todo: check to make sure this doesnt need to be reversed for shorts
                asset?.decimals,
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
                asset?.decimals,
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
