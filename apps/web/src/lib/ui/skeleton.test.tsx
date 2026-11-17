/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SkeletonChartLoadingStateMask } from '../../../../../packages/ui/src/components/skeleton'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe.each(['area', 'bar'] as const)('%s chart skeleton', (type) => {
  let container: HTMLDivElement
  let root: Root | undefined

  function chart(): React.ReactElement {
    return (
      <svg>
        <SkeletonChartLoadingStateMask type={type} height={144} />
      </svg>
    )
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = undefined
  })

  afterEach(() => {
    act(() => root?.unmount())
    container.remove()
    vi.restoreAllMocks()
  })

  it('renders identical geometry across separate renders', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.1)
    const firstRender = renderToString(chart())

    random.mockReturnValue(0.9)

    expect(renderToString(chart())).toBe(firstRender)
  })

  it('hydrates without mismatched server and client attributes', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.1)
    container.innerHTML = renderToString(chart())
    const serverMarkup = container.innerHTML
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onRecoverableError = vi.fn()

    random.mockReturnValue(0.9)

    await act(async () => {
      root = hydrateRoot(container, chart(), { onRecoverableError })
    })

    expect(consoleError).not.toHaveBeenCalled()
    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(container.innerHTML).toBe(serverMarkup)
  })
})
