/** @vitest-environment jsdom */

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type ComponentProps, type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SubAccountsTable } from './sub-accounts-table'

const mocks = vi.hoisted(() => ({
  master: '0x1111111111111111111111111111111111111111',
  sub: '0x2222222222222222222222222222222222222222',
  connected: true,
  unified: false,
  loading: false,
  failed: false,
  isLg: true,
  setActiveAccount: vi.fn(),
  push: vi.fn(),
  copy: vi.fn(),
  refetch: vi.fn(),
  spotState: vi.fn(),
  perpsState: vi.fn(),
}))

vi.mock('src/lib/wallet', () => ({
  useAccount: () => (mocks.connected ? mocks.master : undefined),
}))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('@sushiswap/hooks', () => ({
  useCopyClipboard: () => [false, mocks.copy],
}))
vi.mock('@sushiswap/ui', () => ({
  Button: ({ children, onClick }: ComponentProps<'button'>) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  DataTableVirtual: <T,>(props: TestAccountTableProps<T>) => (
    <TestAccountTable {...props} label="desktop" />
  ),
  useBreakpoint: () => ({ isLg: mocks.isLg }),
  SkeletonText: () => <span>Loading...</span>,
  classNames: (...classes: (string | undefined)[]) =>
    classes.filter(Boolean).join(' '),
}))
vi.mock('../../_ui/trade-tables/_common', () => ({
  MobileTable: <T,>(props: TestAccountTableProps<T>) => (
    <TestAccountTable {...props} label="mobile" />
  ),
  tableRowClassName: '',
}))
vi.mock('../../_ui/trade-tables/_common/mobile-table', () => ({
  MobileTable: <T,>(props: TestAccountTableProps<T>) => (
    <TestAccountTable {...props} label="mobile" />
  ),
}))
vi.mock('../../_ui/_common/perps-card', () => ({
  PerpsCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))
vi.mock('../../active-account-provider', () => ({
  useActiveAccountState: () => ({
    state: { activeAddress: mocks.sub },
    mutate: { setActiveAccount: mocks.setActiveAccount },
  }),
}))
vi.mock('../../_ui/asset-selector', () => ({
  useAssetListState: () => ({ state: { assetListQuery: { data: new Map() } } }),
}))
vi.mock('src/lib/perps/info/use-all-perp-metas', () => ({
  useAllPerpMetas: () => ({ data: [] }),
}))
vi.mock('src/lib/perps/info/use-user-abstraction', () => ({
  useUserAbstraction: () => ({
    data: mocks.unified ? 'unifiedAccount' : 'disabled',
    isLoading: false,
  }),
}))
vi.mock('src/lib/perps/info/use-spot-clearinghouse-state', () => ({
  useSpotClearinghouseState: (args: unknown) => {
    mocks.spotState(args)
    return {
      data: {
        balances: [
          {
            coin: 'USDC',
            token: 0,
            total: '174.17',
            hold: '10',
            entryNtl: '0',
          },
          { coin: 'ZERO', token: 9999, total: '0', hold: '0', entryNtl: '0' },
        ],
      },
      isLoading: false,
    }
  },
}))
vi.mock('src/lib/perps/subscription/use-all-dex-clearinghouse-state', () => ({
  useAllDexClearinghouseState: (args: unknown) => {
    mocks.perpsState(args)
    return { data: { clearinghouseStates: [] }, isLoading: false }
  },
}))
vi.mock('src/lib/perps/info/use-sub-accounts', () => ({
  useSubAccounts: () => ({
    data:
      mocks.loading || mocks.failed
        ? undefined
        : [
            {
              name: 'Trading Sub',
              subAccountUser: mocks.sub,
              master: mocks.master,
              dexToClearinghouseState: [],
              spotState: {
                balances: [
                  {
                    coin: 'USDC',
                    token: 0,
                    total: '14.92',
                    hold: '0',
                    entryNtl: '0',
                  },
                ],
              },
            },
          ],
    isLoading: mocks.loading,
    isSuccess: !mocks.loading && !mocks.failed,
    isError: mocks.failed,
    refetch: mocks.refetch,
  }),
}))
vi.mock('./rename-sub-account-dialog', () => ({
  RenameSubAccountDialog: ({
    subAccount,
  }: { subAccount: { name: string; subAccountUser: string } }) => (
    <button
      type="button"
      aria-label={`Rename ${subAccount.name}`}
      data-rename={subAccount.subAccountUser}
    >
      Rename
    </button>
  ),
}))
vi.mock('./sub-account-transfer-dialog', () => ({
  SubAccountTransferDialog: ({
    subAccount,
    masterAddress,
  }: { subAccount: { subAccountUser: string }; masterAddress: string }) => (
    <button
      type="button"
      data-transfer={subAccount.subAccountUser}
      data-master={masterAddress}
    >
      Transfer
    </button>
  ),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

type TestAccountTableProps<T> = {
  data: T[]
  columns: ColumnDef<T, unknown>[]
}

function TestAccountTable<T>({
  data,
  columns,
  label,
}: TestAccountTableProps<T> & { label: string }): ReactNode {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <table data-table-component={label}>
      <thead>
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} data-column={cell.column.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

describe('SubAccountsTable', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.connected = true
    mocks.unified = false
    mocks.loading = false
    mocks.failed = false
    mocks.isLg = true
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function render(): void {
    act(() => root.render(<SubAccountsTable />))
  }

  it('lists the connected master first even while trading from a sub-account', () => {
    render()
    expect(
      container.querySelector('[data-table-component="desktop"]'),
    ).not.toBeNull()
    const rows = container.querySelectorAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0].textContent).toContain('Master Account')
    expect(rows[1].textContent).toContain('Trading Sub')
    expect(rows[0].querySelector('[data-transfer]')).toBeNull()
    expect(rows[0].querySelector('[data-rename]')).toBeNull()
    expect(
      rows[1].querySelector('[data-transfer]')?.getAttribute('data-master'),
    ).toBe(mocks.master)
    expect(
      rows[1].querySelector('[data-transfer]')?.getAttribute('data-transfer'),
    ).toBe(mocks.sub)
    expect(
      rows[1].querySelector('[data-rename]')?.getAttribute('data-rename'),
    ).toBe(mocks.sub)
    expect(mocks.spotState).toHaveBeenCalledWith({ address: mocks.master })
    expect(mocks.perpsState).toHaveBeenCalledWith({ address: mocks.master })
  })

  it('calculates the visible spot equity from the actual USDC balances', () => {
    render()
    const rows = container.querySelectorAll('tbody tr')
    expect(rows[0].querySelectorAll('td')[3].textContent).toBe('$174.17')
    expect(rows[1].querySelectorAll('td')[3].textContent).toBe('$14.92')
  })

  it('uses the shared mobile table with master first and working account actions', () => {
    mocks.isLg = false
    render()
    expect(
      container.querySelector('[data-table-component="mobile"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('[data-table-component="desktop"]'),
    ).toBeNull()
    const rows = container.querySelectorAll('tbody tr')
    expect(rows[0].textContent).toContain('Master Account')
    expect(rows[0].textContent).toContain('$174.17')
    expect(rows[1].textContent).toContain('Trading Sub')
    expect(
      rows[1].querySelector('[data-transfer]')?.getAttribute('data-transfer'),
    ).toBe(mocks.sub)
    expect(
      rows[1].querySelector('[data-rename]')?.getAttribute('data-rename'),
    ).toBe(mocks.sub)
    const trade = Array.from(rows[1].querySelectorAll('button')).find(
      (button) => button.textContent === 'Trade',
    )
    act(() => trade?.click())
    expect(mocks.setActiveAccount).toHaveBeenCalledWith(
      mocks.sub,
      'sub',
      'Trading Sub',
    )
    expect(mocks.push).toHaveBeenCalledWith('/perps')
  })

  it.each([
    [0, 'master', 'Master Account'],
    [1, 'sub', 'Trading Sub'],
  ] as const)(
    'selects account %i before navigating to trade',
    (index, type, name) => {
      render()
      const row = container.querySelectorAll('tbody tr')[index]
      const trade = Array.from(row.querySelectorAll('button')).find(
        (button) => button.textContent === 'Trade',
      )
      act(() => trade?.click())
      expect(mocks.setActiveAccount).toHaveBeenCalledWith(
        index === 0 ? mocks.master : mocks.sub,
        type,
        name,
      )
      expect(mocks.push).toHaveBeenCalledWith('/perps')
      expect(mocks.setActiveAccount.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.push.mock.invocationCallOrder[0],
      )
    },
  )

  it('shows zero classic perps equity and suppresses it for unified accounts', () => {
    render()
    expect(
      container.querySelectorAll('tbody tr')[0].querySelectorAll('td')[2]
        .textContent,
    ).toContain('$0.00')
    mocks.unified = true
    render()
    expect(
      container.querySelectorAll('tbody tr')[0].querySelectorAll('td')[2]
        .textContent,
    ).toContain('--')
    expect(
      container.querySelectorAll('tbody tr')[0].querySelectorAll('td')[3]
        .textContent,
    ).toContain('$174.17')
  })

  it('copies the full row address', () => {
    render()
    act(() =>
      container
        .querySelector<HTMLButtonElement>(
          '[aria-label="Copy Trading Sub address"]',
        )
        ?.click(),
    )
    expect(mocks.copy).toHaveBeenCalledWith(mocks.sub)
  })

  it('handles disconnected, loading and failed account lists explicitly', () => {
    mocks.connected = false
    render()
    expect(container.textContent).toContain('Connect your wallet')
    expect(container.querySelector('table')).toBeNull()
    mocks.connected = true
    mocks.loading = true
    render()
    expect(container.querySelector('[role="status"]')?.textContent).toContain(
      'Loading sub-accounts',
    )
    mocks.loading = false
    mocks.failed = true
    render()
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to load sub-accounts',
    )
    const retry = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Retry',
    )
    act(() => retry?.click())
    expect(mocks.refetch).toHaveBeenCalledOnce()
  })
})
