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
  const brushExtentRef = useRef(brushExtent)
  const brushInProgressRef = useRef(false)

  const [localBrushExtent, setLocalBrushExtent] = useState<
    [number, number] | null
  >(brushExtent)
  const [brushInProgress, setBrushInProgress] = useState(false)

  const previousBrushExtent = usePrevious(brushExtent)

  useEffect(() => {
    if (brushInProgress) {
      return
    }
    setLocalBrushExtent(brushExtent)
  }, [brushExtent, brushInProgress])

  useEffect(() => {
    brushInProgressRef.current = brushInProgress
  }, [brushInProgress])

  useEffect(() => {
    if (!brushRef.current || brushInProgressRef.current) return

    const normalizedExtent = normalizeExtent(brushExtent)
    const scaledExtent = toYScale(normalizedExtent, yScale)

    // Create once if not already
    if (!brushBehavior.current) {
      brushBehavior.current = brushY<SVGGElement>()
        .handleSize(30)
        .on('brush', (event: D3BrushEvent<unknown>) => {
          // Ignore programmatic moves (transitions/initialization)
          if (!event.sourceEvent) return

          const { selection } = event
          // Only set when user actually brushes
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

          // For programmatic moves, skip mutating React state
          const userEvent = !!event.sourceEvent

          if (!selection) {
            if (userEvent) setLocalBrushExtent(null)
            if (userEvent) setBrushInProgress(false)
            return
          }

          const priceExtent = normalizeExtent(
            toPriceExtent(selection as [number, number], yScale),
          )

          // Only update external state when it actually changed AND was user-initiated
          if (userEvent && !compare(normalizedExtent, priceExtent, yScale)) {
            setBrushExtent(priceExtent, mode)
          }

          if (userEvent) {
            setLocalBrushExtent(priceExtent)
            setBrushInProgress(false)
          }
        })

      // Attach once
      brushBehavior.current(select(brushRef.current))
    }

    // Always update extent + filter on changes
    brushBehavior.current
      .extent([
        [0, BRUSH_EXTENT_MARGIN_PX],
        [width, height - BRUSH_EXTENT_MARGIN_PX],
      ])
      .filter((evt) => {
        // interactive can flip; this closure sees fresh value
        if (!interactive) return false
        const t = (evt.target as SVGElement) || null
        return (
          !!t &&
          (t.classList.contains('selection') || t.classList.contains('handle'))
        )
      })

    // Sync selection from props (programmatic move) without triggering state
    if (
      previousBrushExtent &&
      compare(normalizedExtent, normalizeExtent(previousBrushExtent), yScale)
    ) {
      select(brushRef.current)
        .transition()
        .call(brushBehavior.current.move as any, scaledExtent)
    }

    // Styling tweaks (safe)
    const g = select(brushRef.current)
    g.selectAll('.overlay').attr('cursor', 'default')
    g.selectAll('.selection')
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
  ])

  useEffect(() => {
    if (!brushRef.current || !brushBehavior.current) {
      return
    }
    if (compare(brushExtentRef.current, brushExtent, yScale)) {
      return
    }
    brushExtentRef.current = brushExtent
    brushBehavior.current.move(
      select(brushRef.current) as any,
      normalizeExtent(toYScale(brushExtent as [number, number], yScale)),
    )
  }, [brushExtent, yScale])

  const normalizedBrushExtent = useMemo(
    () => normalizeExtent(localBrushExtent ?? brushExtent),
    [localBrushExtent, brushExtent],
  )
  const flipNorthHandle = useMemo(
    () => yScale(normalizedBrushExtent[1]) < FLIP_HANDLE_THRESHOLD_PX,
    [normalizedBrushExtent, yScale],
  )
  const flipSouthHandle = useMemo(
    () => yScale(normalizedBrushExtent[0]) > height - FLIP_HANDLE_THRESHOLD_PX,
    [normalizedBrushExtent, yScale, height],
  )

  const southHandleInView = useMemo(
    () =>
      yScale(normalizedBrushExtent[0]) >= 0 &&
      yScale(normalizedBrushExtent[0]) <= height,
    [yScale, normalizedBrushExtent, height],
  )
  const northHandleInView = useMemo(
    () =>
      yScale(normalizedBrushExtent[1]) >= 0 &&
      yScale(normalizedBrushExtent[1]) <= height,
    [yScale, normalizedBrushExtent, height],
  )
  const { theme } = useTheme()

  const color = useMemo(
    () => (theme === 'dark' ? '#3DB1FF' : '#4217FF'),
    [theme],
  )

  return useMemo(
    () => (
      <>
        <defs>
          <linearGradient
            id={`${id}-gradient-selection`}
            x1="0%"
            y1="0%"
            x2="0%"
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
