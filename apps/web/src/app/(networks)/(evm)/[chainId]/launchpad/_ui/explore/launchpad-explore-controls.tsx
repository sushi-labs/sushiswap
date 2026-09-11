'use client'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { TextField, classNames } from '@sushiswap/ui'
import {
  type ReactElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { LaunchpadTokenSortField } from '../../types'
import { DEFAULT_LAUNCHPAD_TOKEN_SORT } from './token-sort-controls'

const CONTROL_CLASS =
  'flex h-8 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perps-blue disabled:cursor-not-allowed'
const SELECTED_CLASS = 'border-perps-blue bg-[#1E2F50] text-white'
const SCROLL_CONTROL_CLASS =
  'absolute inset-y-1 z-10 flex w-8 items-center text-perps-muted hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-perps-blue'
const SCROLL_HINT_WIDTH = 32

function revealSortOption(
  viewport: HTMLDivElement,
  button: HTMLButtonElement,
): void {
  const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth)
  if (maxScroll === 0 || viewport.clientWidth === 0) return

  const viewportBounds = viewport.getBoundingClientRect()
  const buttonBounds = button.getBoundingClientRect()
  const visibleLeft =
    viewportBounds.left + (viewport.scrollLeft > 1 ? SCROLL_HINT_WIDTH : 0)
  const visibleRight =
    viewportBounds.right -
    (viewport.scrollLeft < maxScroll - 1 ? SCROLL_HINT_WIDTH : 0)

  if (buttonBounds.left >= visibleLeft && buttonBounds.right <= visibleRight) {
    return
  }

  // Scroll only this row, leaving the page position and keyboard focus intact.
  viewport.scrollTo({
    left: Math.max(
      0,
      Math.min(
        maxScroll,
        viewport.scrollLeft +
          buttonBounds.left -
          viewportBounds.left -
          (viewport.clientWidth - buttonBounds.width) / 2,
      ),
    ),
    behavior: 'instant',
  })
}

const SORT_OPTIONS = [
  { label: 'Trending', value: 'TRENDING' },
  { label: 'New', value: 'CREATED_AT' },
  { label: 'Stock Pairs', value: 'STOCK_TOKENS' },
  { label: 'Market Cap', value: 'MARKET_CAPITALIZATION' },
  { label: 'Volume', value: 'VOLUME_24H' },
] as const

const PERIOD_OPTIONS = [
  { label: '1H', value: 'VOLUME_1H' },
  { label: '6H', value: 'VOLUME_6H' },
  { label: '12H', value: 'VOLUME_12H' },
  { label: '24H', value: 'VOLUME_24H' },
] as const

