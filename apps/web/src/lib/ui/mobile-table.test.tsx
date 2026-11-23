/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  MobileTable,
  type MobileTableProps,
} from '../../../../../packages/ui/src/components/mobile-table/mobile-table'

const push = vi.hoisted(() => vi.fn())
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))
vi.mock('@sushiswap/hooks', async () => ({
  useIsomorphicLayoutEffect: (await import('react')).useLayoutEffect,
}))
vi.mock(
  '../../../../../packages/ui/src/components/mobile-table/mobile-card',
  () => ({ MobileCard: () => <div>Default card</div> }),
)
vi.mock(
  '../../../../../packages/ui/src/components/mobile-table/mobile-card-skeleton',
  () => ({ MobileCardSkeleton: () => <div>Loading</div> }),
)
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const columns = [{ id: 'name', accessorKey: 'name', header: 'Name' }]
const data = Array.from({ length: 100 }, (_, id) => ({
  id,
  name: `Token ${id}`,
}))

describe('MobileTable page scrolling', () => {
  let container: HTMLDivElement
  let root: Root

  function render(
    scrollMode: 'element' | 'window' = 'window',
    isLoading = false,
  ) {
    act(() =>
      root.render(
        <MobileTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          sorting={[]}
          scrollMode={scrollMode}
          rowRenderer={(row) => (
            <span data-row={row.index}>{row.original.name}</span>
          )}
          footer={<button type="button">Load more</button>}
        />,
      ),
    )
  }

  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({
        width: 390,
        height: 80,
        x: 0,
        y: -window.scrollY,
        top: -window.scrollY,
        bottom: 80 - window.scrollY,
        left: 0,
        right: 390,
        toJSON() {},
      }),
    )
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(80)
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(390)
    vi.stubGlobal('scrollY', 0)
    vi.stubGlobal('scrollTo', vi.fn())
    vi.stubGlobal('innerHeight', 640)
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

  it('preserves custom rows and the pagination footer without scrollClassName', () => {
    render('element')
    expect(container.textContent).toContain('Token 0')
    expect(container.textContent).not.toContain('Default card')
    expect(container.querySelector('button')?.textContent).toBe('Load more')
  })

  it('uses the original row for actions and lets custom renderers take precedence', () => {
    const onRowClick = vi.fn()
    const props: MobileTableProps<(typeof data)[number]> = {
      columns,
      data: data.slice(0, 2),
      sorting: [],
      isLoading: false,
      linkFormatter: (token) => `/tokens/${token.id}`,
      getRowLabel: (token) => `View ${token.name}`,
      onRowClick,
    }
    act(() => root.render(<MobileTable {...props} />))
    container.querySelector<HTMLElement>('[aria-label="View Token 1"]')!.click()
    expect(onRowClick).toHaveBeenCalledWith(data[1])
    expect(push).toHaveBeenCalledWith('/tokens/1')

    act(() =>
      root.render(
        <MobileTable
          {...props}
          rowRenderer={(row) => <span>{row.original.name}</span>}
        />,
      ),
    )
    expect(container.querySelector('[role="link"]')).toBeNull()
    expect(container.textContent).toContain('Token 1')
  })

  it('updates the virtual rows when the page scrolls, without a fixed-height container', () => {
    render()
    expect(container.querySelector('[data-row="0"]')).not.toBeNull()
    expect(container.querySelector('[data-row="80"]')).toBeNull()
    act(() => {
      vi.stubGlobal('scrollY', 6_000)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(container.querySelector('[data-row="0"]')).toBeNull()
    expect(container.querySelector('[data-row="80"]')).not.toBeNull()
    expect(container.querySelector('button')?.textContent).toBe('Load more')
    expect(container.querySelectorAll('[data-row]').length).toBeLessThan(
      data.length,
    )
  })

  it('initializes after loading finishes even when the row count stays the same', () => {
    render('window', true)
    expect(container.textContent).toContain('Loading')
    render('window', false)
    expect(container.querySelector('[data-row="0"]')).not.toBeNull()
  })
})
