import { useState } from 'react'
import type { TpSlGainLossType } from 'src/lib/perps/utils'
import { CheckboxSetting } from '../../_common/checkbox-setting'
import { TpSlInput } from '../../_common/tp-sl-input'
import { useAssetState } from '../asset-state-provider'
import { OrderSizeInput } from './_common/order-size-input'
import { ReduceOnly } from './_common/reduce-only'

export const MarketOrderForm = () => {
  const {
    state: {
      asset,
      tradeSide,
      currentLeverageForAsset,
      tpPrice,
      slPrice,
      markPrice,
      hasTpSl,
      maxTradeSize,
      size,
    },
    mutate: { setTpPrice, setSlPrice, setHasTpSl },
  } = useAssetState()
  const [type, setType] = useState<TpSlGainLossType>('percent')
  return (
    <div className="flex flex-col gap-1">
      <OrderSizeInput />
      {asset?.marketType === 'perp' ? (
        <>
          <ReduceOnly />
          <div className="flex flex-col gap-2">
            <CheckboxSetting
              label="Take Profit / Stop Loss"
              value={hasTpSl}
              onChange={(val) => setHasTpSl(val)}
            />
            {hasTpSl ? (
              <TpSlInput
                asset={asset}
                tpPrice={tpPrice}
                onChangeTpPrice={setTpPrice}
                slPrice={slPrice}
                onChangeSlPrice={setSlPrice}
                entryPrice={asset?.midPrice || markPrice}
                side={tradeSide === 'long' ? 'B' : 'A'}
                positionSize={type === 'percent' ? maxTradeSize : size.base}
                positionLeverage={currentLeverageForAsset}
                showExpectedProfit={false}
                inputSize="sm"
                type={type}
                setType={setType}
              />
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  )
}
