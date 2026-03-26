import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useMidPrice, useScaleOrders, useUserPositions } from 'src/lib/perps'
import { parseUnits } from 'viem'
import { useAssetState } from '../trade-widget'

export const OrderAmount: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const {
    state: {
      maxTradeSize,
      size: orderSize,
      reduceOnly,
      activeAsset,
      tradeSide,
      isTpSlOrder,
      triggerPrice,
      isTpSlLimitOrder,
      limitPrice,
      tradeType,
      isLimitOrder,
    },
  } = useAssetState()
  const { data: existingPositions } = useUserPositions(activeAsset)
  const { midPrice } = useMidPrice({
    assetString: activeAsset,
  })
  const { data: scaleOrderData } = useScaleOrders()
  const allScaleOrdersAreValid = scaleOrderData?.allOrdersValid

  //todo: break this up into smaller checkers
  const existingOppositePosition = useMemo(() => {
    if (!existingPositions || existingPositions.length === 0) return undefined
    return existingPositions?.find(
      (i) =>
        i.position.coin === activeAsset &&
        i.side === (tradeSide === 'long' ? 'A' : 'B'),
    )
  }, [existingPositions, activeAsset, tradeSide])

  const { isSizeValid, buttonText } = useMemo(() => {
    if (!existingOppositePosition && reduceOnly) {
      return { isSizeValid: false, buttonText: 'Reduce Only Too Large' }
    }
    if (reduceOnly && Number(maxTradeSize) === 0) {
      return { isSizeValid: false, buttonText: 'Reduce Only Too Large' }
    }
    if (Number(orderSize.base) === 0) {
      return { isSizeValid: false, buttonText: 'Enter Size' }
    }
    if (Number(orderSize.quote) < 10) {
      return { isSizeValid: false, buttonText: 'Min. Size is $10' }
    }
    if (tradeType === 'scale' && !allScaleOrdersAreValid) {
      return { isSizeValid: false, buttonText: 'Orders Must Be >= $10' }
    }
    if (isTpSlOrder && Number(triggerPrice) === 0) {
      return { isSizeValid: false, buttonText: 'Enter Trigger Price' }
    }
    if (
      isTpSlLimitOrder &&
      tradeSide === 'long' &&
      Number(limitPrice) > Number(midPrice)
    ) {
      return { isSizeValid: false, buttonText: 'Limit Price Too High' }
    }
    if (
      isTpSlLimitOrder &&
      tradeSide === 'short' &&
      Number(limitPrice) < Number(midPrice)
    ) {
      return { isSizeValid: false, buttonText: 'Limit Price Too Low' }
    }
    if (isLimitOrder && Number(limitPrice) === 0) {
      return { isSizeValid: false, buttonText: 'Enter Limit Price' }
    }

    const parsedSize = parseUnits(orderSize.base, 18)
    const parsedMaxTradeSize = parseUnits(maxTradeSize, 18)

    if (parsedSize <= parsedMaxTradeSize) {
      return { isSizeValid: true, buttonText: '' }
    }
    return { isSizeValid: false, buttonText: 'Invalid Order Size' }
  }, [
    maxTradeSize,
    orderSize,
    reduceOnly,
    existingOppositePosition,
    isTpSlOrder,
    triggerPrice,
    isTpSlLimitOrder,
    limitPrice,
    midPrice,
    tradeSide,
    allScaleOrdersAreValid,
    tradeType,
    isLimitOrder,
  ])

  if (!isSizeValid) {
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        {buttonText}
      </Button>
    )
  }

  return <>{children}</>
}
