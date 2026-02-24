import { TriggerPriceInput } from '../../_common/trigger-price-input'
import { useAssetState } from '../asset-state-provider'
import { OrderSizeInput } from './_common/order-size-input'
import { ReduceOnly } from './_common/reduce-only'

export const TakeStopMarketForm = () => {
  const {
    state: { triggerPrice },
    mutate: { setTriggerPrice },
  } = useAssetState()

  return (
    <div className="flex flex-col gap-1">
      <TriggerPriceInput
        value={triggerPrice}
        onChange={setTriggerPrice}
        className="text-sm !px-2 !py-0"
      />
      <OrderSizeInput />
      <ReduceOnly />
    </div>
  )
}
