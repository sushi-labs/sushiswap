import { useMemo } from 'react'
import { useAssetState } from '../asset-state-provider'
import { LimitOrderForm } from './limit-order-form'
import { MarketOrderForm } from './market-order-form'

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
        return <div>Scale Order Form</div>
      case 'stop limit':
        return <div>Stop Limit Order Form</div>
      case 'stop market':
        return <div>Stop Market Order Form</div>
      case 'take limit':
        return <div>Take Limit Order Form</div>
      case 'take market':
        return <div>Take Market Order Form</div>
      case 'TWAP':
        return <div>TWAP Order Form</div>
      default:
        return null
    }
  }, [tradeType])

  return <>{content}</>
}
