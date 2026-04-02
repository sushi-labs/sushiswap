import { useMemo } from 'react'
import {
  BUILDER_FEE_PERPS,
  type UserPositionsItemType,
  formatPrice,
  formatSize,
  useExecuteOrders,
  useMidPrice,
} from 'src/lib/perps'
import { formatUnits, parseUnits } from 'viem'
import { TableButton } from '../_common'
import { useAssetListState } from '../asset-selector'

export const ReverseQuick = ({
  position,
}: { position: UserPositionsItemType }) => {
  const { executeOrders, isPending } = useExecuteOrders()
  const { midPrice } = useMidPrice({
    assetString: position.position.coin,
  })
  const {
    state: {
      assetListQuery: { data: assetListData },
    },
  } = useAssetListState()
  const asset = useMemo(() => {
    if (!position) return undefined
    const _asset = assetListData?.get?.(position.position.coin)
    if (!_asset) {
      throw new Error(`Asset data not available for ${position.position.coin}`)
    }
    return _asset
  }, [assetListData, position])

  const orderData = useMemo(() => {
    if (!position || !asset) return null

    const _position = position.position
    const size = Math.abs(Number(position.position.szi)) * 2
    const positionSize = formatSize(size, asset.decimals)
    const _midPrice = parseUnits(midPrice ?? '0', asset?.formatParseDecimals)
    const adjustedPrice =
      position.side === 'A'
        ? (_midPrice * BigInt(108)) / BigInt(100) // 8% higher than market price for sell orders
        : (_midPrice * BigInt(92)) / BigInt(100) // 8% lower for buy orders

    //8% higher than market price for sell orders, 8% lower for buy orders to ensure fills
    const marketPrice = formatPrice(
      formatUnits(adjustedPrice, asset?.formatParseDecimals),
      asset?.decimals,
      asset?.marketType,
    )

    const order = {
      asset: _position.coin,
      side: position.side === 'B' ? ('short' as const) : ('long' as const),
      price: marketPrice,
      size: positionSize,
      reduceOnly: false,
      orderType: { limit: { timeInForce: 'FrontendMarket' as const } },
    }

    return {
      orders: [order],
      builder: {
        builderFee: BUILDER_FEE_PERPS,
      },
    }
  }, [position, midPrice, asset])
  return (
    <TableButton
      disabled={isPending || !position}
      onClick={() => {
        if (!orderData) return
        executeOrders({ orderData })
      }}
    >
      Reverse
    </TableButton>
  )
}
