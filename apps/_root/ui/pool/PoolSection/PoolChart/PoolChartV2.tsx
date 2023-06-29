import React, { FC, useState } from 'react'
import { PoolChartPeriod, PoolChartType } from './types'
import { PoolChartTypes } from './PoolChartTypes'
import { PoolChartPeriods } from './PoolChartPeriods'
import { PoolChartGraph } from './PoolChartGraph'
import { ChainId } from '@sushiswap/chain'

const charts = [PoolChartType.Volume, PoolChartType.TVL, PoolChartType.Fees, PoolChartType.APR] as const
const periods = [
  PoolChartPeriod.Day,
  PoolChartPeriod.Week,
  PoolChartPeriod.Month,
  PoolChartPeriod.Year,
  PoolChartPeriod.All,
]

interface PoolChartV2Props {
  address: string
  chainId: ChainId
}

const PoolChartV2: FC<PoolChartV2Props> = ({ address, chainId }) => {
  const [chart, setChart] = useState<(typeof charts)[number]>(charts[0])
  const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Month)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
        <PoolChartTypes charts={charts} selectedChart={chart} setChart={setChart} />
        <PoolChartPeriods periods={periods} selectedPeriod={period} setPeriod={setPeriod} />
      </div>
      <PoolChartGraph chart={chart} period={period} address={address} chainId={chainId} />
    </div>
  )
}

export { PoolChartV2 }
