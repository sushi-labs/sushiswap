/** @vitest-environment jsdom */

import {
  type ColumnDef,
  type Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  type ComponentProps,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  act,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useState,
} from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { TxHashFor } from 'sushi'
import {
  EvmChainId,
  EvmNative,
  NonfungiblePositionManager,
  type SushiSwapV3ChainId,
  getEvmChainById,
} from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type ClaimableFees,
  ClaimableFeesDialog,
} from './claimable-fees-dialog'

const mocks = vi.hoisted(() => ({
  usePositions: vi.fn(),
  sendTransaction:
    vi.fn<
      (request: { chainId: EvmChainId }) => Promise<TxHashFor<EvmChainId>>
    >(),
  useReceipt: vi.fn(),
  waitForReceipt: vi.fn(),
  invalidateQueries: vi.fn(),
  refetchBalances: vi.fn(),
  mobile: false,
  receiptStatus: 'pending' as 'pending' | 'success',
}))

vi.mock('wagmi', () => ({
  useConnection: () => ({
    address: '0x0000000000000000000000000000000000000001',
    isConnecting: false,
    chain: { id: EvmChainId.ETHEREUM },
  }),
  useCall: () => ({ isError: false }),
  usePublicClient: () => ({ waitForTransactionReceipt: mocks.waitForReceipt }),
  useWaitForTransactionReceipt: mocks.useReceipt,
  useSendTransaction: ({
    mutation,
  }: {
    mutation: { onSuccess: (hash: TxHashFor<EvmChainId>) => void }
  }) => {
    const [data, setData] = useState<TxHashFor<EvmChainId>>()
    const [isPending, setPending] = useState(false)
    return {
      data,
      isPending,
      mutateAsync: async (request: { chainId: EvmChainId }) => {
        setPending(true)
        try {
          const hash = await mocks.sendTransaction(request)
          setData(hash)
          mutation.onSuccess(hash)
          return hash
        } finally {
          setPending(false)
        }
      },
    }
  },
}))
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mocks.invalidateQueries }),
}))
vi.mock('@sushiswap/notifications', () => ({
  createErrorToast: vi.fn(),
  createToast: vi.fn(),
}))
vi.mock('src/lib/logger', () => ({ logger: { error: vi.fn() } }))
vi.mock('src/lib/wagmi/errors', () => ({ isUserRejectedError: () => false }))
vi.mock('src/lib/hooks/use-token-amount-dollar-values', () => ({
  useTokenAmountDollarValues: ({ amounts }: { amounts: unknown[] }) =>
    amounts.map(() => 1),
}))
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain: mocks.refetchBalances }),
}))
vi.mock(
  'src/lib/wagmi/hooks/positions/hooks/use-concentrated-liquidity-positions',
  () => ({
    useConcentratedLiquidityPositions: mocks.usePositions,
  }),
)
vi.mock(
  '~evm/_common/ui/price-provider/price-provider/use-multi-chain-prices',
  () => ({
    useMultiChainPrices: () => ({ data: undefined, isLoading: false }),
  }),
)
vi.mock('src/lib/wagmi/systems/checker/connect', () => ({
  Connect: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/network', () => ({
  Network: ({ children }: PropsWithChildren) => children,
}))
vi.mock('./claimable-fees-chain-cell', () => ({
  ClaimableFeesChainCell: ({ original }: Row<ClaimableFees>) =>
    original.chainId,
}))
vi.mock('./claimable-fees-amount-cell', () => ({
  ClaimableFeesAmountCell: () => null,
}))
vi.mock('@sushiswap/ui/icons/check-mark-icon', () => ({
  CheckMarkIcon: () => null,
}))
vi.mock('@sushiswap/ui/icons/failed-mark-icon', () => ({
  FailedMarkIcon: () => null,
}))

