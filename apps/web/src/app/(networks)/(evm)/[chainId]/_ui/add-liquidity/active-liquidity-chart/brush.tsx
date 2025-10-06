import { usePrevious } from '@sushiswap/hooks'
import {
  type BrushBehavior,
  type D3BrushEvent,
  type ScaleLinear,
  brushY,
  select,
} from 'd3'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useRef, useState } from 'react'
import { OffScreenHandle, brushHandleAccentPath, brushHandlePath } from './svg'

const FLIP_HANDLE_THRESHOLD_PX = 20

const BRUSH_EXTENT_MARGIN_PX = 2

const compare = (
  a: [number, number],
  b: [number, number],
  yScale: ScaleLinear<number, number>,
): boolean => {
  const aNorm = a.map((y) => yScale(y).toFixed(1))
  const bNorm = b.map((y) => yScale(y).toFixed(1))
  return aNorm.every((v, i) => v === bNorm[i])
}

const toYScale = (
  extent: [number, number],
  yScale: ScaleLinear<number, number>,
): [number, number] => {
  return [yScale(extent[1]), yScale(extent[0])]
}

const toPriceExtent = (
  selection: [number, number],
  yScale: ScaleLinear<number, number>,
): [number, number] => {
  return [yScale.invert(selection[1]), yScale.invert(selection[0])]
}

const normalizeExtent = (extent: [number, number]): [number, number] =>
  extent[0] < extent[1] ? extent : [extent[1], extent[0]]

