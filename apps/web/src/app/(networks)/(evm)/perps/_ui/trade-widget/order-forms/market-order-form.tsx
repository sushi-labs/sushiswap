'use client'
import { useState } from 'react'
import type { TpSlGainLossType } from 'src/lib/perps'
import { TpSlInput } from '../../_common'
import { useAssetState } from '../asset-state-provider'
import { OrderSizeInput, ReduceOnly, TpSlSwitch } from './_common'

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
    mutate: { setTpPrice, setSlPrice },
  } = useAssetState()
  const [type, setType] = useState<TpSlGainLossType>('percent')
  return (
    <div className="flex flex-col gap-2">
      <OrderSizeInput />
      {asset?.marketType === 'perp' ? (
        <>
          <ReduceOnly />
          <div className="flex flex-col gap-2">
            <TpSlSwitch />
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
