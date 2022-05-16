import { curveStep } from '@visx/curve'
import { ParentSize } from '@visx/responsive'
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, XYChart, buildChartTheme, Tooltip } from '@visx/xychart'
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
  backgroundColor: '#f09ae9',
  colors: ['#c90a7a', '#eccdfe'],
  gridColor: 'rgba(255,255,255,0.05)',
  gridStyles: { strokeWidth: 1, 'stroke-dasharray': '2' },
})

export const VestingChart: FC<Props> = (props) => {
  const [chartData, setChartData] = useState<ChartDataTuple[]>()
  const [currentData, setCurrentData] = useState<ChartDataTuple[]>()
  let { vesting, schedule } = props

  console.log(schedule)

  useEffect(() => {
    const data = schedule.periods.map((period): ChartDataTuple => {
      const date = new Date(parseInt(period.time) * 1000)
      return {
        x: date,
        y: period.amount,
      }
    })
    const dataBeforeNow = data.filter(({ x }) => Date.now() >= x.getTime())
    setChartData(data)
    setCurrentData(data.slice(0, 10))
  }, [schedule])

  const accessors = {
    xAccessor: (d: ChartDataTuple) => {
      // console.log(d)
      return d.x
    },
    yAccessor: (d: ChartDataTuple) => {
      // console.log(d)
      return d.y
    },
  }

  return (
    <ParentSize>
      {(parent) => (
        <>
          <XYChart
            height={400}
            width={parent.width}
            margin={{ left: 100, right: 0, top: 50, bottom: 50 }}
            captureEvents={true}
            xScale={{
              type: 'time',
              domain: [vesting.startTime, vesting.endTime],
            }}
            yScale={{ type: 'linear', domain: [0, Number(vesting.amount.numerator.toString())] }}
            theme={customTheme}
          >
            <AnimatedAxis
              orientation="left"
              numTicks={7}
              hideTicks={true}
              hideAxisLine={true}
              tickClassName="text-gray-100"
              tickComponent={({ formattedValue, ...tickProps }) => (
                <text {...tickProps} style={{ fill: 'white' }}>
                  {formattedValue}
                </text>
              )}
            />
            <AnimatedAxis
              orientation="bottom"
              hideTicks={true}
              hideAxisLine={true}
              tickComponent={({ formattedValue, ...tickProps }) => (
                <text {...tickProps} style={{ fill: 'white' }}>
                  {formattedValue}
                </text>
              )}
            />
            <AnimatedGrid columns={false} numTicks={7} />
            <AnimatedLineSeries
              enableEvents={true}
              dataKey={''}
              data={chartData ?? []}
              {...accessors}
              curve={curveStep}
            />
            <AnimatedLineSeries
              dataKey={'1'}
              enableEvents={false}
              data={currentData ?? []}
              {...accessors}
              curve={curveStep}
            />
            <Tooltip
              // @ts-ignore
              snapTooltipToDatumX
              snapTooltipToDatumY
              showSeriesGlyphs
              renderTooltip={({ tooltipData, colorScale }: { tooltipData: any; colorScale: any }) => (
                <div>
                  <div>{tooltipData.nearestDatum.key}</div>
                  {accessors.xAccessor(tooltipData.nearestDatum.datum).toString()}
                  {', '}
                  {accessors.yAccessor(tooltipData.nearestDatum.datum)}
                </div>
              )}
            />
          </XYChart>
        </>
      )}
    </ParentSize>
  )
}
