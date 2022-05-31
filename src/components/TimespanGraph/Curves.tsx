import { AxisBottom, AxisLeft } from '@visx/axis'
import { Brush } from '@visx/brush'
import BaseBrush, { BaseBrushState, UpdateBrush } from '@visx/brush/lib/BaseBrush'
import { GridColumns, GridRows } from '@visx/grid'
import { Group } from '@visx/group'
import { PatternLines } from '@visx/pattern'
import { scaleLinear, scaleTime } from '@visx/scale'
import { LinePath } from '@visx/shape'
// @ts-ignore TYPE NEEDS FIXING
import { extent } from 'd3-array'
import millify from 'millify'
import { useEffect, useMemo, useRef, useState } from 'react'
import React from 'react'

import { classNames } from '../../functions'
import { TimespanGraphProps } from '.'

// @ts-ignore TYPE NEEDS FIXING
export const getX = (data) => new Date(data.date)
// @ts-ignore TYPE NEEDS FIXING
export const getY = (data) => data.value

interface Dimensions {
  width: number
  height: number
}

const brushMargin = { top: 10, bottom: 15, left: 50, right: 50 }
const chartSeparation = 30
const PATTERN_ID = 'brush_pattern'

const accentColor = '#6c5efb'

const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: 'currentColor',
}

const axisColor = 'rgba(191, 191, 191, 0.4)'

const axisBottomTickLabelProps = {
  textAnchor: 'middle' as 'middle',
  fontFamily: 'Helvetica',
  fontSize: 10,
  fill: axisColor,
}
const axisLeftTickLabelProps = {
  dx: '-0.25em',
  dy: '0.25em',
  fontFamily: 'Helvetica',
  fontSize: 10,
  textAnchor: 'end' as 'end',
  fill: axisColor,
}

const purple1 = '#A755DD'
const purple2 = '#F338C3'
const purple3 = '#0993EC'

