/** @vitest-environment jsdom */

import type { SmartPoolsV1 } from '@sushiswap/graph-client/data-api'
import type { DataTable } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { type ComponentProps, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { EvmChainId, SushiSwapProtocol } from 'sushi/evm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { SteerSmartPoolsTable } from './steer-smart-pools-table'

const state = vi.hoisted((): { count: number; tokenSymbols: string[] } => ({
  count: 12,
  tokenSymbols: [],
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

vi.mock('../hooks', () => ({
  useSmartPools: () => ({
    isLoading: false,
    data: Array.from({ length: state.count }, (_, i) => ({
      id: `vault-${i}`,
      vaultLiquidityUSD: i,
      token0: { symbol: i < 2 ? 'AAA' : 'BBB' },
      token1: { symbol: 'CCC' },
      protocol: SushiSwapProtocol.SUSHISWAP_V3,
    })),
  }),
}))
vi.mock('src/app/(networks)/_ui/pools-filters-provider', () => ({
  usePoolFilters: () => ({
    tokenSymbols: state.tokenSymbols,
    protocols: [],
    farmsOnly: false,
  }),
}))
vi.mock('~evm/[chainId]/_ui/apr-hover-card', () => ({
  APRHoverCard: () => null,
}))
vi.mock('~evm/[chainId]/_ui/protocol-badge', () => ({ ProtocolBadge: {} }))

// Exercise the real table's sorting/pagination without rendering unrelated cells.
vi.mock('@sushiswap/ui', async (importOriginal) => {
  const ui = await importOriginal<typeof import('@sushiswap/ui')>()
  return {
    ...ui,
    DataTable: (
      props: ComponentProps<typeof DataTable<SmartPoolsV1[number], unknown>>,
    ) => (
      <ui.DataTable
        {...props}
        linkFormatter={undefined}
        columns={props.columns.map<ColumnDef<SmartPoolsV1[number], unknown>>(
          (column) => ({
            ...column,
            cell: ({ row }) => row.original.id,
          }),
        )}
      />
    ),
  }
})

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  state.count = 12
  state.tokenSymbols = []
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

function renderTable() {
  act(() => root.render(<SteerSmartPoolsTable chainId={EvmChainId.ETHEREUM} />))
}

function rows() {
  return container.querySelectorAll('[testdata-id^="smart-pools-table-vault-"]')
}

it('shows the top three vaults, expands past ten, and collapses again', () => {
  renderTable()
  expect(rows()).toHaveLength(3)
  expect(rows()[0]?.getAttribute('testdata-id')).toBe(
    'smart-pools-table-vault-11',
  )
  const toggle = container.querySelector('button[aria-expanded]')
  expect(toggle?.textContent).toBe('Show all 12 vaults')
  act(() => toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true })))
  expect(rows()).toHaveLength(12)
  expect(toggle?.getAttribute('aria-expanded')).toBe('true')
  expect(toggle?.textContent).toBe('Show less')
  act(() => toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true })))
  expect(rows()).toHaveLength(3)
  expect(toggle?.getAttribute('aria-expanded')).toBe('false')
})

it.each([0, 2, 3])('omits the expand button for %i vaults', (count) => {
  state.count = count
  renderTable()
  expect(rows()).toHaveLength(count)
  expect(container.querySelector('button[aria-expanded]')).toBeNull()
})

it('applies filters before counting and displaying vaults', () => {
  state.tokenSymbols = ['AAA']
  renderTable()
  expect(rows()).toHaveLength(2)
  expect(container.querySelector('button[aria-expanded]')).toBeNull()
})
