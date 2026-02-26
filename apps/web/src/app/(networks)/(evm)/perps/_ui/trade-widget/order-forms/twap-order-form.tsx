import { OrderSizeInput } from './_common/order-size-input'
import { Randomize } from './_common/randomize'
import { ReduceOnly } from './_common/reduce-only'
import { TwapRunningTimeInput } from './_common/twap-running-time-input'

export const TwapOrderForm = () => {
  return (
    <div className="flex flex-col gap-2">
      <OrderSizeInput />
      <TwapRunningTimeInput />
      <Randomize />
      <ReduceOnly />
    </div>
  )
}
