import { useAssetState } from '../asset-state-provider'
import { OrderSizeInput } from './_common/order-size-input'
import { Randomize } from './_common/randomize'
import { ReduceOnly } from './_common/reduce-only'
import { TwapRunningTimeInput } from './_common/twap-running-time-input'

export const TwapOrderForm = () => {
  const {
    state: { asset },
  } = useAssetState()
  return (
    <div className="flex flex-col gap-2">
      <OrderSizeInput />
      <TwapRunningTimeInput />
      <Randomize />
      {asset?.marketType === 'perp' ? <ReduceOnly /> : null}
    </div>
  )
}
