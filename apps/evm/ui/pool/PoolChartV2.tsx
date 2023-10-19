'use client'

import { Card } from '@sushiswap/ui'
import React, { FC, useState } from 'react'
import { ChainId } from 'sushi/chain'

import { PoolChartGraph } from './PoolChartGraph'
import { PoolChartPeriod, PoolChartPeriods } from './PoolChartPeriods'
import { PoolChartType, PoolChartTypes } from './PoolChartTypes'

const charts = [
  PoolChartType.Volume,
  PoolChartType.TVL,
  PoolChartType.Fees,
  PoolChartType.APR,
] as const
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
  const [chart, setChart] = useState<typeof charts[number]>(charts[0])
  const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Month)

  return (
    <Card>
      <div className="border-b border-accent px-6 py-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <PoolChartTypes
          charts={charts}
          selectedChart={chart}
          setChart={setChart}
        />
        <PoolChartPeriods
          periods={periods}
          selectedPeriod={period}
          setPeriod={setPeriod}
        />
      </div>
      <PoolChartGraph
        chart={chart}
        period={period}
        address={address}
        chainId={chainId}
      />
    </Card>
  )
}

export { PoolChartV2 }
