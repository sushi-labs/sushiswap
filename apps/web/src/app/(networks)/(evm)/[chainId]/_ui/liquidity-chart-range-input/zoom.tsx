import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from '@heroicons/react/20/solid'
import { Button } from '@sushiswap/ui'
import {
  type ZoomBehavior,
  type ZoomTransform,
  select,
  zoom,
  zoomIdentity,
  zoomTransform,
} from 'd3'
import React, {
  type FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'

import type { ZoomLevels } from './types'

interface ZoomProps {
  svg: SVGElement | null
  minZoomX: number
  setZoom: (transform: ZoomTransform) => void
  width: number
  height: number
  resetBrush: () => void
  showResetButton: boolean
  zoomLevels: ZoomLevels
}

export const Zoom: FC<ZoomProps> = ({
  svg,
  minZoomX,
  setZoom,
  width,
  height,
  resetBrush,
  showResetButton,
  zoomLevels,
}) => {
  const zoomBehavior = useRef<ZoomBehavior<Element, unknown>>(undefined)
  const previousWidth = useRef(width)

  const [zoomIn, zoomOut] = useMemo(
    () => [
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 2),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleBy, 0.5),
    ],
    [svg],
  )

  const resetZoom = useCallback(() => {
    if (!svg || !zoomBehavior.current) return
    // Zoom out up to 2×, stopping when the centered viewport reaches price zero.
    const halfSpan = (zoomLevels.initialMax - zoomLevels.initialMin) / 2
    const scale = Math.max(0.5, halfSpan)
    const center = previousWidth.current / 2
    const transform = zoomIdentity
      .translate(center * (1 - scale), 0)
      .scale(scale)
    select(svg as Element)
      .interrupt()
      .call(zoomBehavior.current.transform, transform)
  }, [svg, zoomLevels])

  useLayoutEffect(() => {
    if (!svg || width <= 0) return

    const viewport: [[number, number], [number, number]] = [
      [0, 0],
      [width, height],
    ]
    const bounds: [[number, number], [number, number]] = [
      [minZoomX, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
    ]
    const behavior = zoom()
      .scaleExtent([zoomLevels.min, zoomLevels.max])
      .extent(viewport)
      .translateExtent(bounds)

    // D3 constrains gestures and animation endpoints, but zoom transitions can overshoot.
    function constrain(transform: ZoomTransform) {
      return behavior.constrain()(transform, viewport, bounds)
    }
    behavior.on('zoom', ({ transform }: { transform: ZoomTransform }) =>
      setZoom(constrain(transform)),
    )
    zoomBehavior.current = behavior
    const target = select(svg as Element).call(behavior)

    // D3 stores pan in pixels. Scale it with the viewport to keep prices in view.
    const { x, y, k } = zoomTransform(svg)
    const resizedX =
      previousWidth.current > 0 ? x * (width / previousWidth.current) : x
    const resized = constrain(zoomIdentity.translate(resizedX, y).scale(k))
    if (resized.x !== x) {
      target.call(behavior.transform, resized)
    }
    previousWidth.current = width
  }, [height, width, minZoomX, setZoom, svg, zoomLevels.max, zoomLevels.min])

  useLayoutEffect(() => {
    resetZoom()
  }, [resetZoom])

  return (
    <div className="flex justify-between gap-2">
      {showResetButton ? (
        <Button
          size="sm"
          variant="link"
          disabled={!showResetButton}
          onClick={() => {
            resetBrush()
            resetZoom()
          }}
        >
          Clear all
        </Button>
      ) : (
        <div />
      )}
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={zoomIn} disabled={false}>
          <MagnifyingGlassPlusIcon width={20} height={20} />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={zoomOut}
          disabled={false}
        >
          <MagnifyingGlassMinusIcon width={20} height={20} />
        </Button>
      </div>
    </div>
  )
}
