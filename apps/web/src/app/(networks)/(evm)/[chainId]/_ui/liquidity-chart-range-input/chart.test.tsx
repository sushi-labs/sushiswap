/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { Chart } from './chart'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it.each([
  { preset: 'wide', initialMin: 0.5, initialMax: 2, max: 20 },
  { preset: 'narrow', initialMin: 0.999, initialMax: 1.001, max: 1.5 },
])(
  'centers the spot price on open and reset for the $preset preset',
  ({ initialMin, initialMax, max }) => {
    const container = document.createElement('div')
    const root = createRoot(container)
    const onBrushDomainChange = vi.fn()
    const spot = 100
    const width = 640
    const margins = { top: 10, right: 20, bottom: 20, left: 20 }
    const midpoint = (width - margins.left - margins.right) / 2
    const expectedRange = [spot * initialMin, spot * initialMax]
    try {
      act(() =>
        root.render(
          <Chart
            data={{
              current: spot,
              series: [{ price0: spot, activeLiquidity: 10 }],
            }}
            dimensions={{ width, height: 180 }}
            margins={margins}
            styles={{
              area: { selection: 'blue', unselection: 'gray' },
              brush: { handle: { west: 'blue', east: 'blue' } },
            }}
            isPriceRangeSet
            brushLabels={(_, price) => String(price)}
            getNewRangeWhenBrushing={(range) => range}
            onBrushDomainChange={onBrushDomainChange}
            zoomLevels={{ initialMin, initialMax, min: 0.00001, max }}
          />,
        ),
      )

      const marker = container.querySelector('g[clip-path] > line')
      const zoomTarget = container.querySelector('rect.cursor-grab')
      const reset = Array.from(container.querySelectorAll('button')).find(
        (button) => button.textContent === 'Clear all',
      )
      if (!marker || !zoomTarget || !reset)
        throw new Error('Missing chart control')

      expect(Number(marker.getAttribute('x1'))).toBeCloseTo(midpoint)
      expect(onBrushDomainChange).toHaveBeenCalledWith(expectedRange, undefined)

      act(() => {
        zoomTarget.dispatchEvent(
          new WheelEvent('wheel', {
            clientX: 100,
            deltaY: -250,
            cancelable: true,
          }),
        )
      })
      expect(Number(marker.getAttribute('x1'))).not.toBeCloseTo(midpoint)

      act(() => reset.click())
      expect(Number(marker.getAttribute('x1'))).toBeCloseTo(midpoint)
      expect(onBrushDomainChange).toHaveBeenCalledWith(expectedRange, 'reset')
    } finally {
      act(() => root.unmount())
    }
  },
)
