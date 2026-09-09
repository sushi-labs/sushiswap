/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TrendingTokenCarousel } from './trending-token-carousel'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('TrendingTokenCarousel', () => {
  let container: HTMLDivElement
  let root: Root
  let resize: () => void
  const scrollTo = vi.fn(function (
    this: HTMLElement,
    options: ScrollToOptions,
  ) {
    this.scrollLeft = options.left ?? 0
  })

  function render(count = 4) {
    act(() => {
      root.render(
        <TrendingTokenCarousel
          slides={Array.from({ length: count }, (_, index) => ({
            id: `token-${index}`,
            name: `Token ${index + 1}`,
            content: <a href={`/token/${index}`}>Token {index + 1}</a>,
          }))}
        />,
      )
    })
  }

  function click(label: string) {
    const button = container.querySelector<HTMLButtonElement>(
      `button[aria-label="${label}"]`,
    )
    expect(button).not.toBeNull()
    act(() => button?.click())
  }

  function activeLabel() {
    return container
      .querySelector('[aria-current="true"]')
      ?.getAttribute('aria-label')
  }

  beforeEach(() => {
    vi.useFakeTimers()
    scrollTo.mockClear()
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false })),
    )
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback
        }
        observe() {}
        disconnect() {}
      },
    )
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(440)
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo')
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('advances every five seconds and loops back to the first slide', () => {
    render()
    act(() => vi.advanceTimersByTime(4_999))
    expect(activeLabel()).toBe('Show Token 1')
    act(() => vi.advanceTimersByTime(1))
    expect(activeLabel()).toBe('Show Token 2')
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 440, behavior: 'smooth' })
    for (let index = 0; index < 3; index++) {
      act(() => vi.advanceTimersByTime(5_000))
    }
    expect(activeLabel()).toBe('Show Token 1')
  })

  it('supports arrows and direct selectors, restarting the five-second timer', () => {
    render()
    click('Previous trending token')
    expect(activeLabel()).toBe('Show Token 4')
    click('Next trending token')
    expect(activeLabel()).toBe('Show Token 1')
    act(() => vi.advanceTimersByTime(4_000))
    click('Show Token 3')
    act(() => vi.advanceTimersByTime(4_999))
    expect(activeLabel()).toBe('Show Token 3')
    act(() => vi.advanceTimersByTime(1))
    expect(activeLabel()).toBe('Show Token 4')
  })

  it('tracks native swipe scrolling and waits five seconds after settling', () => {
    render()
    const viewport = container.querySelector<HTMLDivElement>('.overflow-x-auto')
    expect(viewport).not.toBeNull()
    if (!viewport) return
    act(() => {
      viewport.scrollLeft = 880
      viewport.dispatchEvent(new Event('scroll'))
    })
    act(() => vi.advanceTimersByTime(150))
    expect(activeLabel()).toBe('Show Token 3')
    act(() => vi.advanceTimersByTime(4_999))
    expect(activeLabel()).toBe('Show Token 3')
    act(() => vi.advanceTimersByTime(1))
    expect(activeLabel()).toBe('Show Token 4')
  })

  it('keeps inactive links inert and has a single desktop-only selector row', () => {
    render()
    expect(container.querySelectorAll('[inert]')).toHaveLength(3)
    const selectors = container.querySelector(
      '[aria-label="Previous trending token"]',
    )?.parentElement
    expect(selectors?.className).toContain('hidden')
    expect(selectors?.className).toContain('lg:flex')
    click('Show Token 3')
    expect(
      container
        .querySelector('[aria-label="3 of 4: Token 3"]')
        ?.hasAttribute('inert'),
    ).toBe(false)
  })

  it('does not restart rotation when token data refreshes', () => {
    render()
    act(() => vi.advanceTimersByTime(4_000))
    render()
    act(() => vi.advanceTimersByTime(1_000))
    expect(activeLabel()).toBe('Show Token 2')
  })

  it('realigns the active slide on resize without resetting the selection', () => {
    render()
    click('Show Token 3')
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(320)
    act(() => resize())
    expect(scrollTo).toHaveBeenLastCalledWith({
      left: 640,
      behavior: 'instant',
    })
    expect(activeLabel()).toBe('Show Token 3')
  })

  it('includes the gap between slides when navigating and resizing', () => {
    render()
    const viewport = container.querySelector<HTMLDivElement>('.overflow-x-auto')
    if (!viewport) throw new Error('Missing carousel viewport')
    viewport.style.columnGap = '16px'
    click('Show Token 3')
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 912, behavior: 'smooth' })
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(320)
    act(() => resize())
    expect(scrollTo).toHaveBeenLastCalledWith({
      left: 672,
      behavior: 'instant',
    })
  })

  it('pauses in a hidden tab and resumes with a fresh timer', () => {
    render()
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    act(() => vi.advanceTimersByTime(10_000))
    expect(activeLabel()).toBe('Show Token 1')
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    act(() => vi.advanceTimersByTime(5_000))
    expect(activeLabel()).toBe('Show Token 2')
  })

  it('pauses on mouse hover and resumes when the pointer leaves', () => {
    render()
    const carousel = container.querySelector('section')
    const enter = new Event('pointerover', { bubbles: true })
    Object.defineProperty(enter, 'pointerType', { value: 'mouse' })
    act(() => carousel?.dispatchEvent(enter))
    act(() => vi.advanceTimersByTime(10_000))
    expect(activeLabel()).toBe('Show Token 1')
    act(() =>
      carousel?.dispatchEvent(new Event('pointerout', { bubbles: true })),
    )
    act(() => vi.advanceTimersByTime(5_000))
    expect(activeLabel()).toBe('Show Token 2')
  })

  it('pauses while a keyboard-focused link is being used', () => {
    render()
    const link = container.querySelector('a')
    if (!link) throw new Error('Missing active token link')
    vi.spyOn(link, 'matches').mockReturnValue(true)
    act(() => link.focus())
    act(() => vi.advanceTimersByTime(10_000))
    expect(activeLabel()).toBe('Show Token 1')
    act(() => link.blur())
    act(() => vi.advanceTimersByTime(5_000))
    expect(activeLabel()).toBe('Show Token 2')
  })

  it('handles empty, single-slide and shrinking results', () => {
    render()
    click('Show Token 4')
    render(2)
    expect(activeLabel()).toBe('Show Token 2')
    render(1)
    expect(container.querySelector('button')).toBeNull()
    act(() => vi.advanceTimersByTime(10_000))
    expect(container.querySelector('[inert]')).toBeNull()
    render(0)
    expect(container.childElementCount).toBe(0)
  })

  it('uses instant navigation when reduced motion is requested', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    )
    render()
    click('Next trending token')
    expect(scrollTo).toHaveBeenLastCalledWith({
      left: 440,
      behavior: 'instant',
    })
  })

  it('cleans up the rotation timer on unmount', () => {
    render()
    act(() => root.render(null))
    expect(vi.getTimerCount()).toBe(0)
  })
})
