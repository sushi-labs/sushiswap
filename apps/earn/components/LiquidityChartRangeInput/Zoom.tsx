import { RefreshIcon, ZoomInIcon, ZoomOutIcon } from '@heroicons/react/outline'
import { IconButton, MinimizeIcon } from '@sushiswap/ui'
import { ScaleLinear, select, zoom, ZoomBehavior, zoomIdentity, ZoomTransform } from 'd3'
import React, { forwardRef, RefObject, useEffect, useImperativeHandle, useMemo, useRef } from 'react'

import { ZoomLevels } from './types'

export interface ZoomRef {
  zoomIn: () => void
  zoomOut: () => void
  zoomInitial: () => void
  zoomReset: () => void
}

interface ZoomProps {
  svg: SVGElement | null
  xScale: ScaleLinear<number, number>
  setZoom: (transform: ZoomTransform) => void
  width: number
  height: number
  resetBrush: () => void
  showResetButton: boolean
  zoomLevels: ZoomLevels
  brushDomain: [number, number] | undefined
  currentPrice: number
}

const zoomToFitBrushDomain = ({
  xScale,
  brushDomain,
  width,
  currentPrice,
  zoomLevels,
  svg,
  zoomBehavior,
}: Pick<ZoomProps, 'brushDomain' | 'xScale' | 'width' | 'currentPrice' | 'zoomLevels' | 'svg'> & {
  zoomBehavior: RefObject<ZoomBehavior<Element, unknown> | undefined>
}) => {
  if (!brushDomain || !svg || !zoomBehavior.current) return
  const start = xScale(brushDomain[0])
  const end = xScale(brushDomain[1])
  const diff = end - start
  const initialMin = currentPrice * zoomLevels.initialMin
  const initialMax = currentPrice * zoomLevels.initialMax
  const translateSlope = width / (initialMax - initialMin)
  const translateConstant = -(translateSlope * initialMin)
  const center = (brushDomain[1] - brushDomain[0]) * 0.5 + brushDomain[0]
  const to = center * translateSlope + translateConstant
  select(svg as Element)
    .call(zoomBehavior.current.translateTo, to, 0)
    .transition()
    .call(zoomBehavior.current.scaleBy, (width * 0.5) / diff)
}

const Zoom = forwardRef<ZoomRef | undefined, ZoomProps>(function Zoom(
  {
    svg,
    xScale,
    setZoom,
    width,
    height,
    resetBrush,
    showResetButton,
    zoomLevels,
    brushDomain,
    currentPrice,
  }: ZoomProps,
  ref
) {
  const zoomBehavior = useRef<ZoomBehavior<Element, unknown>>()

  const [zoomIn, zoomOut, zoomInitial, zoomReset] = useMemo(
    () => [
      () => {
        svg &&
          zoomBehavior.current &&
          select(svg as Element)
            .transition()
            .call(zoomBehavior.current.scaleBy, 2)
      },
      () => {
        svg &&
          zoomBehavior.current &&
          select(svg as Element)
            .transition()
            .call(zoomBehavior.current.scaleBy, 0.5)
      },
      () => {
        svg &&
          zoomBehavior.current &&
          select(svg as Element)
            .transition()
            .call(zoomBehavior.current.scaleTo, 0.5)
      },
      () => {
        svg &&
          zoomBehavior.current &&
          select(svg as Element)
            .call(zoomBehavior.current.transform, zoomIdentity)
            .transition()
            .call(zoomBehavior.current.scaleTo, 0.5)
      },
    ],
    [svg]
  )

  // expose functions for parent element to call
  useImperativeHandle(
    ref,
    () => ({
      zoomIn,
      zoomOut,
      zoomInitial,
      zoomReset,
    }),
    [zoomIn, zoomOut, zoomInitial, zoomReset]
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
    <div className="grid grid-cols-3 gap-1.5 absolute top-[-36px] right-0">
      {showResetButton ? (
        <IconButton
          className="w-8 h-8"
          onClick={() => {
            resetBrush()
            zoomReset()
          }}
        >
          <RefreshIcon width={16} height={16} />
        </IconButton>
      ) : (
        <IconButton
          onClick={() =>
            zoomToFitBrushDomain({
              xScale,
              brushDomain,
              width,
              currentPrice,
              zoomLevels,
              svg,
              zoomBehavior,
            })
          }
        >
          <MinimizeIcon width={16} height={16} />
        </IconButton>
      )}
      <IconButton onClick={zoomIn} disabled={false}>
        <ZoomInIcon width={16} height={16} />
      </IconButton>
      <IconButton onClick={zoomOut} disabled={false}>
        <ZoomOutIcon width={16} height={16} />
      </IconButton>
    </div>
  )
})

export default Zoom
