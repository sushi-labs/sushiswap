import { useMidPrice } from 'src/lib/perps/use-mid-price'
import { LimitInput } from '../../_common/limit-input'
import { TriggerPriceInput } from '../../_common/trigger-price-input'
import { useAssetState } from '../asset-state-provider'
import { OrderSizeInput } from './_common/order-size-input'
import { ReduceOnly } from './_common/reduce-only'

export const TakeStopLimitForm = () => {
  const {
    state: { triggerPrice, limitPrice, asset, activeAsset },
    mutate: { setTriggerPrice, setLimitPrice },
  } = useAssetState()
  const { midPrice } = useMidPrice({
    assetString: activeAsset,
  })
  return (
    <div className="flex flex-col gap-1">
      <TriggerPriceInput
        value={triggerPrice}
        onChange={setTriggerPrice}
        className="text-sm !px-2 !py-0"
      />
      <LimitInput
        value={limitPrice}
        onChange={setLimitPrice}
        currentMidPrice={midPrice ?? '0'}
        maxDecimals={asset?.decimals || 6}
        size="sm"
      />
      <OrderSizeInput />
      <ReduceOnly />
    </div>
  )
}
