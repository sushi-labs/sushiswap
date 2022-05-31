import { Pair } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import React, { FC } from 'react'

export const PoolPanelAssetsLabel: FC<{ pair: Pair }> = ({ pair }) => (
  <div className="flex items-center">
    <CurrencyLogo className="rounded-full" currency={pair.token0} size={40} />
    <div className="-ml-2">
      <CurrencyLogo className="rounded-full" currency={pair.token1} size={40} />
    </div>
    <div className="ml-2 text-high-emphesis">
      {pair.token0.symbol}-{pair.token1.symbol}
    </div>
  </div>
)
