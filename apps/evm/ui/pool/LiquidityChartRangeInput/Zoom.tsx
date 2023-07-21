import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/20/solid'
import { Button } from '@sushiswap/ui/components/button'
import { ScaleLinear, select, zoom, ZoomBehavior, zoomIdentity, ZoomTransform } from 'd3'
import React, { FC, useEffect, useMemo, useRef } from 'react'

import { ZoomLevels } from './types'

interface ZoomProps {
  svg: SVGElement | null
  xScale: ScaleLinear<number, number>
  setZoom: (transform: ZoomTransform) => void
  width: number
  height: number
  resetBrush: () => void
  showResetButton: boolean
  zoomLevels: ZoomLevels
}

export const Zoom: FC<ZoomProps> = ({
  svg,
  xScale,
  setZoom,
  width,
  height,
  resetBrush,
  showResetButton,
  zoomLevels,
}) => {
  const zoomBehavior = useRef<ZoomBehavior<Element, unknown>>()

  const [zoomIn, zoomOut, zoomInitial, zoomReset] = useMemo(
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
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
      () =>
        svg &&
        zoomBehavior.current &&
        select(svg as Element)
          .call(zoomBehavior.current.transform, zoomIdentity.translate(0, 0).scale(1))
          .transition()
          .call(zoomBehavior.current.scaleTo, 0.5),
    ],
    [svg]
  )

  useEffect(() => {
    if (!svg) return

    zoomBehavior.current = zoom()
      .scaleExtent([zoomLevels.min, zoomLevels.max])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', ({ transform }: { transform: ZoomTransform }) => setZoom(transform))

    select(svg as Element).call(zoomBehavior.current)
  }, [height, width, setZoom, svg, xScale, zoomBehavior, zoomLevels, zoomLevels.max, zoomLevels.min])

  useEffect(() => {
    // reset zoom to initial on zoomLevel change
    zoomInitial()
  }, [zoomInitial, zoomLevels])

  return (
    <div className="flex justify-between gap-2">
      {showResetButton ? (
        <Button
          size="sm"
          variant="link"
          disabled={!showResetButton}
          onClick={() => {
            resetBrush()
            zoomReset()
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
        <Button size="sm" variant="secondary" onClick={zoomOut} disabled={false}>
          <MagnifyingGlassMinusIcon width={20} height={20} />
        </Button>
      </div>
    </div>
  )
}
