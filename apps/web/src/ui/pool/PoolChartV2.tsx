'use client'

import type { V2Pool } from '@sushiswap/graph-client/data-api'
import { Card } from '@sushiswap/ui'
import React, { type FC, useState } from 'react'
import { SushiSwapProtocol } from 'sushi'
import { Wrapper } from '../swap/trade/wrapper'
import { PoolChartGraph } from './PoolChartGraph'
import { PoolChartPeriod, PoolChartPeriods } from './PoolChartPeriods'
import { PoolChartType, PoolChartTypes } from './PoolChartTypes'

const charts = [
  PoolChartType.Volume,
  PoolChartType.TVL,
  PoolChartType.Fees,
] as const
const periods = [
  PoolChartPeriod.Day,
  PoolChartPeriod.Week,
  PoolChartPeriod.Month,
  PoolChartPeriod.Year,
  PoolChartPeriod.All,
]

interface PoolChartV2Props {
  pool: V2Pool
}

const PoolChartV2: FC<PoolChartV2Props> = ({ pool }) => {
  const [chart, setChart] = useState<(typeof charts)[number]>(charts[0])
  const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Month)

  return (
    <Wrapper className="!p-0" enableBorder>
      <div className="flex flex-col flex-wrap gap-4 px-6 py-4 border-b md:items-center md:justify-between border-accent md:flex-row">
        <div className="flex">
          <PoolChartTypes
            charts={charts}
            selectedChart={chart}
            setChart={setChart}
          />
        </div>
        <div className="flex">
          <PoolChartPeriods
            periods={periods}
            selectedPeriod={period}
            setPeriod={setPeriod}
          />
        </div>
      </div>
      <PoolChartGraph
        chart={chart}
        period={period}
        pool={pool}
        protocol={SushiSwapProtocol.SUSHISWAP_V2}
      />
    </Wrapper>
  )
}

export { PoolChartV2 }
