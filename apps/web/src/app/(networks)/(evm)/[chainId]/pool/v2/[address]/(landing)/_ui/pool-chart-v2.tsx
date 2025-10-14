'use client'

import type { RawV2Pool } from '@sushiswap/graph-client/data-api'
import React, { type FC, useState } from 'react'
import { SushiSwapProtocol } from 'sushi/evm'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'
import { PoolChartGraph } from '~evm/[chainId]/pool/_ui/pool-chart-graph'
import {
  PoolChartPeriod,
  PoolChartPeriods,
} from '~evm/[chainId]/pool/_ui/pool-chart-periods'
import {
  PoolChartType,
  PoolChartTypes,
} from '~evm/[chainId]/pool/_ui/pool-chart-types'

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
  pool: RawV2Pool
}

const PoolChartV2: FC<PoolChartV2Props> = ({ pool }) => {
  const [chart, setChart] = useState<(typeof charts)[number]>(charts[0])
  const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Month)

  return (
    <Wrapper className="!p-0" enableBorder>
      <div className="flex flex-col flex-wrap gap-4 px-6 py-4 border-b lg:items-center lg:justify-between border-accent lg:flex-row">
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
