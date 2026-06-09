import { useMidPrice } from 'src/lib/perps'
import { LimitInput, TriggerPriceInput } from '../../_common'
import { useAssetState } from '../asset-state-provider'
import { OrderSizeInput, ReduceOnly } from './_common'

export const TakeStopLimitForm = () => {
  const {
    state: { triggerPrice, limitPrice, asset, activeAsset },
    mutate: { setTriggerPrice, setLimitPrice },
  } = useAssetState()
  const { midPrice } = useMidPrice({
    assetString: activeAsset,
  })
  return (
    <div className="flex flex-col gap-2">
      <TriggerPriceInput
        value={triggerPrice}
        onChange={setTriggerPrice}
        className="text-sm !px-2 !py-0"
        maxDecimals={asset?.formatParseDecimals || 6}
      />
      <LimitInput
        value={limitPrice}
        onChange={setLimitPrice}
        currentMidPrice={midPrice ?? '0'}
        maxDecimals={asset?.formatParseDecimals || 6}
        size="sm"
      />
      <OrderSizeInput />
      <ReduceOnly />
    </div>
  )
}
