import * as d3 from 'd3'
import { MutableRefObject, useEffect, useMemo, useReducer, useRef } from 'react'

import { SizeInfo, ZoomLevel } from '../utils/types'

const ZOOM_IN_FACTOR = 2
const ZOOM_OUT_FACTOR = 1 / 2
const ZOOM_FIT_BRUSH_FACTOR = 1 / 2

interface UseZoomParams {
  size: SizeInfo
  zoomLevel: ZoomLevel
  zoomInNonce: number | undefined
  zoomOutNonce: number | undefined
  zoomToFitSelectedRangeNonce: number | undefined
  //
  x: d3.ScaleLinear<number, number>
  snappedSelectedRange: [number, number] | null
}

interface UseZoomReturn {
  svgRef: MutableRefObject<SVGSVGElement | null>
  zoomTransformRef: MutableRefObject<d3.ZoomTransform | undefined>
  xz: d3.ScaleLinear<number, number>
}

type UseZoom = (params: UseZoomParams) => UseZoomReturn

export const useZoom: UseZoom = ({
  size,
  zoomLevel,
  zoomInNonce,
  zoomOutNonce,
  zoomToFitSelectedRangeNonce,
  x,
  snappedSelectedRange,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  const zoomTransformRef = useRef<d3.ZoomTransform | undefined>()
  const zoomTransform = zoomTransformRef.current

  const xz = useMemo(() => zoomTransform?.rescaleX(x) ?? x, [x, zoomTransform])

  /**
   * intialize zoom and apply to svg
   */
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, undefined> | undefined>()
  const [, forceRender] = useReducer((x) => x + 1, 0)
  useEffect(() => {
    if (svgRef.current == null) return
    zoomRef.current = d3
      .zoom<SVGSVGElement, undefined>() //
      .scaleExtent([zoomLevel.min, zoomLevel.max])
      .extent([
        [size.margin.left, 0],
        [size.width - size.margin.right, 0],
      ])
      .translateExtent([
        [-Infinity, 0],
        [+Infinity, 0],
      ])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, undefined>) => {
        zoomTransformRef.current = event.transform
        // prevent uesless re-render
        requestAnimationFrame(() => {
          if (zoomTransformRef.current === event.transform) forceRender()
        })
      })
    d3.select<SVGSVGElement, undefined>(svgRef.current).call(zoomRef.current)
  }, [size, zoomLevel])

  /**
   * Zoom In
   */
  useEffect(() => {
    if (!svgRef.current || !zoomRef.current) return
    d3.select<SVGSVGElement, undefined>(svgRef.current) //
      .transition()
      .call(zoomRef.current.scaleBy, ZOOM_IN_FACTOR)
  }, [zoomInNonce])

  /**
   * Zoom Out
   */
  useEffect(() => {
    if (!svgRef.current || !zoomRef.current) return
    d3.select<SVGSVGElement, undefined>(svgRef.current) //
      .transition()
      .call(zoomRef.current.scaleBy, ZOOM_OUT_FACTOR)
  }, [zoomOutNonce])

  /**
   * Zoom to fit selected range, if requested
   * Code ref: https://observablehq.com/@d3/zoom-to-bounding-box
   */
  useEffect(() => {
    if (!svgRef.current || !zoomRef.current) return
    if (!snappedSelectedRange) return

    const xzDomain = xz.domain()
    const xDomain = x.domain()
    const currentScale = (xDomain[1] - xDomain[0]) / (xzDomain[1] - xzDomain[0])

    const [x0, x1] = snappedSelectedRange.map(x)
    const scale = x0 === x1 ? currentScale : ZOOM_FIT_BRUSH_FACTOR / ((x1 - x0) / size.width)
    const transform = d3.zoomIdentity
      .translate(size.width / 2, 0)
      .scale(scale)
      .translate(-(x0 + x1) / 2, 0)

    if (currentScale / scale > 1e10) {
      /**
       * Animation broken when zooming out too fast.
       * We instant-zoom to somewhere close to the target zoom, and then animate the remaining zoom.
       */
      const transformMidway = d3.zoomIdentity
        .translate(size.width / 2, 0)
        .scale(scale * 2)
        .translate(-(x0 + x1) / 2, 0)

      d3.select<SVGSVGElement, undefined>(svgRef.current) //
        .call(zoomRef.current.transform, transformMidway)
        .transition()
        .delay(50)
        .call(zoomRef.current.transform, transform)
    } else {
      d3.select<SVGSVGElement, undefined>(svgRef.current) //
        .transition()
        .duration(350)
        .call(zoomRef.current.transform, transform)
    }
  }, [zoomToFitSelectedRangeNonce]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    svgRef,
    zoomTransformRef,
    xz,
  }
}
