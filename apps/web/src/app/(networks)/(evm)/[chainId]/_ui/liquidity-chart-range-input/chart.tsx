import { type ZoomTransform, max, scaleLinear } from 'd3'
import React, { type FC, useEffect, useMemo, useState } from 'react'

import { Area } from './area'
import { AxisBottom } from './axis-bottom'
import { Brush } from './brush'
import { Line } from './line'
import type { ChartEntry, LiquidityChartRangeInputProps } from './types'
import { Zoom } from './zoom'

const xAccessor = (d: ChartEntry) => d.price0
const yAccessor = (d: ChartEntry) => d.activeLiquidity

export const Chart: FC<LiquidityChartRangeInputProps> = ({
  id = 'liquidityChartRangeInput',
  data: { series, current },
  isPriceRangeSet,
  styles,
  dimensions: { width, height },
  margins,
  interactive = true,
  brushDomain,
  brushLabels,
  onBrushDomainChange,
  getNewRangeWhenBrushing,
  zoomLevels,
  hideBrushes,
  tokenToggle,
}) => {
  const [zoomTarget, setZoomTarget] = useState<SVGRectElement | null>(null)

  const [zoom, setZoom] = useState<ZoomTransform | null>(null)

  const [innerHeight, innerWidth] = useMemo(
    () => [
      height - margins.top - margins.bottom,
      width - margins.left - margins.right,
    ],
    [width, height, margins],
  )

  const defaultRange = useMemo<[number, number]>(
    () => [current * zoomLevels.initialMin, current * zoomLevels.initialMax],
    [current, zoomLevels.initialMin, zoomLevels.initialMax],
  )

  const { xScale, yScale, minZoomX } = useMemo(() => {
    const halfSpan = (defaultRange[1] - defaultRange[0]) / 2
    const baseXScale = scaleLinear()
      .domain([current - halfSpan, current + halfSpan])
      .range([0, innerWidth])

    const xScale = zoom ? zoom.rescaleX(baseXScale) : baseXScale

    // Use global max for y-scale (not just visible data)
    // This keeps the scale consistent and avoids disorientation when panning
    const yScale = scaleLinear()
      .domain([0, max(series, yAccessor)] as number[])
      .range([innerHeight, 0])

    return { xScale, yScale, minZoomX: baseXScale(0) }
  }, [current, defaultRange, innerWidth, series, innerHeight, zoom])

  useEffect(() => {
    if (!brushDomain) {
      onBrushDomainChange(defaultRange, undefined)
    }
  }, [brushDomain, onBrushDomainChange, defaultRange])

  return (
    <div className="relative flex flex-col">
      <div className="flex flex-row-reverse justify-between">
        <Zoom
          svg={zoomTarget}
          minZoomX={minZoomX}
          setZoom={setZoom}
          width={innerWidth}
          height={
            // allow zooming inside the x-axis
            height
          }
          resetBrush={() => onBrushDomainChange(defaultRange, 'reset')}
          showResetButton={isPriceRangeSet}
          zoomLevels={zoomLevels}
        />
        {tokenToggle}
      </div>
      <svg
        width="100%"
        className="block h-auto"
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <clipPath id={`${id}-chart-clip`}>
            <rect x="0" y="0" width={innerWidth} height={height} />
          </clipPath>

          {brushDomain && !hideBrushes ? (
            // mask to highlight selected area
            <mask id={`${id}-chart-area-mask`}>
              <rect
                fill="white"
                x={xScale(brushDomain[0])}
                y="0"
                width={xScale(brushDomain[1]) - xScale(brushDomain[0])}
                height={innerHeight}
              />
            </mask>
          ) : null}
        </defs>

        <g transform={`translate(${margins.left},${margins.top})`}>
          <g clipPath={`url(#${id}-chart-clip)`}>
            <Area
              series={series}
              xScale={xScale}
              yScale={yScale}
              xValue={xAccessor}
              yValue={yAccessor}
              fill={styles.area.unselection}
              opacity={styles.area.opacity}
            />

            {brushDomain && !hideBrushes ? (
              // duplicate area chart with mask for selected area
              <g mask={`url(#${id}-chart-area-mask)`}>
                <Area
                  series={series}
                  xScale={xScale}
                  yScale={yScale}
                  xValue={xAccessor}
                  yValue={yAccessor}
                  fill={styles.area.selection}
                />
              </g>
            ) : null}

            <Line value={current} xScale={xScale} innerHeight={innerHeight} />

            <AxisBottom xScale={xScale} innerHeight={innerHeight} />
          </g>

          <rect
            fill="transparent"
            className="cursor-grab active:cursor-grabbing"
            width={innerWidth}
            height={height}
            ref={setZoomTarget}
          />

          {!hideBrushes ? (
            <Brush
              id={id}
              xScale={xScale}
              interactive={interactive}
              brushLabelValue={brushLabels}
              brushExtent={brushDomain ?? defaultRange}
              innerWidth={innerWidth}
              innerHeight={innerHeight}
              setBrushExtent={onBrushDomainChange}
              westHandleColor={styles.brush.handle.west}
              eastHandleColor={styles.brush.handle.east}
              getNewRangeWhenBrushing={getNewRangeWhenBrushing}
            />
          ) : null}
        </g>
      </svg>
    </div>
  )
}
