import { useAssetState } from '../asset-state-provider'
import {
  OrderSizeInput,
  Randomize,
  ReduceOnly,
  TwapRunningTimeInput,
} from './_common'

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
