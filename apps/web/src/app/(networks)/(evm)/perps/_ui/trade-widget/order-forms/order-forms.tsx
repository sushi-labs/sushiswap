import { useMemo } from 'react'
import { useAssetState } from '../asset-state-provider'
import { LimitOrderForm } from './limit-order-form'
import { MarketOrderForm } from './market-order-form'
import { ScaleOrderForm } from './scale-order-form'
import { TakeStopLimitForm } from './take-stop-limit-form'
import { TakeStopMarketForm } from './take-stop-market-form'
import { TwapOrderForm } from './twap-order-form'

export const OrderForms = () => {
  const {
    state: { tradeType },
  } = useAssetState()
  const content = useMemo(() => {
    switch (tradeType) {
      case 'market':
        return <MarketOrderForm />
      case 'limit':
        return <LimitOrderForm />
      case 'scale':
        return <ScaleOrderForm />
      case 'stop limit':
        return <TakeStopLimitForm />
      case 'stop market':
        return <TakeStopMarketForm />
      case 'take limit':
        return <TakeStopLimitForm />
      case 'take market':
        return <TakeStopMarketForm />
      case 'TWAP':
        return <TwapOrderForm />
      default:
        return null
    }
  }, [tradeType])

  return <>{content}</>
}
