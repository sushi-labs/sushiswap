'use client'

import type { GetPoolResponse } from '@sushiswap/graph-client/kadena'
import { Card } from '@sushiswap/ui'
import React, { type FC, useState } from 'react'
import { PoolChartType, PoolChartTypes } from 'src/ui/pool/PoolChartTypes'
import { usePoolDispatch, usePoolState } from '../../../../pool/pool-provider'
import { PoolChartGraph } from './PoolChartGraph'
import { PoolChartPeriod, PoolChartPeriods } from './PoolChartPeriods'

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
  pool: GetPoolResponse | undefined
}

const PoolChartV2: FC<PoolChartV2Props> = ({ pool }) => {
  const [chart, setChart] = useState<(typeof charts)[number]>(charts[0])
  const { poolByIdChartTimeFrame } = usePoolState()
  const { setPoolByIdChartTimeFrame } = usePoolDispatch()

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-accent">
        <div className="flex mx-auto">
          <PoolChartTypes
            charts={charts}
            selectedChart={chart}
            setChart={setChart}
          />
        </div>
        <div className="flex mx-auto">
          <PoolChartPeriods
            periods={periods}
            selectedPeriod={poolByIdChartTimeFrame}
            setPeriod={setPoolByIdChartTimeFrame}
          />
        </div>
      </div>
      <PoolChartGraph
        chart={chart}
        period={poolByIdChartTimeFrame}
        pool={pool}
      />
    </Card>
  )
}

export { PoolChartV2 }
