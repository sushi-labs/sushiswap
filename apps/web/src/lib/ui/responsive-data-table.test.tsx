/** @vitest-environment jsdom */

import { type SortingState, createColumnHelper } from '@tanstack/react-table'
import { act, useState } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ResponsiveDataTable,
  type ResponsiveDataTableProps,
} from '../../../../../packages/ui/src/components/data-table/responsive-data-table'

vi.mock('@sushiswap/hooks', async () => ({
  useIsomorphicLayoutEffect: (await import('react')).useLayoutEffect,
}))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const data = Array.from({ length: 12 }, (_, i) => ({
  rank: i + 1,
  name: `Item ${i + 1}`,
}))
const column = createColumnHelper<(typeof data)[number]>()
const columns = [
  column.accessor('rank', { header: 'Rank' }),
  column.accessor('name', { header: 'Name' }),
]
const baseProps = { columns, data, loading: false }

describe('ResponsiveDataTable', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
    vi.stubGlobal('scrollTo', vi.fn())
    const rect = document.documentElement.getBoundingClientRect()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      ...rect,
      width: 1024,
      right: 1024,
      height: 52,
      bottom: 52,
      toJSON: () => ({}),
    })
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(52)
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1024)
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  function render(
    overrides: Partial<ResponsiveDataTableProps<(typeof data)[number]>> = {},
  ): void {
    act(() =>
      root.render(<ResponsiveDataTable {...baseProps} {...overrides} />),
    )
  }

  function desktopRanks(): number[] {
    return Array.from(
      container.querySelectorAll('tbody tr[data-index] td:first-child'),
      (row) => Number(row.textContent),
    )
  }

  it('includes all rows by default and respects explicit desktop pagination', () => {
    render()
    expect(desktopRanks()).toEqual(data.map(({ rank }) => rank))
    expect(container.textContent).not.toContain('Rows per page')

    render({ desktop: { pagination: true } })
    expect(desktopRanks()).toHaveLength(10)
    const nextPage = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Go to next page',
    )
    act(() => nextPage?.click())
    expect(desktopRanks()).toEqual([11, 12])

    render({
      desktop: {
        pagination: true,
        state: { pagination: { pageIndex: 1, pageSize: 3 } },
      },
    })
    expect(desktopRanks()).toEqual([4, 5, 6])
    expect(container.textContent).toContain('Rows per page')
  })

  it.each(['controlled', 'uncontrolled'])(
    'shares %s sorting between desktop rows and custom mobile cards',
    (mode) => {
      function SortedTable() {
        const [sorting, setSorting] = useState<SortingState>([])
        return (
          <ResponsiveDataTable
            {...baseProps}
            {...(mode === 'controlled' && {
              sorting,
              onSortingChange: setSorting,
            })}
            mobile={{
              columns: [{ accessorKey: 'rank', header: 'Mobile rank' }],
              hideExpand: true,
              rowRenderer: (row, card) => (
                <article data-rank={row.original.rank}>{card}</article>
              ),
            }}
          />
        )
      }
      act(() => root.render(<SortedTable />))
      expect(container.querySelector('article')?.textContent).toBe(
        'Mobile rank1',
      )
      const sortButton =
        container.querySelector<HTMLButtonElement>('thead button')
      expect(sortButton?.textContent).toBe('Rank')
      act(() => sortButton?.click())
      expect(desktopRanks()[0]).toBe(12)
      expect(container.querySelector('article')?.dataset.rank).toBe('12')
    },
  )

  it('sorts cards by a desktop-only column using its custom comparator', () => {
    render({
      columns: [
        column.accessor('rank', {
          header: 'Rank',
          sortingFn: (a, b) => (a.original.rank % 3) - (b.original.rank % 3),
        }),
        column.accessor('name', { header: 'Name' }),
      ],
      sorting: [{ id: 'rank', desc: false }],
      mobile: {
        columns: [column.accessor('name', { header: 'Name' })],
        rowRenderer: (row, card) => (
          <article data-rank={row.original.rank}>{card}</article>
        ),
        hideExpand: true,
      },
    })
    const cards = Array.from(container.querySelectorAll('article'))
    expect(desktopRanks()[0]).toBe(3)
    expect(cards.map((card) => Number(card.dataset.rank))).toEqual(
      desktopRanks(),
    )
    expect(cards[0].textContent).toBe('NameItem 3')
  })

  it('preserves server-provided row order in both layouts for manual sorting', () => {
    render({
      sorting: [{ id: 'rank', desc: true }],
      manualSorting: true,
      mobile: { rowRenderer: (row) => <article>{row.original.rank}</article> },
    })
    const expected = data.map(({ rank }) => rank)
    expect(desktopRanks()).toEqual(expected)
    expect(
      Array.from(container.querySelectorAll('article'), (card) =>
        Number(card.textContent),
      ),
    ).toEqual(expected)
  })

  it('updates mobile column labels and cells when a filter changes the column definitions', () => {
    function renderFiltered(header: string): void {
      render({
        mobile: {
          columns: [
            {
              accessorKey: 'rank',
              header,
              cell: ({ row }) => `${header} ${row.original.rank}`,
            },
          ],
          rowRenderer: (_row, card) => <article>{card}</article>,
          hideExpand: true,
        },
      })
    }
    renderFiltered('Swap')
    const card = container.querySelector('article')
    expect(card?.textContent).toBe('SwapSwap 1')
    renderFiltered('Add')
    expect(container.querySelector('article')).toBe(card)
    expect(card?.textContent).toBe('AddAdd 1')
  })
})
