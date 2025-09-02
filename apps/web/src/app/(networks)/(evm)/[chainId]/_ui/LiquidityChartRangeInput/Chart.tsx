import { type ZoomTransform, max, scaleLinear } from 'd3'
import React, { type FC, useEffect, useMemo, useRef, useState } from 'react'

import { Area } from './Area'
import { AxisBottom } from './AxisBottom'
import { Brush } from './Brush'
import { Line } from './Line'
import { Zoom } from './Zoom'
import type { ChartEntry, LiquidityChartRangeInputProps } from './types'

const xAccessor = (d: ChartEntry) => d.price0
const yAccessor = (d: ChartEntry) => d.activeLiquidity

export const Chart: FC<LiquidityChartRangeInputProps> = ({
  id = 'liquidityChartRangeInput',
  data: { series, current },
  priceRange,
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
  const zoomRef = useRef<SVGRectElement | null>(null)

  const [zoom, setZoom] = useState<ZoomTransform | null>(null)

  const [innerHeight, innerWidth] = useMemo(
    () => [
      height - margins.top - margins.bottom,
      width - margins.left - margins.right,
    ],
    [width, height, margins],
  )

  const { xScale, yScale } = useMemo(() => {
    const scales = {
      xScale: scaleLinear()
        .domain([
          current * zoomLevels.initialMin,
          current * zoomLevels.initialMax,
        ] as number[])
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
  }, [
    current,
    zoomLevels.initialMin,
    zoomLevels.initialMax,
    innerWidth,
    series,
    innerHeight,
    zoom,
  ])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // reset zoom as necessary
    setZoom(null)
  }, [zoomLevels])

  useEffect(() => {
    if (!brushDomain) {
      onBrushDomainChange(xScale.domain() as [number, number], undefined)
    }
  }, [brushDomain, onBrushDomainChange, xScale])

  return (
    <div className="relative flex flex-col">
      <div className="flex flex-row-reverse justify-between">
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
            onBrushDomainChange(
              [
                current * zoomLevels.initialMin,
                current * zoomLevels.initialMax,
              ] as [number, number],
              'reset',
            )
          }}
          showResetButton={priceRange !== undefined}
          zoomLevels={zoomLevels}
        />
        {tokenToggle}
      </div>
      <svg
        width="100%"
        height="100%"
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
              fill={styles.area.selection}
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
            ref={zoomRef}
          />

          {!hideBrushes ? (
            <Brush
              id={id}
              xScale={xScale}
              interactive={interactive}
              brushLabelValue={brushLabels}
              brushExtent={brushDomain ?? (xScale.domain() as [number, number])}
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
