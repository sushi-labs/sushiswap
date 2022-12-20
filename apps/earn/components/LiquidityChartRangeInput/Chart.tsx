import { max, scaleLinear, stack, sum, ZoomTransform } from 'd3'
import { FC, useEffect, useMemo, useRef, useState } from 'react'

import { Bound } from '../../lib/constants'
import { Area } from './Area'
import { AxisBottom } from './AxisBottom'
import { Brush } from './Brush'
import { Line } from './Line'
import { ChartEntry, LiquidityChartRangeInputProps } from './types'
import Zoom, { ZoomRef } from './Zoom'

export const getYDomainAccessor = (hiddenKeyIndexes: number[]) => (d: ChartEntry) =>
  sum(
    Object.entries(d.activeLiquidity)
      .filter(([idx]) => !hiddenKeyIndexes.includes(+idx))
      .map(([, val]) => val)
  )

export const Chart: FC<LiquidityChartRangeInputProps> = ({
  id = 'liquidityChartRangeInput',
  data: { series, current },
  keys,
  hiddenKeyIndexes,
  selectedKeyIndex,
  ticksAtLimit,
  styles,
  dimensions: { width, height },
  margins,
  interactive = true,
  brushDomain,
  brushLabels,
  onBrushDomainChange,
  zoomLevels,
}) => {
  const zoomTargetSvgRef = useRef<SVGRectElement | null>(null)

  const [zoom, setZoom] = useState<ZoomTransform | null>(null)

  const [innerHeight, innerWidth] = useMemo(
    () => [height - margins.top - margins.bottom, width - margins.left - margins.right],
    [width, height, margins]
  )

  const xScale = useMemo(() => {
    const scale = scaleLinear()
      .domain([current * zoomLevels.initialMin, current * zoomLevels.initialMax] as number[])
      .range([0, innerWidth])
    if (zoom) {
      const newXscale = zoom.rescaleX(scale)
      scale.domain(newXscale.domain())
    }
    return scale
  }, [current, innerWidth, zoom, zoomLevels.initialMax, zoomLevels.initialMin])

  const yScale = useMemo(() => {
    const yDomainAccessor = getYDomainAccessor(hiddenKeyIndexes)
    return scaleLinear()
      .domain([0, (max(series, yDomainAccessor) || 1) * 1.1] as number[])
      .range([innerHeight, 0])
  }, [hiddenKeyIndexes, series, innerHeight])

  const stackedData = useMemo(
    () =>
      stack().keys(keys)(
        series.map((s) => {
          return keys.reduce(
            (acc, val, index) => {
              acc[val] = hiddenKeyIndexes.includes(index) ? 0 : s.activeLiquidity[index] || 0
              return acc
            },
            { price0: s.price0 } as Record<string, number>
          )
        })
      ),
    [keys, hiddenKeyIndexes, series]
  )

  const selectionColors = useMemo(
    () => styles.area.colors.map((color, index) => (selectedKeyIndex === index ? color : color)),
    [selectedKeyIndex, styles.area.colors]
  )

  useEffect(() => {
    // reset zoom as necessary
    setZoom(null)
  }, [zoomLevels])

  const zoomRef = useRef<ZoomRef>()

  useEffect(() => {
    if (!brushDomain) {
      onBrushDomainChange([current * zoomLevels.initialMin, current * zoomLevels.initialMax], undefined)
      zoomRef.current?.zoomReset()
    }
  }, [current, brushDomain, onBrushDomainChange, zoomLevels])

  return (
    <>
      <Zoom
        ref={zoomRef}
        svg={zoomTargetSvgRef.current}
        xScale={xScale}
        setZoom={setZoom}
        width={innerWidth}
        height={
          // allow zooming inside the x-axis
          height
        }
        resetBrush={() => {
          onBrushDomainChange(
            [current * zoomLevels.initialMin, current * zoomLevels.initialMax] as [number, number],
            'reset'
          )
        }}
        showResetButton={Boolean(ticksAtLimit[Bound.LOWER] || ticksAtLimit[Bound.UPPER])}
        zoomLevels={zoomLevels}
        brushDomain={brushDomain}
        currentPrice={current}
      />
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          <clipPath id={`${id}-chart-clip`}>
            <rect x="0" y="0" width={innerWidth} height={height} />
          </clipPath>

          {brushDomain && (
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
          )}
        </defs>

        <g transform={`translate(${margins.left},${margins.top})`}>
          <g clipPath={`url(#${id}-chart-clip)`}>
            <Area
              stackedData={stackedData}
              selectedKeyIndex={selectedKeyIndex}
              hiddenKeyIndexes={hiddenKeyIndexes}
              xScale={xScale}
              yScale={yScale}
              colors={styles.area.colors}
            />

            {brushDomain && (
              // duplicate area chart with mask for selected area
              <g mask={`url(#${id}-chart-area-mask)`}>
                <Area
                  stackedData={stackedData}
                  selectedKeyIndex={selectedKeyIndex}
                  hiddenKeyIndexes={hiddenKeyIndexes}
                  xScale={xScale}
                  yScale={yScale}
                  colors={selectionColors}
                />
              </g>
            )}

            <Line value={current} xScale={xScale} innerHeight={innerHeight} />

            <AxisBottom xScale={xScale} innerHeight={innerHeight} />
          </g>

          <rect
            fill="transparent"
            cursor="grab"
            className="active:cursor-grabbing"
            width={innerWidth}
            height={height}
            ref={zoomTargetSvgRef}
          />

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
          />
        </g>
      </svg>
    </>
  )
}
