import { curveStep } from '@visx/curve'
import { TooltipWithBounds } from '@visx/tooltip'
import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, XYChart } from '@visx/xychart'
import { FC, useEffect, useState } from 'react'
import { ScheduleRepresentation, Vesting } from '../context'

interface Props {
  vesting?: Vesting
  schedule?: ScheduleRepresentation
}

interface ChartDataTuple {
  x: string
  y: string
}

export const VestingChart: FC<Props> = (props) => {
  const [chartData, setChartData] = useState<ChartDataTuple[]>()

  let { vesting, schedule } = props

  useEffect(() => {
    const data = schedule?.periods.map((period) => {
      const date = new Date(parseInt(period.time) * 1000)
      return {
        x: date.toISOString().slice(0, 10),
        y: period.amount,
      }
    })
    setChartData(data)
  }, [schedule])

  const accessors = {
    xAccessor: (d: ChartDataTuple) => d.x,
    yAccessor: (d: ChartDataTuple) => d.y,
  }

  return (
    <XYChart
      height={350}
      width={700}
      xScale={{ type: 'band' }}
      yScale={{ type: 'linear', domain: [0, Number(vesting?.amount.numerator.toString())] }}
    >
      <AnimatedAxis orientation="left" numTicks={4} />
      <AnimatedAxis orientation="bottom" />
      <AnimatedGrid columns={false} numTicks={4} />
      <AnimatedLineSeries dataKey={''} data={chartData ?? []} {...accessors} curve={curveStep} />
      <TooltipWithBounds
        // @ts-ignore
        snapTooltipToDatumX
        snapTooltipToDatumY
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }: { tooltipData: any; colorScale: any }) => (
          <div>
            <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>{tooltipData.nearestDatum.key}</div>
            {accessors.xAccessor(tooltipData.nearestDatum.datum)}
            {', '}
            {accessors.yAccessor(tooltipData.nearestDatum.datum)}
          </div>
        )}
      />
    </XYChart>
  )
}
