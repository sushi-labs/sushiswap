import { formatUnits } from '@ethersproject/units'
import { curveStepAfter } from '@visx/curve'
import { ParentSize } from '@visx/responsive'
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, buildChartTheme, Tooltip, XYChart } from '@visx/xychart'
import { FC, useEffect, useState } from 'react'

import { ScheduleRepresentation, Vesting } from '../context'

interface Props {
  vesting?: Vesting
  schedule?: ScheduleRepresentation
}

interface ChartDataTuple {
  x: Date
  y: string
}

const customTheme = buildChartTheme({
  backgroundColor: '#1e293b',
  colors: ['#c90a7a', '#eccdfe'],
  gridColor: 'rgba(255,255,255,0.05)',
  gridStyles: { strokeWidth: 1, 'stroke-dasharray': '2' },
  tickLength: 0,
  gridColorDark: '#fff',
})

const TickComponent: React.FC<{ formattedValue: string; tickProps: any }> = ({ formattedValue, ...tickProps }) => (
  <text {...tickProps} style={{ fill: 'white' }}>
    {formattedValue}
  </text>
)

export const VestingChart: FC<Props> = (props) => {
  const [chartData, setChartData] = useState<ChartDataTuple[]>()
  const [currentData, setCurrentData] = useState<ChartDataTuple[]>()
  let { vesting, schedule } = props

  useEffect(() => {
    const data = schedule?.periods.map((period): ChartDataTuple => {
      const date = new Date(parseInt(period.time) * 1000)
      return {
        x: date,
        y: formatUnits(period.amount, vesting?.token.decimals).toString(),
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
              margin={{ left: 100, right: 0, top: 50, bottom: 50 }}
              captureEvents={true}
              xScale={{
                type: 'time',
                domain: [vesting?.startTime, vesting?.endTime],
              }}
              yScale={{ type: 'linear', domain: [0, Number(vesting?.amount.toExact())] }}
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
                  <div className="flex flex-col justify-center items-center font-medium px-0 py-1">
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
