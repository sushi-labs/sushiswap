import { OrderSizeInput } from './_common/order-size-input'
import { ReduceOnly } from './_common/reduce-only'
import { ScaleSizeSkewInput } from './_common/scale-size-skew-input'
import { ScaleStartEndInput } from './_common/scale-start-end-input'
import { ScaleTotalOrdersInput } from './_common/scale-total-orders-input'
import { TifSelector } from './_common/tif-selector'

export const ScaleOrderForm = () => {
  return (
    <div className="flex flex-col gap-2">
      <OrderSizeInput />
      <ScaleStartEndInput />
      <div className="flex items-center justify-between gap-2">
        <ScaleTotalOrdersInput />
        <ScaleSizeSkewInput />
      </div>
      <div className="flex justify-between gap-2 items-start">
        <ReduceOnly />
        <TifSelector />
      </div>
    </div>
  )
}
