import { RefreshIcon, ZoomInIcon, ZoomOutIcon } from '@heroicons/react/solid'
import { classNames } from '@sushiswap/ui'
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
    <div
      className={classNames(
        showResetButton ? 'grid-cols-3' : 'grid-cols-2',
        'grid gap-1.5 absolute top-[-75px] right-0'
      )}
    >
      {showResetButton && (
        <button
          className="bg-white/[0.04] hover:bg-white/[0.08] p-1 rounded-full"
          onClick={() => {
            resetBrush()
            zoomReset()
          }}
          disabled={false}
        >
          <RefreshIcon width={16} />
        </button>
      )}
      <button className="bg-white/[0.04] hover:bg-white/[0.08] p-1 rounded-full" onClick={zoomIn} disabled={false}>
        <ZoomInIcon width={16} />
      </button>
      <button className="bg-white/[0.04] hover:bg-white/[0.08] p-1 rounded-full" onClick={zoomOut} disabled={false}>
        <ZoomOutIcon width={16} />
      </button>
    </div>
  )
}
