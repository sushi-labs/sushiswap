/** @vitest-environment jsdom */

import { type ComponentProps, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TokenPagination, type TokenPaginationProps } from './token-pagination'

vi.mock('@sushiswap/ui', () => ({
  Button: ({ children, onClick, disabled }: ComponentProps<'button'>) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Loader: () => <span />,
}))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('TokenPagination', () => {
  let root: Root
  let container: HTMLDivElement
  let intersect: (visible: boolean) => void
  const disconnect = vi.fn()
  const onLoadMore = vi.fn()

  function render(overrides: Partial<TokenPaginationProps> = {}) {
    act(() =>
      root.render(
        <TokenPagination
          hasNextPage
          isFetching={false}
          isFetchingNextPage={false}
          isFetchNextPageError={false}
          onLoadMore={onLoadMore}
          {...overrides}
        />,
      ),
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(
          callback: (entries: { isIntersecting: boolean }[]) => void,
        ) {
          intersect = (visible) => callback([{ isIntersecting: visible }])
        }
        observe() {}
        disconnect = disconnect
      },
    )
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  })

  it('loads the next page only when the sentinel enters view', () => {
    render()
    act(() => intersect(false))
    expect(onLoadMore).not.toHaveBeenCalled()
    act(() => intersect(true))
    expect(onLoadMore).toHaveBeenCalledOnce()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  it('pauses during any fetch and resumes after it finishes', () => {
    render({ isFetching: true, isFetchingNextPage: true })
    expect(container.textContent).toContain('Loading more launches')
    expect(onLoadMore).not.toHaveBeenCalled()
    render()
    act(() => intersect(true))
    expect(onLoadMore).toHaveBeenCalledOnce()
  })

  it('keeps failed pages available for explicit retry without auto retrying', () => {
    render({ isFetchNextPageError: true })
    expect(onLoadMore).not.toHaveBeenCalled()
    expect(container.textContent).toContain(
      'More launches could not be loaded.',
    )
    act(() => container.querySelector('button')?.click())
    expect(onLoadMore).toHaveBeenCalledOnce()
  })

  it('removes the loader at the last page and disconnects on unmount', () => {
    render()
    render({ hasNextPage: false })
    expect(container.textContent).toBe('')
    expect(disconnect).toHaveBeenCalledOnce()
    expect(onLoadMore).not.toHaveBeenCalled()
  })
})