vi.mock('@sushiswap/ui', async () => {
  const { buttonVariants } = await import(
    '../../../../../../../../../../../packages/ui/src/components/button'
  )
  const Context = createContext({
    open: false,
    setOpen: (_open: boolean): void => {},
  })

  function Wrapper({ children }: PropsWithChildren): ReactNode {
    return children
  }

  function childWithClick(
    children: ReactNode,
    onClick?: (event: MouseEvent<HTMLElement>) => void,
  ): ReactNode {
    return isValidElement<{
      onClick?: (event: MouseEvent<HTMLElement>) => void
    }>(children)
      ? cloneElement(children, {
          onClick: (event) => {
            children.props.onClick?.(event)
            if (!event.defaultPrevented) onClick?.(event)
          },
        })
      : null
  }

  function Table({
    data,
    columns,
    rowRenderer,
  }: {
    data: ClaimableFees[]
    columns: ColumnDef<ClaimableFees, unknown>[]
    rowRenderer?: (row: Row<ClaimableFees>) => ReactNode
  }): ReactNode {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      autoResetPageIndex: false,
    })
    return table.getRowModel().rows.map((row) => (
      <div key={row.id} data-chain={row.original.chainId}>
        {rowRenderer
          ? rowRenderer(row)
          : row
              .getVisibleCells()
              .map((cell) => (
                <div key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
      </div>
    ))
  }

  return {
    buttonVariants,
    Dialog: ({
      children,
      open,
      onOpenChange,
    }: PropsWithChildren<{
      open?: boolean
      onOpenChange?: (open: boolean) => void
    }>) => {
      const [localOpen, setLocalOpen] = useState(false)
      return (
        <Context.Provider
          value={{
            open: open ?? localOpen,
            setOpen: onOpenChange ?? setLocalOpen,
          }}
        >
          {children}
        </Context.Provider>
      )
    },
    DialogTrigger: ({
      children,
      asChild,
    }: PropsWithChildren<{ asChild?: boolean }>) => {
      const { setOpen } = useContext(Context)
      return asChild ? (
        childWithClick(children, () => setOpen(true))
      ) : (
        <button type="button" onClick={() => setOpen(true)}>
          {children}
        </button>
      )
    },
    DialogClose: ({
      children,
      asChild,
    }: PropsWithChildren<{ asChild?: boolean }>) => {
      const { setOpen } = useContext(Context)
      function close(event: MouseEvent<HTMLElement>): void {
        if (!event.defaultPrevented) setOpen(false)
      }
      return asChild ? (
        childWithClick(children, close)
      ) : (
        <button type="button" onClick={close}>
          {children}
        </button>
      )
    },
    DialogContent: ({ children }: PropsWithChildren) => {
      const { open, setOpen } = useContext(Context)
      return open ? (
        <div role="dialog">
          <button type="button" onClick={() => setOpen(false)}>
            Dismiss
          </button>
          {children}
        </div>
      ) : null
    },
    Button: ({
      children,
      onClick,
      asChild,
      type,
    }: PropsWithChildren<{
      onClick?: (event: MouseEvent<HTMLElement>) => void
      asChild?: boolean
      type?: 'button' | 'submit' | 'reset'
    }>) =>
      asChild ? (
        childWithClick(<div>{children}</div>, onClick)
      ) : (
        <button type={type} onClick={onClick}>
          {children}
        </button>
      ),
    LinkInternal: ({
      children,
      href,
      className,
      onClick,
    }: ComponentProps<'a'>) => (
      <a
        href={href}
        className={className}
        onClick={(event) => {
          onClick?.(event)
          event.preventDefault()
        }}
      >
        {children}
      </a>
    ),
    DataTableVirtual: (props: ComponentProps<typeof Table>) => (
      <div data-layout="desktop">
        <Table {...props} />
      </div>
    ),
    MobileTable: (props: ComponentProps<typeof Table>) => (
      <div data-layout="mobile">
        <Table {...props} />
      </div>
    ),
    useBreakpoint: () => ({ isMd: !mocks.mobile }),
    DialogDescription: Wrapper,
    DialogFooter: Wrapper,
    DialogHeader: Wrapper,
    DialogTitle: Wrapper,
    Dots: Wrapper,
    Currency: { Icon: () => null },
    Switch: () => null,
    Loader: () => null,
    SkeletonBox: () => null,
    SkeletonCircle: () => null,
    SkeletonText: () => null,
    classNames: (...values: unknown[]) => values.filter(Boolean).join(' '),
  }
})

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const transactionHash =
  '0x1111111111111111111111111111111111111111111111111111111111111111'
const successMessage = 'You successfully claimed fees from all your positions'

function position(chainId: SushiSwapV3ChainId, fees = 1n) {
  const token = EvmNative.fromChainId(chainId).wrap()
  return {
    chainId,
    tokenId: 1n,
    fees: [fees, 0n],
    token0: token,
    token1: token,
    pool: { token0: token, token1: token },
  }
}

describe.each(['desktop', 'mobile'])('ClaimableFeesDialog (%s)', (layout) => {
  let container: HTMLDivElement
  let root: Root

  function render(
    chains: SushiSwapV3ChainId[],
    claimed?: SushiSwapV3ChainId,
  ): void {
    mocks.usePositions.mockReturnValue({
      data: chains.map((chainId) =>
        position(chainId, chainId === claimed ? 0n : 1n),
      ),
      isInitialLoading: false,
    })
    act(() => root.render(<ClaimableFeesDialog />))
  }

  function click(label: string, parent: ParentNode = container): void {
    const button = Array.from(parent.querySelectorAll('button')).find(
      (element) => element.textContent === label,
    )
    if (!button) throw new Error(`Missing button: ${label}`)
    act(() => button.click())
  }

  function row(chainId: SushiSwapV3ChainId): Element {
    const element = container.querySelector(`[data-chain="${chainId}"]`)
    if (!element) throw new Error(`Missing row: ${chainId}`)
    return element
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.sendTransaction.mockResolvedValue(transactionHash)
    mocks.waitForReceipt.mockResolvedValue({ status: 'success' })
    mocks.useReceipt.mockImplementation(
      ({ hash }: { hash?: TxHashFor<EvmChainId> }) => ({
        status: hash ? mocks.receiptStatus : 'pending',
      }),
    )
    vi.spyOn(
      NonfungiblePositionManager,
      'collectCallParameters',
    ).mockReturnValue({ calldata: '0x', value: '0x00' })
    mocks.mobile = layout === 'mobile'
    mocks.receiptStatus = 'pending'
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
  })

  it.each([
    {
      chains: [EvmChainId.ETHEREUM, EvmChainId.POLYGON],
      claimed: EvmChainId.ETHEREUM,
    },
    {
      chains: [EvmChainId.ETHEREUM, EvmChainId.POLYGON],
      claimed: EvmChainId.POLYGON,
    },
    { chains: [EvmChainId.ETHEREUM], claimed: EvmChainId.ETHEREUM },
  ])(
    'preserves confirmation after chain $claimed disappears from $chains',
    async ({ chains, claimed }) => {
      render(chains)
      click('Claim Fees')
      click('Claim Fees', row(claimed))
      await act(async () => click('Claim'))
      const transactionUrl = container
        .querySelector('a[target="_blank"]')
        ?.getAttribute('href')
      expect(transactionUrl).toContain('0x111111')

      render(chains, claimed)
      expect(container.querySelector(`[data-chain="${claimed}"]`)).toBeNull()
      expect(
        container.querySelector('a[target="_blank"]')?.getAttribute('href'),
      ).toBe(transactionUrl)

      mocks.receiptStatus = 'success'
      render(chains, claimed)
      expect(mocks.useReceipt).toHaveBeenLastCalledWith({
        chainId: claimed,
        hash: transactionHash,
      })
      expect(container.textContent).toContain(successMessage)
      click('Close')
      expect(container.textContent).not.toContain(successMessage)

      render(chains)
      const nextChain = chains.find((chainId) => chainId !== claimed) ?? claimed
      click('Claim Fees', row(nextChain))
      expect(container.textContent).toContain(
        `On ${getEvmChainById(nextChain).name}`,
      )
      expect(mocks.useReceipt).toHaveBeenLastCalledWith({
        chainId: nextChain,
        hash: undefined,
      })
    },
  )

  it('keeps the next review open when a dismissed wallet request finishes', async () => {
    let resolveSend: ((hash: TxHashFor<EvmChainId>) => void) | undefined
    mocks.sendTransaction.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveSend = resolve
      }),
    )
    render([EvmChainId.ETHEREUM, EvmChainId.POLYGON])
    click('Claim Fees')
    click('Claim Fees', row(EvmChainId.ETHEREUM))
    click('Claim')
    expect(mocks.sendTransaction).toHaveBeenCalledOnce()
    const review = container.querySelectorAll('[role="dialog"]')[1]
    click('Dismiss', review)
    click('Claim Fees', row(EvmChainId.POLYGON))

    await act(async () => resolveSend?.(transactionHash))
    expect(container.textContent).toContain('Claim V3 Fees')
    expect(container.textContent).toContain(
      `On ${getEvmChainById(EvmChainId.POLYGON).name}`,
    )
    expect(container.textContent).not.toContain('Confirming')
    expect(mocks.useReceipt).toHaveBeenLastCalledWith({
      chainId: EvmChainId.POLYGON,
      hash: undefined,
    })
  })

  it('switches mounted tables while the fee list stays open', () => {
    const chains = [EvmChainId.ETHEREUM, EvmChainId.POLYGON]
    render(chains)
    click('Claim Fees')

    for (const mobile of [mocks.mobile, !mocks.mobile, mocks.mobile]) {
      mocks.mobile = mobile
      render(chains)
      expect(container.querySelectorAll('[role="dialog"]')).toHaveLength(1)
      expect(container.querySelectorAll('[data-layout]')).toHaveLength(1)
      const table = container.querySelector(
        `[data-layout="${mobile ? 'mobile' : 'desktop'}"]`,
      )
      expect(table?.querySelectorAll('[data-chain]')).toHaveLength(2)
      expect(row(EvmChainId.ETHEREUM)).toBeTruthy()
      expect(row(EvmChainId.POLYGON)).toBeTruthy()
    }
  })

  it('preserves the active claim when the table layout changes', async () => {
    const chains = [EvmChainId.ETHEREUM, EvmChainId.POLYGON]
    render(chains)
    click('Claim Fees')
    click('Claim Fees', row(EvmChainId.ETHEREUM))
    await act(async () => click('Claim'))
    const transactionUrl = container
      .querySelector('a[target="_blank"]')
      ?.getAttribute('href')
    expect(transactionUrl).toContain('0x111111')

    mocks.mobile = !mocks.mobile
    render(chains)
    expect(container.textContent).toContain('Confirming')
    expect(
      container.querySelector('a[target="_blank"]')?.getAttribute('href'),
    ).toBe(transactionUrl)
    expect(mocks.useReceipt).toHaveBeenLastCalledWith({
      chainId: EvmChainId.ETHEREUM,
      hash: transactionHash,
    })

    mocks.receiptStatus = 'success'
    mocks.mobile = !mocks.mobile
    render(chains, EvmChainId.ETHEREUM)
    expect(container.textContent).toContain(successMessage)
    expect(mocks.useReceipt).toHaveBeenLastCalledWith({
      chainId: EvmChainId.ETHEREUM,
      hash: transactionHash,
    })
  })

  it.each([
    { chainId: EvmChainId.ETHEREUM, destination: '/ethereum/pool?tab=v3' },
    { chainId: EvmChainId.POLYGON, destination: '/polygon/pool?tab=v3' },
  ])(
    'makes the full View Positions link clickable and closes before navigating to $destination',
    ({ chainId, destination }) => {
      window.history.replaceState(null, '', '/ethereum/pool?tab=v3')
      render([chainId])
      click('Claim Fees')
      const link = row(chainId).querySelector('a')
      if (!link) throw new Error('Missing View Positions link')
      expect(link.getAttribute('href')).toBe(destination)
      expect([...link.classList]).toEqual(
        expect.arrayContaining(['w-full', 'h-[36px]', 'px-3', 'bg-secondary']),
      )
      expect(link.closest('button')).toBeNull()
      expect(link.querySelector('a, button')).toBeNull()
      act(() => link.click())
      expect(container.querySelector('[role="dialog"]')).toBeNull()
    },
  )
})
