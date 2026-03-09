import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useMidPrice } from 'src/lib/perps'
import { useAssetState } from '../trade-widget'

export const TakeStopTrigger: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'default',
  ...props
}) => {
  const {
    state: { triggerPrice, activeAsset, tradeType, tradeSide },
  } = useAssetState()
  const { midPrice } = useMidPrice({
    assetString: activeAsset,
    refreshIntervalMs: 2_500,
  })

  const { isTriggerPriceValid, buttonText } = useMemo(() => {
    if (
      tradeType !== 'stop limit' &&
      tradeType !== 'stop market' &&
      tradeType !== 'take market' &&
      tradeType !== 'take limit'
    ) {
      return { isTriggerPriceValid: true, buttonText: '' }
    }
    if (tradeType === 'stop limit' || tradeType === 'stop market') {
      if (
        tradeSide === 'long' &&
        triggerPrice &&
        midPrice &&
        Number(triggerPrice) < Number(midPrice)
      ) {
        return {
          isTriggerPriceValid: false,
          buttonText: 'Trigger Must Be Higher Than Mid',
        }
      }
      if (
        tradeSide === 'short' &&
        triggerPrice &&
        midPrice &&
        Number(triggerPrice) > Number(midPrice)
      ) {
        return {
          isTriggerPriceValid: false,
          buttonText: 'Trigger Must Be Lower Than Mid',
        }
      }
    }
    if (tradeType === 'take market' || tradeType === 'take limit') {
      if (
        tradeSide === 'long' &&
        triggerPrice &&
        midPrice &&
        Number(triggerPrice) > Number(midPrice)
      ) {
        return {
          isTriggerPriceValid: false,
          buttonText: 'Trigger Must Be Lower Than Mid',
        }
      }
      if (
        tradeSide === 'short' &&
        triggerPrice &&
        midPrice &&
        Number(triggerPrice) < Number(midPrice)
      ) {
        return {
          isTriggerPriceValid: false,
          buttonText: 'Trigger Must Be Higher Than Mid',
        }
      }
    }
    return { isTriggerPriceValid: true, buttonText: '' }
  }, [tradeType, tradeSide, triggerPrice, midPrice])

  if (!isTriggerPriceValid) {
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        {buttonText}
      </Button>
    )
  }

  return <>{children}</>
}
