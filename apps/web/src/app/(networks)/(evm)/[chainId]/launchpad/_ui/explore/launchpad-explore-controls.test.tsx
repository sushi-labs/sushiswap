/** @vitest-environment jsdom */

import { type ComponentProps, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LaunchpadExploreControls } from './launchpad-explore-controls'

vi.mock('@sushiswap/ui', () => ({
  classNames: (...classes: string[]) => classes.filter(Boolean).join(' '),
  TextField: ({ value, onChange, disabled }: ComponentProps<'input'>) => (
    <input value={value} onChange={onChange} disabled={disabled} />
  ),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function bounds(left: number, width: number): DOMRect {
  return {
    x: left,
    y: 0,
    left,
    right: left + width,
    width,
    top: 0,
    bottom: 32,
    height: 32,
    toJSON() {
      return { left, width }
    },
  }
}

describe('LaunchpadExploreControls overflow', () => {
  let container: HTMLDivElement
  let root: Root
  let width: number
  let resize: () => void
  const disconnect = vi.fn()
  const onSortByChange = vi.fn()
  const scrollTo = vi.fn(function (
    this: HTMLElement,
    options: ScrollToOptions,
  ) {
    this.scrollLeft = Math.max(
      0,
      Math.min(this.scrollWidth - this.clientWidth, options.left ?? 0),
    )
    this.dispatchEvent(new Event('scroll'))
  })
  const scrollBy = vi.fn(function (
    this: HTMLElement,
    options: ScrollToOptions,
  ) {
    scrollTo.call(this, {
      ...options,
      left: this.scrollLeft + (options.left ?? 0),
    })
  })

  function render(
    sortBy: ComponentProps<
      typeof LaunchpadExploreControls
    >['sortBy'] = 'MARKET_CAPITALIZATION',
  ) {
    act(() => {
      root.render(
        <LaunchpadExploreControls
          search=""
          onSearchChange={vi.fn()}
          sortBy={sortBy}
          onSortByChange={onSortByChange}
          view="grid"
          onViewChange={vi.fn()}
        />,
      )
    })
  }

  function viewport(): HTMLDivElement {
    const element = container.querySelector<HTMLDivElement>(
      '[aria-label="Sort launches by"]',
    )
    if (!element) throw new Error('Missing sort options')
    return element
  }

  function arrow(direction: 'left' | 'right'): HTMLButtonElement | null {
    return container.querySelector(
      `[aria-label="Scroll sort options ${direction}"]`,
    )
  }

  function expectVisible(button: HTMLButtonElement | null) {
    if (!button) throw new Error('Missing sort button')
    const rowBounds = viewport().getBoundingClientRect()
    const buttonBounds = button.getBoundingClientRect()
    expect(buttonBounds.left).toBeGreaterThanOrEqual(
      rowBounds.left + (arrow('left') ? 32 : 0),
    )
    expect(buttonBounds.right).toBeLessThanOrEqual(
      rowBounds.right - (arrow('right') ? 32 : 0),
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    width = 300
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
        disconnect = disconnect
      },
    )
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(
      () => width,
    )
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(
      function (this: HTMLElement) {
        return Math.max(width, this.children.length * 104 - 4)
      },
    )
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        if (this.hasAttribute('data-sort-value') && this.parentElement) {
          const index = Array.from(this.parentElement.children).indexOf(this)
          return bounds(40 + index * 104 - this.parentElement.scrollLeft, 100)
        }
        return bounds(40, width)
      },
    )
    Object.defineProperties(HTMLElement.prototype, {
      scrollTo: { configurable: true, value: scrollTo },
      scrollBy: { configurable: true, value: scrollBy },
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo')
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollBy')
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it.each([
    'MARKET_CAPITALIZATION',
    'VOLUME_1H',
    'VOLUME_6H',
    'VOLUME_12H',
    'VOLUME_24H',
    'CURRENT_TVL',
  ] as const)(
    'reveals the initial %s selection without moving focus',
    (sort) => {
      render(sort)
      expectVisible(viewport().querySelector('[aria-pressed="true"]'))
      expect(viewport().scrollLeft).toBeGreaterThan(0)
      expect(
        scrollTo.mock.contexts.every((element) => element === viewport()),
      ).toBe(true)
      expect(scrollTo.mock.calls[0]?.[0].behavior).toBe('instant')
      expect(document.activeElement).toBe(document.body)
      expect(onSortByChange).not.toHaveBeenCalled()
    },
  )

  it('shows hints only on edges with hidden options and allows free scrolling', () => {
    render('CREATED_AT')
    expect(scrollTo).not.toHaveBeenCalled()
    expect(arrow('left')).toBeNull()
    expect(arrow('right')).not.toBeNull()

    act(() => {
      viewport().scrollLeft = 80
      viewport().dispatchEvent(new Event('scroll'))
    })
    expect(arrow('left')).not.toBeNull()
    expect(arrow('right')).not.toBeNull()
    expect(scrollTo).not.toHaveBeenCalled()

    act(() => {
      viewport().scrollLeft = viewport().scrollWidth - width
      viewport().dispatchEvent(new Event('scroll'))
    })
    expect(arrow('left')).not.toBeNull()
    expect(arrow('right')).toBeNull()
    expect(onSortByChange).not.toHaveBeenCalled()
  })

  it('reveals a changed selection and responds to resizing', () => {
    render('CREATED_AT')
    render('VOLUME_24H')
    expectVisible(viewport().querySelector('[aria-pressed="true"]'))

    width = 600
    act(() => {
      viewport().scrollLeft = 0
      resize()
    })
    expect(arrow('left')).toBeNull()
    expect(arrow('right')).toBeNull()

    width = 250
    act(() => resize())
    expectVisible(viewport().querySelector('[aria-pressed="true"]'))
    expect(arrow('left')).not.toBeNull()
  })

  it('does not add hints or scroll when all options fit', () => {
    width = 600
    render()
    expect(arrow('left')).toBeNull()
    expect(arrow('right')).toBeNull()
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('reveals Volume again when its period changes after manual scrolling', () => {
    render('VOLUME_1H')
    act(() => {
      viewport().scrollLeft = 0
      viewport().dispatchEvent(new Event('scroll'))
    })
    render('VOLUME_6H')
    expectVisible(viewport().querySelector('[aria-pressed="true"]'))
  })

  it('scrolls with arrows without changing the selected sort and respects reduced motion', () => {
    render('CREATED_AT')
    act(() => arrow('right')?.click())
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 225, behavior: 'smooth' })
    expect(arrow('right')).toBeNull()

    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    )
    act(() => arrow('left')?.click())
    expect(scrollBy).toHaveBeenLastCalledWith({
      left: -225,
      behavior: 'instant',
    })
    expect(arrow('left')).toBeNull()
    expect(onSortByChange).not.toHaveBeenCalled()
  })

  it('reveals keyboard-focused options without selecting them', () => {
    render('VOLUME_24H')
    const button = viewport().querySelector<HTMLButtonElement>(
      '[data-sort-value="CREATED_AT"]',
    )
    if (!button) throw new Error('Missing New sort option')
    vi.spyOn(button, 'matches').mockReturnValue(true)
    act(() => button.focus())
    expectVisible(button)
    expect(document.activeElement).toBe(button)
    expect(onSortByChange).not.toHaveBeenCalled()
  })

  it('does not move pointer-focused options before their click completes', () => {
    render('VOLUME_24H')
    const button = viewport().querySelector<HTMLButtonElement>(
      '[data-sort-value="CREATED_AT"]',
    )
    if (!button) throw new Error('Missing New sort option')
    vi.spyOn(button, 'matches').mockReturnValue(false)
    scrollTo.mockClear()
    act(() => {
      button.focus()
      button.click()
    })
    expect(scrollTo).not.toHaveBeenCalled()
    expect(onSortByChange).toHaveBeenCalledWith('CREATED_AT')
  })

  it('disconnects the resize observer on unmount', () => {
    render()
    act(() => root.render(null))
    expect(disconnect).toHaveBeenCalledOnce()
  })
})