export function LaunchpadExploreControls({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  view,
  onViewChange,
  disabled = false,
}: {
  search: string
  onSearchChange: (search: string) => void
  sortBy: LaunchpadTokenSortField
  onSortByChange: (sortBy: LaunchpadTokenSortField) => void
  view: 'grid' | 'table'
  onViewChange: (view: 'grid' | 'table') => void
  disabled?: boolean
}): ReactElement {
  const isVolume = sortBy.startsWith('VOLUME_')
  const volumePeriod = isVolume ? sortBy : 'VOLUME_24H'
  const sortOptionsRef = useRef<HTMLDivElement>(null)
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: false })

  const updateScrollEdges = useCallback(function updateScrollEdges() {
    const viewport = sortOptionsRef.current
    if (!viewport) return

    const left = viewport.scrollLeft > 1
    const right =
      viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1
    setScrollEdges((previous) =>
      previous.left === left && previous.right === right
        ? previous
        : { left, right },
    )
  }, [])

  useLayoutEffect(() => {
    const viewport = sortOptionsRef.current
    if (!viewport) return

    const activeSort = sortBy.startsWith('VOLUME_') ? 'VOLUME_24H' : sortBy
    const selected = viewport.querySelector<HTMLButtonElement>(
      `[data-sort-value="${activeSort}"]`,
    )
    function updateLayout() {
      if (!viewport) return
      if (selected) revealSortOption(viewport, selected)
      updateScrollEdges()
    }

    updateLayout()
    const observer = new ResizeObserver(updateLayout)
    observer.observe(viewport)
    for (const button of viewport.children) observer.observe(button)
    return () => observer.disconnect()
  }, [sortBy, updateScrollEdges])

  function scrollSortOptions(direction: -1 | 1): void {
    const viewport = sortOptionsRef.current
    if (!viewport) return

    viewport.scrollBy({
      left: direction * viewport.clientWidth * 0.75,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-perps-muted">
            Explore
          </h2>
          <p className="text-sm leading-6 text-[#6B7280] sm:text-base">
            Tokens currently launching on Sushi Launch &amp; pools.fun
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-2 lg:gap-4 sm:w-auto sm:max-w-[250px] sm:justify-end lg:max-w-none">
          <div
            role="group"
            aria-label="Volume period"
            className="flex flex-1 items-center justify-between gap-1 sm:flex-none border-white/[0.12] border p-1 rounded-xl"
          >
            {PERIOD_OPTIONS.map((period) => (
              <button
                key={period.value}
                type="button"
                aria-pressed={volumePeriod === period.value}
                disabled={disabled}
                onClick={() => onSortByChange(period.value)}
                className={classNames(
                  CONTROL_CLASS,
                  '!px-2 sm:!px-4',
                  volumePeriod === period.value
                    ? SELECTED_CLASS
                    : 'border-transparent text-[#6B7280] hover:text-white',
                )}
              >
                {period.label}
              </button>
            ))}
          </div>
          <div
            role="group"
            aria-label="Token view"
            className="ml-auto flex items-center gap-1.5 border-white/[0.12] border p-1 rounded-xl"
          >
            {(['grid', 'table'] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={view === option}
                disabled={disabled}
                onClick={() => onViewChange(option)}
                className={classNames(
                  CONTROL_CLASS,
                  view === option
                    ? SELECTED_CLASS
                    : ' text-white hover:bg-white/[0.04] border-transparent',
                )}
              >
                {option === 'grid' ? 'Grid' : 'Table'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-2 lg:gap-4">
        <TextField
          disabled={disabled}
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          icon={MagnifyingGlassIcon}
          iconProps={{ className: 'text-[#6B7280]' }}
          placeholder="Search tokens, symbols, or addresses"
          aria-label="Search launches"
          className="!h-11 !rounded-xl !border !border-white/[0.07] !bg-[#101116] !font-normal !text-perps-muted placeholder:!text-[#6B7280]"
          wrapperClassName="order-1 w-full min-w-0 md:w-auto md:flex-[1_1_14rem] md:mr-auto lg:max-w-[400px]"
        />
        <div className="relative order-2 flex w-full min-w-0 max-w-full items-center rounded-xl border border-white/[0.07] bg-white/[0.015] p-1 md:order-3 xl:order-2 lg:w-fit xl:shrink-0">
          <div
            ref={sortOptionsRef}
            role="group"
            aria-label="Sort launches by"
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={updateScrollEdges}
            onFocusCapture={(event) => {
              if (
                event.target instanceof HTMLButtonElement &&
                event.target.matches(':focus-visible')
              ) {
                revealSortOption(event.currentTarget, event.target)
                updateScrollEdges()
              }
            }}
          >
            {SORT_OPTIONS.map((option) => {
              const selected =
                option.value === sortBy ||
                (option.value === 'VOLUME_24H' && isVolume)
              return (
                <button
                  key={option.value}
                  type="button"
                  data-sort-value={option.value}
                  aria-pressed={selected}
                  disabled={disabled}
                  onClick={() => {
                    onSortByChange(option.value)
                  }}
                  className={classNames(
                    CONTROL_CLASS,
                    'grow',
                    selected
                      ? SELECTED_CLASS
                      : ' text-white hover:bg-white/[0.04] border-transparent',
                  )}
                >
                  {option.label}
                </button>
              )
            })}
            {sortBy === 'CURRENT_TVL' && (
              <button
                type="button"
                data-sort-value="CURRENT_TVL"
                aria-pressed="true"
                disabled={disabled}
                className={classNames('grow', CONTROL_CLASS, SELECTED_CLASS)}
              >
                Liquidity
              </button>
            )}
          </div>
          {scrollEdges.left && (
            <button
              type="button"
              aria-label="Scroll sort options left"
              onClick={() => scrollSortOptions(-1)}
              className={classNames(
                SCROLL_CONTROL_CLASS,
                'left-0 top-1/2 -translate-y-1/2 justify-start h-10 rounded-l-xl bg-gradient-to-r from-[#141519] via-[#141519]/95 to-transparent',
              )}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          )}
          {scrollEdges.right && (
            <button
              type="button"
              aria-label="Scroll sort options right"
              onClick={() => scrollSortOptions(1)}
              className={classNames(
                SCROLL_CONTROL_CLASS,
                'right-0 top-1/2 -translate-y-1/2 justify-end h-10 rounded-r-xl bg-gradient-to-l from-[#141519] via-[#141519]/95 to-transparent',
              )}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function noop() {}

export function LaunchpadExploreControlsSkeleton(): ReactElement {
  return (
    <LaunchpadExploreControls
      disabled
      search=""
      onSearchChange={noop}
      sortBy={DEFAULT_LAUNCHPAD_TOKEN_SORT}
      onSortByChange={noop}
      view="grid"
      onViewChange={noop}
    />
  )
}
