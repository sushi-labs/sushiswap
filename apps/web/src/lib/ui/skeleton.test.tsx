/** @vitest-environment jsdom */

import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import { SkeletonChartLoadingStateMask } from '../../../../../packages/ui/src/components/skeleton'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

afterEach(() => vi.restoreAllMocks())

it.each([160, 360])('hydrates bar skeletons at height %i', async (height) => {
  const chart = (
    <svg>
      <SkeletonChartLoadingStateMask type="bar" height={height} />
    </svg>
  )
  const random = vi.spyOn(Math, 'random').mockReturnValue(0.1)
  const container = document.createElement('div')
  container.innerHTML = renderToString(chart)
  random.mockReturnValue(0.9)
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

  let root: ReturnType<typeof hydrateRoot> | undefined
  try {
    await act(async () => {
      root = hydrateRoot(container, chart)
    })
    expect(consoleError).not.toHaveBeenCalled()
    const bars = Array.from(container.querySelectorAll('rect'))
    expect(bars).toHaveLength(25)
    expect(
      new Set(bars.map((bar) => bar.getAttribute('height'))).size,
    ).toBeGreaterThan(1)
  } finally {
    await act(async () => root?.unmount())
  }
})
