import * as d3 from 'd3'
import { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { HandleType, SizeInfo } from './utils/types'

const brushHandlePath = (height: number) =>
  [
    // handle
    `M 0 0`, // move to origin
    `v ${height}`, // vertical line
    'm 1 0', // move 1px to the right
    `V 0`, // second vertical line
    `M 0 0`, // move to origin

    // head
    'h 12', // horizontal line
    'q 2 0, 2 2', // rounded corner
    'v 30', // vertical line
    'q 0 2 -2 2', // rounded corner
    'h -12', // horizontal line
    `z`, // close path
  ].join(' ')

const brushHandleAccentPath = () =>
  [
    'm 5 7', // move to first accent
    'v 22', // vertical line
    'M 0 0', // move to origin
    'm 9 7', // move to second accent
    'v 22', // vertical line
    'z',
  ].join(' ')

interface BrushProps {
  size: SizeInfo //
  x: d3.ScaleLinear<number, number>
  snappedSelectedRange: [number, number] | null
  handleSelectedRangeChange: (range: [number, number] | null, lastMovingHandle: HandleType | undefined) => void
  getNewRangeWhenBrushing: (range: [number, number], movingHandle: HandleType | undefined) => [number, number] | undefined // prettier-ignore
  handleColors: { w: string; e: string }
  getHandleLabelText: (range: [number, number] | null) => [string, string]
}

export const Brush: FC<BrushProps> = ({
  size,
  x,
  snappedSelectedRange,
  handleSelectedRangeChange,
  getNewRangeWhenBrushing,
  handleColors,
  getHandleLabelText,
}) => {
  const gBrushRef = useRef<SVGGElement | null>(null)
  const brushRef = useRef<d3.BrushBehavior<undefined> | null>(null)

  /**
   * Disallow moving brush below zero
   */
  const brushExtentLeft = useMemo(
    () => Math.min(Math.max(x(0), size.margin.left), size.width - size.margin.right),
    [x, size]
  )

  // state
  const isBrushingRef = useRef(false)
  const lastSelectionRef = useRef<[number, number] | null>(null) // TODO: when initial xScale sudden changes, this is buggy
  const lastMovingHandleRef = useRef<HandleType | undefined>()

  /**
   * Snap selection after brushing, or draw selection after a manual change
   */
  const xPrevRef = useRef(x) // store previous xScale for determining if xScale is changing
  useLayoutEffect(() => {
    const isXChanging = x !== xPrevRef.current
    xPrevRef.current = x

    if (!gBrushRef.current || !brushRef.current) return
    if (snappedSelectedRange == null) return

    // Skip draw if user is currently brushing
    if (isBrushingRef.current) return

    // animate if the chart is not zooming
    const gBrush = d3.select<SVGGElement, undefined>(gBrushRef.current)
    ;(isXChanging ? gBrush : gBrush.transition()).call(brushRef.current.move, snappedSelectedRange.map(x))
  }, [x, snappedSelectedRange])

  /**
   * Passing data into brushEnded without re-trigger and no warning
   */
  const varRef = useRef({
    x,
    handleSelectedRangeChange,
    snappedSelectedRange,
    getNewRangeWhenBrushing,
    brushExtentLeft,
  })
  varRef.current.x = x
  varRef.current.handleSelectedRangeChange = handleSelectedRangeChange
  varRef.current.snappedSelectedRange = snappedSelectedRange
  varRef.current.getNewRangeWhenBrushing = getNewRangeWhenBrushing
  varRef.current.brushExtentLeft = brushExtentLeft

  /**
   * Create brush's nodes and bind events
   */
  useLayoutEffect(() => {
    if (!gBrushRef.current) return

    const getMovingHandle = (event: d3.D3BrushEvent<undefined>) => {
      if (event.selection && lastSelectionRef.current) {
        if (event.selection[0] !== lastSelectionRef.current[0]) return HandleType.e
        if (event.selection[1] !== lastSelectionRef.current[1]) return HandleType.w
      }
      return lastMovingHandleRef.current
    }

    function brushStarted(event: d3.D3BrushEvent<undefined>) {
      if (isBrushingTimeoutRef.current != null) clearTimeout(isBrushingTimeoutRef.current)
      setIsBrushing(true)

      if (!event.sourceEvent) return
      isBrushingRef.current = true

      lastSelectionRef.current = event.selection as [number, number] | null

      // stop triggering zoom event
      event.sourceEvent.stopPropagation?.()
    }

    function brushed(event: d3.D3BrushEvent<undefined>) {
      const selection = event.selection as [number, number] | null

      // sync custom handle's position
      setLocalSelection(selection)

      // sync handle padding's position
      if (gBrushRef.current) {
        const inView = [
          selection && selection[0] >= -100 && selection[0] <= size.width + 100, // arbitrary 100px extra margin
          selection && selection[1] >= -100 && selection[1] <= size.width + 100,
        ]
        d3.select<SVGGElement, undefined>(gBrushRef.current)
          .selectAll('.handle--custom')
          .data([{ type: 'w' }, { type: 'e' }])
          .attr('display', (_d, i) => (inView[i] ? null : 'none'))
          .attr('transform', (_d, i) => (inView[i] ? `translate(${(selection as [number, number])[i]},0)` : null))
      }

      // ensure not triggered from other event's callback
      if (!event.sourceEvent) return
      isBrushingRef.current = true

      // cache last selection and moving handle
      const movingHandle = getMovingHandle(event)
      if (movingHandle) lastMovingHandleRef.current = movingHandle
      if (selection) lastSelectionRef.current = selection

      // forcefully set a new brush selection when user is brushing.
      // enabled when user "locked" a desired token weight before brushing.
      if (selection && gBrushRef.current && brushRef.current) {
        const range = selection.map(varRef.current.x.invert) as [number, number]
        const newRange = varRef.current.getNewRangeWhenBrushing(range, movingHandle)
        if (newRange) {
          // `brush.move` will actually fire this `brushed` callback again, redrawing the handles.
          brushRef.current.move(d3.select(gBrushRef.current), [
            newRange[0] === range[0] ? selection[0] : varRef.current.x(newRange[0]),
            newRange[1] === range[1] ? selection[1] : varRef.current.x(newRange[1]),
          ])
        }
      }
    }

    function brushEnded(event: d3.D3BrushEvent<undefined>) {
      // delay-cancel isBrushing, for displaying label tooltip
      if (isBrushingTimeoutRef.current != null) clearTimeout(isBrushingTimeoutRef.current)
      isBrushingTimeoutRef.current = setTimeout(() => setIsBrushing(false), 1500)

      // ensure not triggered from other event's callback
      if (!event.sourceEvent) return
      isBrushingRef.current = false

      // if user attempts to clear selection, reset to last selection (if there is)
      const selection = (event.selection ?? lastSelectionRef.current) as [number, number] | null
      const range = (selection?.map(varRef.current.x.invert) ?? null) as [number, number] | null
      varRef.current.handleSelectedRangeChange(
        range,
        lastMovingHandleRef.current // use the cached moving handle because `event.selection` is post-reset
      )
      /**
       * NOTE:
       * We expect `snappedSelectedRange` must be updated such that the brushed area is redrawn.
       */
    }

    brushRef.current = d3
      .brushX<undefined>() //
      .extent([
        [varRef.current.brushExtentLeft, size.margin.top],
        [size.width - size.margin.right, size.height - size.margin.bottom],
      ])
      .on('start', brushStarted)
      .on('brush', brushed)
      .on('end', brushEnded)

    const gBrush = d3
      .select<SVGGElement, undefined>(gBrushRef.current)
      .call(brushRef.current)
      .call((g) => g.select('.overlay').attr('display', 'none').attr('pointer-events', 'none'))
      .call((g) =>
        g
          .selectAll('.selection') //
          .attr('cursor', 'default')
          .attr('pointer-events', 'none')
          .attr('stroke', 'none')
          .attr('fill-opacity', '0.18')
          .attr('fill', `url(#${idRef.current}-gradient-selection)`)
          .datum({})
      )

    gBrush
      .selectAll('.handle--custom')
      .data([{ type: 'w' }, { type: 'e' }])
      .enter()
      .append('g')
      .attr('class', 'handle--custom')
      .attr('cursor', 'ew-resize')
      .call((g) => {
        // Extra padding for mouse event
        const h = size.height - size.margin.top - size.margin.bottom
        g.append('path')
          .attr('fill-opacity', '0')
          .attr('d', () => `M0,0 L15,0 L15,${h}, L0,${h} z`)
          .attr('transform', (d) => `translate(0, ${size.margin.top}) scale(${d.type === 'w' ? -1 : 1},1)`)
      })
      .on('mouseenter', () => setIsHoveringHandle(true))
      .on('mouseleave', () => setIsHoveringHandle(false))
  }, [size])

  /**
   * Update brush extent so user cannot move below 0
   */
  useEffect(() => {
    if (!brushRef.current || !gBrushRef.current) return
    brushRef.current.extent([
      [brushExtentLeft, size.margin.top],
      [size.width - size.margin.right, size.height - size.margin.bottom],
    ])
    d3.select<SVGGElement, undefined>(gBrushRef.current).call(brushRef.current)
  }, [size, brushExtentLeft])

  /**
   * Unbind event listerns once unmounted. Needed because brush can still be moving due to animation.
   */
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (gBrushRef.current == null) {
        brushRef.current //
          ?.on('start', null)
          .on('brush', null)
          .on('end', null)
      }
    }
  }, [])

  /**
   * For displaying custom handles and labels
   */
  const [localSelection, setLocalSelection] = useState<[number, number] | null>(null)

  const [isHoveringHandle, setIsHoveringHandle] = useState(false)
  const [isBrushing, setIsBrushing] = useState(false)
  const isBrushingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()
  const showLabel = isHoveringHandle || isBrushing

  const labelTexts = useMemo(
    () => getHandleLabelText((localSelection?.map(x.invert) ?? null) as [number, number] | null),
    [getHandleLabelText, localSelection, x]
  )

  const idRef = useRef(`${Date.now() * 10000 + Math.floor(Math.random() * 10000)}`)

  const isHandleInView = (i: number) =>
    Boolean(localSelection && localSelection[i] >= -100 && localSelection[i] <= size.width + 100) // arbitrary 100px extra margin

  return (
    <>
      <defs>
        <linearGradient id={`${idRef.current}-gradient-selection`} x1="0%" y1="100%" x2="100%" y2="100%">
          <stop stopColor={handleColors.w} />
          <stop stopColor={handleColors.e} offset="1" />
        </linearGradient>
      </defs>

      {localSelection && (
        <>
          {isHandleInView(0) && (
            <g transform={`translate(${localSelection[0]},${size.margin.top})`}>
              {/* handle */}
              <g transform="scale(-1,1)">
                <path
                  fill={handleColors.w}
                  stroke={handleColors.w}
                  strokeWidth={1}
                  d={brushHandlePath(size.height - size.margin.top - size.margin.bottom)}
                />
                <path d={brushHandleAccentPath()} stroke="var(--layer1)" strokeWidth={1} />
              </g>
              {/* label */}
              <g transform="translate(-80,0)" opacity={showLabel ? 1 : 0} className="transition-opacity duration-300">
                <rect x="0" y="0" width="60" height="30" rx="8" fill="var(--layer3)" />
                <text x="30" y="16" fontSize="13" dominantBaseline="middle" textAnchor="middle" fill="var(--text1)">
                  {labelTexts[0]}
                </text>
              </g>
            </g>
          )}

          {isHandleInView(1) && (
            <g transform={`translate(${localSelection[1]},${size.margin.top})`}>
              {/* handle */}
              <g>
                <path
                  fill={handleColors.e}
                  stroke={handleColors.e}
                  strokeWidth={1}
                  d={brushHandlePath(size.height - size.margin.top - size.margin.bottom)}
                />
                <path d={brushHandleAccentPath()} stroke="var(--layer1)" strokeWidth={1} />
              </g>
              {/* label */}
              <g transform="translate(20,0)" opacity={showLabel ? 1 : 0} className="transition-opacity duration-300">
                <rect x="0" y="0" width="60" height="30" rx="8" fill="var(--layer3)" />
                <text x="30" y="16" fontSize="13" dominantBaseline="middle" textAnchor="middle" fill="var(--text1)">
                  {labelTexts[1]}
                </text>
              </g>
            </g>
          )}
        </>
      )}

      <g pointerEvents="all" ref={gBrushRef} />
    </>
  )
}
