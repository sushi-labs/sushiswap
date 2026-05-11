import { useAssetState } from '../asset-state-provider'
import {
  OrderSizeInput,
  ReduceOnly,
  ScaleSizeSkewInput,
  ScaleStartEndInput,
  ScaleTotalOrdersInput,
  TifSelector,
} from './_common'

export const ScaleOrderForm = () => {
  const {
    state: { asset },
  } = useAssetState()
  return (
    <div className="flex flex-col gap-2">
      <OrderSizeInput />
      <ScaleStartEndInput />
      <div className="flex items-center justify-between gap-2">
        <ScaleTotalOrdersInput />
        <ScaleSizeSkewInput />
      </div>
      <div className="flex justify-between gap-1 items-start">
        {asset?.marketType === 'perp' ? <ReduceOnly /> : <div />}
        <TifSelector />
      </div>
    </div>
  )
}