const Curves = ({
  width,
  height,
  margin = { top: 96, right: 48, bottom: 16, left: 64 },
  data,
  title = '',
  labels = undefined,
  timespans = [],
  defaultTimespan = undefined,
  colors = [purple1, purple2, purple3],
}: Dimensions & TimespanGraphProps) => {
  const [timespan, setTimespan] = useState(timespans?.find((t) => t.text === defaultTimespan))
  const brushRef = useRef<BaseBrush | null>(null)

  // @ts-ignore TYPE NEEDS FIXING
  const allData = data.reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])

  const [filteredData, setFilteredData] = useState(
    // @ts-ignore TYPE NEEDS FIXING
    data.map((curve) => curve.slice(curve.length - 30, curve.length - 1))
  )

  // @ts-ignore TYPE NEEDS FIXING
  const onBrushChange = (domain) => {
    if (!domain) return
    const { x0, x1, y0, y1 } = domain
    // @ts-ignore TYPE NEEDS FIXING
    const stockCopy = data.map((d) =>
      // @ts-ignore TYPE NEEDS FIXING
      d.filter((s) => {
        const x = getX(s).getTime()
        const y = getY(s)
        return x > x0 && x < x1 && y > y0 && y < y1
      })
    )
    setFilteredData(stockCopy)
  }

  const innerHeight = height - margin.top - margin.bottom
  const topChartBottomMargin = chartSeparation + 10
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation

  const numTicksY = 7
  const numTicksX = width > 520 ? 10 : 5

  // Max
  const xMax = Math.max(width - margin.left - margin.right, 0)
  const yMax = Math.max(topChartHeight, 0)

  // scales
  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(
          // @ts-ignore TYPE NEEDS FIXING
          filteredData.reduce((previousValue, currentValue) => previousValue.concat(currentValue), []),
          getX
        ),
        nice: true,
      }),
    [xMax, filteredData]
  )

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [
          Math.min(
            ...filteredData
              // @ts-ignore TYPE NEEDS FIXING
              .reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
              // @ts-ignore TYPE NEEDS FIXING
              .map((d) => getY(d))
          ),
          Math.max(
            ...filteredData
              // @ts-ignore TYPE NEEDS FIXING
              .reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
              // @ts-ignore TYPE NEEDS FIXING
              .map((d) => getY(d))
          ),
        ],
        nice: true,
      }),
    [yMax, filteredData]
  )

  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0)
  const yBrushMax = Math.max(bottomChartHeight - brushMargin.top - brushMargin.bottom, 0)

  const brushXScale = useMemo(
    () =>
      scaleTime({
        range: [0, xBrushMax],
        domain: extent(allData, getX),
      }),
    [xBrushMax, allData]
  )
  const brushYScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        // @ts-ignore TYPE NEEDS FIXING
        domain: [Math.min(...allData.map((d) => getY(d))), Math.max(...allData.map((d) => getY(d)))],
        nice: true,
      }),
    [yBrushMax, allData]
  )

  const initialBrushPosition = useMemo(() => {
    return {
      start: {
        x: brushXScale(getX(data[0][data[0].length >= 60 ? data[0].length - 60 : 0])),
      },
      end: { x: brushXScale(getX(data[0][data[0].length - 1])) },
    }
  }, [brushXScale, data])

  const onTimespanChange = (t: any) => {
    if (brushRef?.current) {
      const updater: UpdateBrush = (prevBrush) => {
        const lastDate = data[0][data[0].length - 1].date
        // @ts-ignore TYPE NEEDS FIXING
        const firstDate = data[0].find((data) => data.date >= lastDate - t.length * 1000)

        const newExtent = brushRef.current!.getExtent(
          { x: brushXScale(getX(firstDate)), y: (initialBrushPosition.start as any).y },
          initialBrushPosition.end
        )

        const newState: BaseBrushState = {
          ...prevBrush,
          start: { y: newExtent.y0, x: newExtent.x0 },
          end: { y: newExtent.y1, x: newExtent.x1 },
          extent: newExtent,
        }

        return newState
      }

      brushRef.current.updateBrush(updater)
    }
  }

  useEffect(
    () => onTimespanChange(timespans?.find((t) => t.text === defaultTimespan)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (width < 10) {
    return null
  }

  return (
    <div className="relative h-full" style={{ width }}>
      <div className="absolute w-full p-6">
        <div className="flex flex-row items-center space-x-4">
          <div className="text-2xl font-bold text-high-emphesis whitespace-nowrap">{title}</div>
          <div className="flex flex-row space-x-2">
            {labels?.map((label, i) => (
              <div
                key={label}
                className="flex flex-row items-center px-2 py-1 text-xs bg-opacity-30 rounded-xl whitespace-nowrap"
                style={{ color: colors[i], backgroundColor: `${colors[i]}25` }}
              >
                <div className="h-[6px] w-[6px] rounded-full mr-1" style={{ backgroundColor: colors[i] }} /> {label}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          {timespans?.map((t) => (
            <button
              key={t.text}
              className={classNames(
                t === timespan
                  ? 'text-blue bg-blue bg-opacity-30 rounded-xl font-bold border border-blue border-opacity-50'
                  : 'text-secondary',
                'text-sm px-3 py-0.5'
              )}
              onClick={() => {
                setTimespan(t)
                onTimespanChange(t)
              }}
            >
              {t.text}
            </button>
          ))}
        </div>
      </div>

      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="transparent" />
        <GridRows
          top={margin.top}
          left={margin.left}
          scale={yScale}
          width={xMax}
          height={yMax}
          numTicks={numTicksY}
          stroke={axisColor}
          strokeOpacity={0.4}
        />
        <GridColumns
          top={margin.top}
          left={margin.left}
          scale={xScale}
          height={yMax}
          numTicks={numTicksX}
          stroke={axisColor}
          strokeOpacity={0.4}
        />
        <Group top={margin.top} left={margin.left}>
          {width > 8 &&
            // @ts-ignore TYPE NEEDS FIXING
            filteredData.map((curve, i) => (
              <LinePath
                key={`chart-${i}-${timespan?.text}`}
                data={curve}
                x={(d) => xScale(getX(d)) ?? 0}
                y={(d) => yScale(getY(d)) ?? 0}
                stroke={colors[i]}
                strokeWidth={2}
                strokeOpacity={1}
              />
            ))}
          <AxisBottom
            top={yMax}
            scale={xScale}
            stroke={axisColor}
            strokeWidth={0.4}
            tickLabelProps={() => axisBottomTickLabelProps}
          />
          <AxisLeft
            scale={yScale}
            numTicks={numTicksY}
            tickFormat={millify as any}
            stroke={axisColor}
            strokeWidth={0.4}
            tickLabelProps={() => axisLeftTickLabelProps}
          />
        </Group>

        <Group top={topChartHeight + topChartBottomMargin + margin.top} left={brushMargin.left}>
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          {data.map((brushData, i) => {
            return (
              <LinePath
                stroke={colors[i]}
                strokeWidth={2}
                strokeOpacity={1}
                data={brushData}
                width={width}
                x={(d) => brushXScale(getX(d)) ?? 0}
                y={(d) => brushYScale(getY(d)) ?? 0}
                key={i}
              />
            )
          })}
          <PatternLines
            id={PATTERN_ID}
            height={8}
            width={8}
            stroke={accentColor}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <Brush
            innerRef={brushRef}
            xScale={brushXScale}
            yScale={brushYScale}
            width={xBrushMax}
            height={yBrushMax}
            margin={brushMargin}
            handleSize={8}
            resizeTriggerAreas={['left', 'right']}
            brushDirection="horizontal"
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={() => setFilteredData(data)}
            selectedBoxStyle={selectedBrushStyle}
          />
        </Group>
      </svg>
    </div>
  )
}
export default Curves
