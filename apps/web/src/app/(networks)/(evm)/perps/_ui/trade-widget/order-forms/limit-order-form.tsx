'use client'
import { useState } from 'react'
import { type TpSlGainLossType, useMidPrice } from 'src/lib/perps'
import { LimitInput, TpSlInput } from '../../_common'
import { useAssetState } from '../asset-state-provider'
import {
  OrderSizeInput,
  ReduceOnly,
  TifSelector,
  TpSlCheckbox,
} from './_common'

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
    mutate: { setTpPrice, setSlPrice, setLimitPrice },
  } = useAssetState()
  const { midPrice } = useMidPrice({
    assetString: activeAsset,
  })
  const [type, setType] = useState<TpSlGainLossType>('percent')
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <LimitInput
          value={limitPrice}
          onChange={setLimitPrice}
          currentMidPrice={midPrice ?? '0'}
          maxDecimals={asset?.formatParseDecimals || 6}
          size="sm"
        />
        <OrderSizeInput />
      </div>
      <div className="flex justify-between gap-2 items-start">
        {asset?.marketType === 'perp' ? (
          <div className="flex flex-col gap-2">
            <ReduceOnly />
            <TpSlCheckbox />
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
