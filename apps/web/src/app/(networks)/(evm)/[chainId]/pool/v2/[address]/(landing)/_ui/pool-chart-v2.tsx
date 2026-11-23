'use client'

import type { RawV2Pool } from '@sushiswap/graph-client/data-api'
import { Card } from '@sushiswap/ui'
import  { type FC, useState } from 'react'
import { SushiSwapProtocol } from 'sushi/evm'
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
    <Card>
      <div className="px-6 pt-4 flex flex-wrap items-center justify-between gap-4">
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
        pool={pool}
        protocol={SushiSwapProtocol.SUSHISWAP_V2}
        height={260}
      />
    </Card>
  )
}

export { PoolChartV2 }
