/** @vitest-environment jsdom */

import { type ComponentProps, type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PointsSummaryCards } from '../../points/_ui/points-summary-cards'
import {
  LeaderboardStateProvider,
  useLeaderboardState,
} from './leaderboard-provider'
import { LeaderboardSeasonOptions } from './leaderboard-season-options'
import { SeasonCountdown } from './season-countdown'

const mocks = vi.hoisted(() => ({ pointsOverview: vi.fn() }))

vi.mock('@sushiswap/ui', () => ({
  Button: ({
    children,
    onClick,
    variant,
    'aria-pressed': pressed,
  }: ComponentProps<'button'> & { variant: string }) => (
    <button
      type="button"
      onClick={onClick}
      data-variant={variant}
      aria-pressed={pressed}
    >
      {children}
    </button>
  ),
  SkeletonBox: () => null,
  SkeletonText: () => null,
  classNames: (...classes: (string | undefined)[]) =>
    classes.filter(Boolean).join(' '),
}))
vi.mock('~evm/perps/_ui/_common', () => ({
  PerpsCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))
vi.mock('src/lib/wallet', () => ({ useAccount: () => undefined }))
vi.mock('src/lib/perps', () => ({
  useSushiPointsOverview: (args: unknown) => {
    mocks.pointsOverview(args)
    return { data: { totalPoints: 1000 }, isLoading: false }
  },
  perpsNumberFormatter: () => '1,000',
}))
vi.mock('../../points/_ui/overview', () => ({
  Overview: ({ season }: { season: string }) => (
    <div data-overview-season={season} />
  ),
}))
vi.mock('../../points/_ui/multiplier', () => ({
  Multiplier: ({ season }: { season: string }) => (
    <div data-multiplier-season={season} />
  ),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function LeaderboardSeason(): ReactNode {
  const { state } = useLeaderboardState()
  return <div data-leaderboard-season={state.seasonToView} />
}

describe('perps season controls', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-30T00:00:00Z'))
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.useRealTimers()
  })

  function renderLeaderboard(): void {
    act(() =>
      root.render(
        <LeaderboardStateProvider>
          <LeaderboardSeasonOptions />
          <LeaderboardSeason />
        </LeaderboardStateProvider>,
      ),
    )
  }

  function selectSeason3(): void {
    const button = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Season 3',
    )
    expect(button).toBeDefined()
    act(() => button?.click())
    expect(button?.getAttribute('data-variant')).toBe('perps-secondary')
    expect(button?.getAttribute('aria-pressed')).toBe('true')
  }

  it('selects season 3 in the leaderboard while preserving earlier seasons', () => {
    renderLeaderboard()
    expect(
      container
        .querySelector('[data-leaderboard-season]')
        ?.getAttribute('data-leaderboard-season'),
    ).toBe('SEASON_2')
    expect(
      Array.from(
        container.querySelectorAll('button'),
        (button) => button.textContent,
      ),
    ).toEqual(['Season 1', 'Season 2', 'Season 3'])
    selectSeason3()
    expect(
      container
        .querySelector('[data-leaderboard-season]')
        ?.getAttribute('data-leaderboard-season'),
    ).toBe('SEASON_3')
  })

  it('passes the selected season 3 to every points summary card and its query', () => {
    act(() => root.render(<PointsSummaryCards />))
    expect(mocks.pointsOverview).toHaveBeenLastCalledWith({
      address: undefined,
      season: 'SEASON_2',
    })
    selectSeason3()
    expect(
      container.querySelector('[data-overview-season="SEASON_3"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('[data-multiplier-season="SEASON_3"]'),
    ).not.toBeNull()
    expect(mocks.pointsOverview).toHaveBeenLastCalledWith({
      address: undefined,
      season: 'SEASON_3',
    })
  })

  it('defaults the leaderboard to season 3 when mounted after the rollover', () => {
    vi.setSystemTime(new Date('2026-11-02T00:00:00Z'))
    renderLeaderboard()
    expect(
      container
        .querySelector('[data-leaderboard-season]')
        ?.getAttribute('data-leaderboard-season'),
    ).toBe('SEASON_3')
  })

  it('defaults points queries to season 3 when mounted after the rollover', () => {
    vi.setSystemTime(new Date('2026-11-02T00:00:00Z'))
    act(() => root.render(<PointsSummaryCards />))
    expect(mocks.pointsOverview).toHaveBeenLastCalledWith({
      address: undefined,
      season: 'SEASON_3',
    })
  })

  it('updates the countdown through the season 2 end and season 3 start', () => {
    vi.setSystemTime(new Date('2026-11-01T23:59:58Z'))
    act(() => root.render(<SeasonCountdown />))
    expect(container.textContent).toBe('Season 2 ends in00:00:00:01')

    act(() => vi.advanceTimersByTime(1000))
    expect(container.textContent).toBe('Season 3 starts in00:00:00:01')

    act(() => vi.advanceTimersByTime(1000))
    expect(container.textContent).toBe('Season 3 ends in92:23:59:59')
  })

  it('stops the countdown at zero when season 3 ends', () => {
    vi.setSystemTime(new Date('2027-02-02T23:59:58Z'))
    act(() => root.render(<SeasonCountdown />))
    expect(container.textContent).toBe('Season 3 ends in00:00:00:01')

    act(() => vi.advanceTimersByTime(1000))
    expect(container.textContent).toBe('Season 3 has ended00:00:00:00')

    act(() => vi.advanceTimersByTime(1000))
    expect(container.textContent).toBe('Season 3 has ended00:00:00:00')
  })
})