export const Brush = ({
  id,
  yScale,
  interactive,
  brushExtent,
  setBrushExtent,
  hideHandles,
  width,
  height,
}: {
  id: string
  yScale: ScaleLinear<number, number>
  interactive: boolean
  brushExtent: [number, number]
  setBrushExtent: (extent: [number, number], mode: string | undefined) => void
  width: number
  height: number
  hideHandles?: boolean
}) => {
  const brushRef = useRef<SVGGElement | null>(null)
  const brushBehavior = useRef<BrushBehavior<SVGGElement> | null>(null)

  const [localBrushExtent, setLocalBrushExtent] = useState<
    [number, number] | null
  >(brushExtent)

  const previousBrushExtent = usePrevious(brushExtent)

  const [brushInProgress, setBrushInProgress] = useState(false)
  useEffect(() => {
    if (brushInProgress) {
      return
    }
    setLocalBrushExtent(brushExtent)
  }, [brushExtent, brushInProgress])

  useEffect(() => {
    if (!brushRef.current || brushInProgress) {
      return
    }

    const normalizedExtent = normalizeExtent(brushExtent)
    const scaledExtent = toYScale(normalizedExtent, yScale)

    brushBehavior.current = brushY<SVGGElement>()
      .extent([
        [0, BRUSH_EXTENT_MARGIN_PX],
        [width, height - BRUSH_EXTENT_MARGIN_PX],
      ])
      .handleSize(30)
      .filter(() => interactive)
      .filter((event) => {
        const target = event.target as SVGElement
        return (
          target.classList.contains('selection') ||
          target.classList.contains('handle')
        )
      })
      .on('brush', (event: D3BrushEvent<unknown>) => {
        const { selection } = event
        setBrushInProgress(true)

        if (!selection) {
          setLocalBrushExtent(null)
          return
        }

        const priceExtent = normalizeExtent(
          toPriceExtent(selection as [number, number], yScale),
        )
        setLocalBrushExtent(priceExtent)
      })
      .on('end', (event: D3BrushEvent<unknown>) => {
        const { selection, mode } = event

        if (!selection) {
          setLocalBrushExtent(null)
          return
        }

        const priceExtent = normalizeExtent(
          toPriceExtent(selection as [number, number], yScale),
        )
        if (!compare(normalizedExtent, priceExtent, yScale)) {
          setBrushExtent(priceExtent, mode)
        }
        setLocalBrushExtent(priceExtent)
        setBrushInProgress(false)
      })

    brushBehavior.current(select(brushRef.current))

    if (
      previousBrushExtent &&
      compare(normalizedExtent, normalizeExtent(previousBrushExtent), yScale)
    ) {
      select(brushRef.current)
        .transition()
        .call(brushBehavior.current.move as any, scaledExtent)
    }

    select(brushRef.current).selectAll('.overlay').attr('cursor', 'default')

    select(brushRef.current)
      .selectAll('.selection')
      .attr('stroke', 'none')
      .attr('fill-opacity', '0.1')
      .attr('fill', `url(#${id}-gradient-selection)`)
      .attr('cursor', 'grab')
  }, [
    brushExtent,
    id,
    height,
    interactive,
    previousBrushExtent,
    yScale,
    width,
    setBrushExtent,
    brushInProgress,
  ])

  useEffect(() => {
    if (!brushRef.current || !brushBehavior.current) {
      return
    }

    brushBehavior.current.move(
      select(brushRef.current) as any,
      normalizeExtent(toYScale(brushExtent as [number, number], yScale)),
    )
  }, [brushExtent, yScale])

  const normalizedBrushExtent = normalizeExtent(localBrushExtent ?? brushExtent)
  const flipNorthHandle =
    yScale(normalizedBrushExtent[1]) < FLIP_HANDLE_THRESHOLD_PX
  const flipSouthHandle =
    yScale(normalizedBrushExtent[0]) > height - FLIP_HANDLE_THRESHOLD_PX

  const southHandleInView =
    yScale(normalizedBrushExtent[0]) >= 0 &&
    yScale(normalizedBrushExtent[0]) <= height
  const northHandleInView =
    yScale(normalizedBrushExtent[1]) >= 0 &&
    yScale(normalizedBrushExtent[1]) <= height
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const color = isDarkMode ? '#3DB1FF' : '#4217FF'

  return useMemo(
    () => (
      <>
        <defs>
          <linearGradient
            id={`${id}-gradient-selection`}
            x1="0%"
            y1="100%"
            x2="100%"
            y2="100%"
          >
            <stop stopColor={color} />
            <stop stopColor={color} offset="1" />
          </linearGradient>

          {/* clips at exactly the svg area */}
          <clipPath id={`${id}-brush-clip`}>
            <rect x={0} y="0" width={width} height={height} />
          </clipPath>
        </defs>

        {/* will host the d3 brush */}
        <g ref={brushRef} clipPath={`url(#${id}-brush-clip)`} />

        {/* custom brush handles */}
        {!hideHandles && (
          <>
            {northHandleInView ? (
              <g
                transform={`translate(0, ${Math.max(0, yScale(normalizedBrushExtent[1]))}), scale(1, ${
                  flipNorthHandle ? '1' : '-1'
                })`}
                cursor={interactive ? 'ns-resize' : 'default'}
                pointerEvents="none"
              >
                <g>
                  <path
                    color={color}
                    stroke={color}
                    opacity={0.6}
                    d={brushHandlePath(width)}
                  />
                  <path
                    color={color}
                    stroke={color}
                    strokeWidth={4}
                    strokeLinecap="round"
                    d={brushHandleAccentPath(width)}
                  />
                </g>
              </g>
            ) : null}

            {southHandleInView ? (
              <g
                transform={`translate(0, ${yScale(normalizedBrushExtent[0])}), scale(1, ${
                  flipSouthHandle ? '-1' : '1'
                })`}
                cursor={interactive ? 'ns-resize' : 'default'}
                pointerEvents="none"
              >
                <g>
                  <path
                    color={color}
                    stroke={color}
                    opacity={0.6}
                    d={brushHandlePath(width)}
                  />
                  <path
                    color={color}
                    stroke={color}
                    strokeWidth={4}
                    strokeLinecap="round"
                    d={brushHandleAccentPath(width)}
                  />
                </g>
              </g>
            ) : null}

            {/* {showNorthArrow && (
							<g transform="translate(18, 16) scale(1,-1)">
								<OffScreenHandle color={color} />
								<text
									x={14}
									y={-3}
									fill={color}
									fontSize={10}
									alignmentBaseline="middle"
									transform="scale(1,-1)">
									Range out of view
								</text>
							</g>
						)}
						{showSouthArrow && (
							<g transform={`translate(18, ${height - 16}) `}>
								<OffScreenHandle color={color} />
								{!showNorthArrow && (
									<text x={14} y={5} fill={color} fontSize={10} alignmentBaseline="middle">
										Range out of view
									</text>
								)}
							</g>
						)} */}
          </>
        )}
      </>
    ),
    [
      id,
      width,
      height,
      normalizedBrushExtent,
      hideHandles,
      northHandleInView,
      yScale,
      flipNorthHandle,
      interactive,
      southHandleInView,
      flipSouthHandle,
      color,
    ],
  )
}
