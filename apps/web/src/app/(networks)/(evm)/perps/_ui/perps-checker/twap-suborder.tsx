import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { getTwapOrderCount, getTwapSuborderSize } from 'src/lib/perps'
import { useAssetState } from '../trade-widget/asset-state-provider'

export const TwapSuborder: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'default',
  ...props
}) => {
  const {
    state: { totalRunningTimeInMinutes, tradeType, asset, size: tradeSize },
  } = useAssetState()

  const orderCount = useMemo(() => {
    return getTwapOrderCount(totalRunningTimeInMinutes)
  }, [totalRunningTimeInMinutes])

  const sizePerSuborder = useMemo(() => {
    if (
      Number(tradeSize.quote) === 0 ||
      !asset ||
      !orderCount ||
      tradeType !== 'TWAP'
    ) {
      return 0
    }

    const baseSuborderSize = getTwapSuborderSize({
      totalSize: tradeSize.quote,
      orderCount,
      decimals: 18,
    })
    return Number.parseFloat(baseSuborderSize)
  }, [tradeSize, orderCount, asset, tradeType])

  const { isSuborderValid, buttonText } = useMemo(() => {
    if (tradeType !== 'TWAP') {
      return { isSuborderValid: true, buttonText: '' }
    }
    if (sizePerSuborder < 10) {
      return {
        isSuborderValid: false,
        buttonText: 'Suborders Must Be >= $10 each',
      }
    }
    return { isSuborderValid: true, buttonText: '' }
  }, [sizePerSuborder, tradeType])

  if (!isSuborderValid) {
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        {buttonText}
      </Button>
    )
  }

  return <>{children}</>
}
