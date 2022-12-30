// @ts-ignore
import { TickRendererProps } from '@visx/axis/lib/types'
import { curveStepAfter } from '@visx/curve'
// @ts-ignore
import { ParentSize } from '@visx/responsive'
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, buildChartTheme, Tooltip, XYChart } from '@visx/xychart'
import React, { FC, useEffect, useState } from 'react'

import { Vesting } from '../../lib'
import { Schedule } from './createScheduleRepresentation'

interface Props {
  vesting?: Vesting
  schedule?: Schedule
}

interface ChartDataTuple {
  x: Date
  y: string
}

const customTheme = buildChartTheme({
  backgroundColor: '#1e293b',
  colors: ['#c90a7a', '#eccdfe'],
  gridColor: 'rgba(255,255,255,0.05)',
  gridStyles: { strokeWidth: 1, strokeDasharray: '2' },
  tickLength: 0,
  gridColorDark: '#fff',
})

const TickComponent: FC<TickRendererProps> = ({ formattedValue, ...tickProps }) => (
  <text {...tickProps} style={{ fill: 'white' }}>
    {formattedValue}
  </text>
)

export const VestingChart: FC<Props> = ({ vesting, schedule }) => {
  const [chartData, setChartData] = useState<ChartDataTuple[]>()
  const [currentData, setCurrentData] = useState<ChartDataTuple[]>()

  useEffect(() => {
    const data = schedule?.map((period): ChartDataTuple => {
      return {
        x: period.date,
        y: period.total.toSignificant(6),
      }
    })
    const dataBeforeNow = data?.filter(({ x }) => Date.now() >= x.getTime())
    setChartData(data)
    setCurrentData(dataBeforeNow)
  }, [schedule, vesting?.token])

  const accessors = {
    xAccessor: (d: ChartDataTuple) => d.x,
    yAccessor: (d: ChartDataTuple) => d.y,
  }

  return (
    <ParentSize>
      {(parent: any) => (
        <>
          {vesting && (
            <XYChart
              height={400}
              width={parent.width}
              margin={{ left: 30, right: 10, top: 20, bottom: 50 }}
              captureEvents={true}
              xScale={{
                type: 'time',
                domain: [vesting?.startTime, vesting?.endTime],
              }}
              yScale={{
                type: 'linear',
                domain: [0, Number(vesting?.remainingAmount.toExact())],
              }}
              theme={customTheme}
            >
              <AnimatedAxis
                orientation="left"
                numTicks={7}
                hideTicks={true}
                hideAxisLine={true}
                tickComponent={TickComponent}
              />
              <AnimatedAxis
                orientation="bottom"
                numTicks={7}
                hideTicks={true}
                hideAxisLine={true}
                tickComponent={TickComponent}
              />
              <AnimatedGrid columns={false} numTicks={7} />
              <AnimatedLineSeries
                enableEvents={true}
                dataKey={''}
                data={chartData ?? []}
                {...accessors}
                curve={curveStepAfter}
              />
              <AnimatedLineSeries
                dataKey={'1'}
                enableEvents={false}
                data={currentData ?? []}
                {...accessors}
                curve={curveStepAfter}
              />
              <Tooltip
                snapTooltipToDatumX
                snapTooltipToDatumY
                showSeriesGlyphs
                renderTooltip={({ tooltipData }: { tooltipData?: any }) => (
                  <div className="flex flex-col items-center justify-center px-0 py-1 font-medium">
                    <span className="text-slate-500">
                      {new Intl.DateTimeFormat('en-US').format(accessors.xAccessor(tooltipData.nearestDatum.datum))}
                    </span>
                    <span className="mt-4 text-slate-200">
                      Amount vested: {accessors.yAccessor(tooltipData.nearestDatum.datum).toString()}{' '}
                      {vesting?.token.symbol}
                    </span>
                  </div>
                )}
              />
            </XYChart>
          )}
        </>
      )}
    </ParentSize>
  )
}
