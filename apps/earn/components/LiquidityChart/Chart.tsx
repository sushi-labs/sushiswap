import * as d3 from 'd3'
import { FC, useMemo, useRef } from 'react'

import { Area } from './Area'
import { Brush } from './Brush'
import { useIsChanging } from './hooks/useIsChanging'
import { useZoom } from './hooks/useZoom'
import { MidLine } from './MidLine'
import { clipData, stackDataList } from './utils/processData'
import { Datum, HandleType, SizeInfo, ZoomLevel } from './utils/types'
import { XAxis } from './XAxis'

interface ChartProps {
  size: SizeInfo
  zoomLevel: ZoomLevel
  dataList: Datum[][]
  midPoint: number
  hideData: Record<number, boolean>
  snappedSelectedRange: [number, number] | null
  handleSelectedRangeChange: (range: [number, number] | null, lastMovingHandle: HandleType | undefined) => void
  getNewRangeWhenBrushing: (range: [number, number], movingHandle: HandleType | undefined) => [number, number] | undefined // prettier-ignore
  zoomInNonce: number | undefined
  zoomOutNonce: number | undefined
  zoomToFitSelectedRangeNonce: number | undefined
  getHandleLabelText: (range: [number, number] | null) => [string, string]
  areaColors: string[]
  brushHandleColors: { w: string; e: string }
}

export const Chart: FC<ChartProps> = ({
  size, //
  zoomLevel,
  dataList,
  midPoint,
  hideData,
  snappedSelectedRange,
  handleSelectedRangeChange,
  getNewRangeWhenBrushing,
  zoomInNonce,
  zoomOutNonce,
  zoomToFitSelectedRangeNonce,
  getHandleLabelText,
  areaColors,
  brushHandleColors,
}) => {
  const x = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([midPoint * zoomLevel.initialMin, midPoint * zoomLevel.initialMax])
      .range([size.margin.left, size.width - size.margin.right])
  }, [size, zoomLevel, midPoint]) // NOTE: midPoint can change initial xScale

  const y = useMemo(() => {
    /**
     * we use the initial domain * / 3 to determine the y-axis scale
     */
    const domain = [(midPoint * zoomLevel.initialMin) / 3, midPoint * zoomLevel.initialMax * 3] as [number, number]
    const stacked = stackDataList(dataList)
    const clipped = stacked.map((data) => clipData(data, domain))

    const maxYs = clipped.map((data) => d3.max(data, (d) => d.vy) ?? 0)
    const maxY = d3.max(maxYs) ?? 0

    return d3
      .scaleLinear()
      .domain([0, maxY])
      .range([size.height - size.margin.bottom, size.margin.top])
      .clamp(true)
  }, [size, zoomLevel, dataList, midPoint])

  const { xz, svgRef } = useZoom({
    size,
    zoomLevel,
    zoomInNonce,
    zoomOutNonce,
    zoomToFitSelectedRangeNonce,
    x,
    snappedSelectedRange,
  })

  /**
   * Prepare data
   */
  const allStackedDataList = useMemo(() => {
    const nonHidden = dataList.map((data, j) => (hideData[j] ? data.map((datum) => ({ ...datum, vy: 0 })) : data))
    return stackDataList(nonHidden)
  }, [dataList, hideData])

  const [xzDomain0, xzDomain1] = xz.domain()
  const stackedDataList = useMemo(
    () => allStackedDataList.map((data) => clipData(data, [xzDomain0, xzDomain1])),
    [allStackedDataList, xzDomain0, xzDomain1]
  )

  const isHideDataChanging = useIsChanging(hideData)

  // ----

  const width = size.width
  const height = size.height
  const margin = size.margin
  const idRef = useRef(`${Date.now() * 10000 + Math.floor(Math.random() * 10000)}`)

  return (
    <svg className="cursor-grab active:cursor-grabbing" width="100%" viewBox={`0,0,${width},${height}`} ref={svgRef}>
      <defs>
        <clipPath id={`chart-clip-${idRef.current}`}>
          <rect
            x={margin.left}
            y={margin.top}
            width={width - margin.left - margin.right}
            height={height - margin.top - margin.bottom}
          />
        </clipPath>
      </defs>

      {/* y-axis (Current not showing) */}
      {/* <g transform={`translate(${margin.left},0)`}>
        <YAxis y={y} />
      </g> */}

      {/* x-axis */}
      <g transform={`translate(0,${height - margin.bottom})`}>
        <XAxis x={xz} />
      </g>

      {/* curves */}
      <g clipPath={`url(#chart-clip-${idRef.current})`}>
        {[...stackedDataList].reverse().map((data, i, arr) => (
          <Area
            key={arr.length - i - 1}
            x={xz}
            y={y}
            data={data}
            color={areaColors[(arr.length - i - 1) % areaColors.length]}
            animate={isHideDataChanging}
          />
        ))}
      </g>

      {/* mid-line */}
      <g clipPath={`url(#chart-clip-${idRef.current})`}>
        <MidLine size={size} midPoint={midPoint} x={xz} />
      </g>

      {/* brush */}
      <g clipPath={`url(#chart-clip-${idRef.current})`}>
        <Brush
          size={size}
          x={xz}
          snappedSelectedRange={snappedSelectedRange}
          handleSelectedRangeChange={handleSelectedRangeChange}
          getNewRangeWhenBrushing={getNewRangeWhenBrushing}
          handleColors={brushHandleColors}
          getHandleLabelText={getHandleLabelText}
        />
      </g>
    </svg>
  )
}
