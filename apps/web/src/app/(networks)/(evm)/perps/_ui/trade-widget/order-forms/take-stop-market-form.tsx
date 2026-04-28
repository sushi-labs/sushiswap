import { TriggerPriceInput } from '../../_common'
import { useAssetState } from '../asset-state-provider'
import { OrderSizeInput, ReduceOnly } from './_common'

export const TakeStopMarketForm = () => {
  const {
    state: { triggerPrice, asset },
    mutate: { setTriggerPrice },
  } = useAssetState()

  return (
    <div className="flex flex-col gap-2">
      <TriggerPriceInput
        value={triggerPrice}
        onChange={setTriggerPrice}
        className="text-sm !px-2 !py-0"
        maxDecimals={asset?.formatParseDecimals || 6}
      />
      <OrderSizeInput />
      <ReduceOnly />
    </div>
  )
}
