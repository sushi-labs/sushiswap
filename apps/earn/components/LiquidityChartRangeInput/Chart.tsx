import { max, scaleLinear, ZoomTransform } from 'd3'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'

import { Bound } from '../../lib/constants'
import { Area } from './Area'
import { AxisBottom } from './AxisBottom'
import { Brush } from './Brush'
import { Line } from './Line'
import { ChartEntry, LiquidityChartRangeInputProps } from './types'
import { Zoom } from './Zoom'

const xAccessor = (d: ChartEntry) => d.price0
const yAccessor = (d: ChartEntry) => d.activeLiquidity

export const Chart: FC<LiquidityChartRangeInputProps> = ({
  id = 'liquidityChartRangeInput',
  data: { series, current },
  ticksAtLimit,
  styles,
  dimensions: { width, height },
  margins,
  interactive = true,
  brush,
  zoomLevels,
}) => {
  const zoomRef = useRef<SVGRectElement | null>(null)

  const [zoom, setZoom] = useState<ZoomTransform | null>(null)

  const [innerHeight, innerWidth] = useMemo(
    () => [height - margins.top - margins.bottom, width - margins.left - margins.right],
    [width, height, margins]
  )

  const { xScale, yScale } = useMemo(() => {
    const scales = {
      xScale: scaleLinear()
        .domain([current * zoomLevels.initialMin, current * zoomLevels.initialMax] as number[])
        .range([0, innerWidth]),
      yScale: scaleLinear()
        .domain([0, max(series, yAccessor)] as number[])
        .range([innerHeight, 0]),
    }

    if (zoom) {
      const newXscale = zoom.rescaleX(scales.xScale)
      scales.xScale.domain(newXscale.domain())
    }

    return scales
  }, [current, zoomLevels.initialMin, zoomLevels.initialMax, innerWidth, series, innerHeight, zoom])

  useEffect(() => {
    // reset zoom as necessary
    setZoom(null)
  }, [zoomLevels])

  useEffect(() => {
    if (brush && !brush.brushDomain) {
      brush.onBrushDomainChange(xScale.domain() as [number, number], undefined)
    }
  }, [brush, xScale])

  return (
    <div className="relative flex flex-col">
      <Zoom
        svg={zoomRef.current}
        xScale={xScale}
        setZoom={setZoom}
        width={innerWidth}
        height={
          // allow zooming inside the x-axis
          height
        }
        resetBrush={() => {
          if (!brush) return

          brush.onBrushDomainChange(
            [current * zoomLevels.initialMin, current * zoomLevels.initialMax] as [number, number],
            'reset'
          )
        }}
        showResetButton={Boolean(ticksAtLimit[Bound.LOWER] || ticksAtLimit[Bound.UPPER])}
        zoomLevels={zoomLevels}
      />
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          <clipPath id={`${id}-chart-clip`}>
            <rect x="0" y="0" width={innerWidth} height={height} />
          </clipPath>

          {brush?.brushDomain && (
            // mask to highlight selected area
            <mask id={`${id}-chart-area-mask`}>
              <rect
                fill="white"
                x={xScale(brush.brushDomain[0])}
                y="0"
                width={xScale(brush.brushDomain[1]) - xScale(brush.brushDomain[0])}
                height={innerHeight}
              />
            </mask>
          )}
        </defs>

        <g transform={`translate(${margins.left},${margins.top})`}>
          <g clipPath={`url(#${id}-chart-clip)`}>
            <Area
              series={series}
              xScale={xScale}
              yScale={yScale}
              xValue={xAccessor}
              yValue={yAccessor}
              fill={styles.area.selection}
              opacity={styles.area.opacity}
            />

            {brush?.brushDomain && (
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
            )}

            <Line value={current} xScale={xScale} innerHeight={innerHeight} />

            <line
              opacity={0.7}
              strokeWidth={1}
              stroke="currentColor"
              fill="none"
              className="text-gray-900 dark:text-slate-500"
              x1={0}
              y1={innerHeight}
              x2={innerWidth}
              y2={innerHeight}
            />

            <AxisBottom xScale={xScale} innerHeight={innerHeight} />
          </g>

          <rect
            fill="transparent"
            className="cursor-grab active:cursor-grabbing"
            width={innerWidth}
            height={height}
            ref={zoomRef}
          />

          {brush && (
            <Brush
              id={id}
              xScale={xScale}
              interactive={interactive}
              brushLabelValue={brush.brushLabels}
              brushExtent={brush.brushDomain ?? (xScale.domain() as [number, number])}
              innerWidth={innerWidth}
              innerHeight={innerHeight}
              setBrushExtent={brush.onBrushDomainChange}
              westHandleColor={brush.style.handle.west}
              eastHandleColor={brush.style.handle.east}
            />
          )}
        </g>
      </svg>
    </div>
  )
}
