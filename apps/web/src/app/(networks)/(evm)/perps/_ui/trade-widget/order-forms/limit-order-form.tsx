import { useState } from 'react'
import { type TpSlGainLossType, useMidPrice } from 'src/lib/perps'
import { CheckboxSetting } from '../../_common/checkbox-setting'
import { LimitInput } from '../../_common/limit-input'
import { TpSlInput } from '../../_common/tp-sl-input'
import { useAssetState } from '../asset-state-provider'
import { OrderSizeInput } from './_common/order-size-input'
import { ReduceOnly } from './_common/reduce-only'
import { TifSelector } from './_common/tif-selector'

export const LimitOrderForm = () => {
  const {
    state: {
      asset,
      tradeSide,
      currentLeverageForAsset,
      tpPrice,
      slPrice,
      hasTpSl,
      maxTradeSize,
      size,
      limitPrice,
      activeAsset,
    },
    mutate: { setTpPrice, setSlPrice, setHasTpSl, setLimitPrice },
  } = useAssetState()
  const { midPrice } = useMidPrice({
    assetString: activeAsset,
  })
  const [type, setType] = useState<TpSlGainLossType>('percent')
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <LimitInput
          value={limitPrice}
          onChange={setLimitPrice}
          currentMidPrice={midPrice ?? '0'}
          maxDecimals={asset?.decimals || 6}
          size="sm"
        />
        <OrderSizeInput />
      </div>
      <div className="flex justify-between gap-2 items-start">
        {asset?.marketType === 'perp' ? (
          <div className="flex flex-col gap-2">
            <ReduceOnly />
            <CheckboxSetting
              label="Take Profit / Stop Loss"
              value={hasTpSl}
              onChange={(val) => setHasTpSl(val)}
            />
          </div>
        ) : (
          <div />
        )}
        <TifSelector />
      </div>
      {hasTpSl ? (
        <TpSlInput
          asset={asset}
          tpPrice={tpPrice}
          onChangeTpPrice={setTpPrice}
          slPrice={slPrice}
          onChangeSlPrice={setSlPrice}
          entryPrice={limitPrice}
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
  )
}
