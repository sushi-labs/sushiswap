/** @vitest-environment jsdom */

import type { V4Position } from '@sushiswap/graph-client/data-api'
import { FormattedNumber } from '@sushiswap/ui'
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
  TableState,
} from '@tanstack/react-table'
import React, { type ReactNode, act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { Bound } from 'src/lib/constants'
import { getTickLimits } from 'src/lib/pool/cl'
import { Price } from 'sushi'
import { EvmChainId, EvmToken } from 'sushi/evm'
import { zeroAddress, zeroHash } from 'viem'
import { expect, it, vi } from 'vitest'
import { V4PositionsTable } from './v4-positions-table'

const state = vi.hoisted(() => ({
  isRestoring: true,
  isPending: false,
  isLoading: false,
  hasResults: false,
  renderCells: false,
  poolLoaded: true,
  interactive: false,
}))
const interactivePositions: V4Position[] = []
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const currency0 = new EvmToken({
  chainId: EvmChainId.ROBINHOOD,
  address: '0x0000000000000000000000000000000000000001',
  decimals: 18,
  symbol: 'AAA',
  name: 'Token A',
})
const currency1 = new EvmToken({
  chainId: EvmChainId.ROBINHOOD,
  address: '0x0000000000000000000000000000000000000002',
  decimals: 6,
  symbol: 'BBB',
  name: 'Token B',
})
const position: V4Position = {
  id: 'position',
  chainId: EvmChainId.ROBINHOOD,
  tokenId: 123n,
  positionManager: zeroAddress,
  holder: zeroAddress,
  tickLower: -60,
  tickUpper: 60,
  liquidity: 1n,
  amount0: 0n,
  amount1: 0n,
  amountUSD: 10,
  inRange: true,
  createdAt: 0,
  pendingFees: { amount0: 10n ** 18n, amount1: 2n * 10n ** 6n },
  pool: {
    poolId: zeroHash,
    poolManager: zeroAddress,
    currency0: currency0.address,
    currency1: currency1.address,
    hooks: zeroAddress,
    parameters: zeroHash,
    tickSpacing: 60,
    fee: { __typename: 'TerminalStaticFee', rate: 3000 },
  },
}

vi.mock('~evm/_common/ui/price-provider/price-provider/use-prices', () => ({
  usePrices: () => ({
    data: new Map([
      [currency0.address, { toFixed: () => '3' }],
      [currency1.address, { toFixed: () => '4' }],
    ]),
  }),
}))

vi.mock('src/lib/wallet', () => ({ useWalletConnection: () => state }))
vi.mock('wagmi', () => ({ useConnection: () => ({ address: undefined }) }))
vi.mock('src/lib/pool/v4', () => ({
  useV4PoolById: () => ({
    data: state.poolLoaded
      ? { currency0Price: Price.fromHuman(currency0, currency1, '2') }
      : undefined,
  }),
  useV4Positions: () => ({
    data: state.interactive
      ? interactivePositions
      : state.hasResults
        ? [position]
        : [],
    isLoading: state.isLoading,
  }),
}))
vi.mock('src/lib/wagmi/hooks/tokens/use-currency-with-cache', () => ({
  useCurrencyWithCache: ({ address }: { address: string }) => ({
    data: address === currency0.address ? currency0 : currency1,
  }),
}))
vi.mock('@sushiswap/ui', async (importOriginal) => {
  const original = await importOriginal<typeof import('@sushiswap/ui')>()
  return {
    ...original,
    DataTable: (props: {
      loading: boolean
      data: V4Position[]
      state?: Partial<TableState>
      onSortingChange?: OnChangeFn<SortingState>
      onPaginationChange?: OnChangeFn<PaginationState>
      columns: {
        id: string
        cell: (props: { row: { original: V4Position } }) => ReactNode
      }[]
    }) => {
      if (state.interactive) return <original.DataTable {...props} />
      const { loading, data, columns } = props
      return state.renderCells ? (
        <div>
          {data.map((original) =>
            columns.map((column) => (
              <div key={column.id} data-column={column.id}>
                {column.cell({ row: { original } })}
              </div>
            )),
          )}
        </div>
      ) : (
        <span>
          {loading
            ? 'Loading positions'
            : data.length
              ? 'Position results'
              : 'No results'}
        </span>
      )
    },
  }
})

it('keeps positions loading through wallet restoration and the initial fetch', () => {
  function render(): string {
    return renderToStaticMarkup(
      <V4PositionsTable chainId={EvmChainId.ROBINHOOD} />,
    )
  }

  expect(render()).toContain('Loading positions')
  state.isRestoring = false
  state.isPending = true
  expect(render()).toContain('Loading positions')
  state.isPending = false
  state.isLoading = true
  expect(render()).toContain('Loading positions')
  state.isLoading = false
  expect(render()).toContain('No results')
  state.hasResults = true
  expect(render()).toContain('Position results')
})

it('renders v3-style metadata, the current price, and summed dollar fees', () => {
  state.isRestoring = false
  state.hasResults = true
  state.renderCells = true
  const markup = renderToStaticMarkup(
    <V4PositionsTable chainId={EvmChainId.ROBINHOOD} />,
  )
  expect(markup).toContain('V4')
  expect(markup).toContain('0.3%')
  expect(markup).not.toContain('#123')
  expect(markup).toContain('Current:')
  expect(markup).toContain('BBB per AAA')
  expect(markup).toContain('Invert price range')
  expect(markup).toContain('$11.00')
})

it('renders dynamic fees, full ranges, and unavailable fees', () => {
  state.renderCells = true
  state.hasResults = true
  position.pool.fee = { __typename: 'TerminalDynamicFee' }
  const limits = getTickLimits(position.pool.tickSpacing)
  const lower = limits[Bound.LOWER]
  const upper = limits[Bound.UPPER]
  if (lower === undefined || upper === undefined)
    throw new Error('Missing tick limits')
  position.tickLower = lower
  position.tickUpper = upper
  position.pendingFees = null
  const markup = renderToStaticMarkup(
    <V4PositionsTable chainId={EvmChainId.ROBINHOOD} />,
  )
  expect(markup).toContain('Dynamic')
  expect(markup).toContain('∞')
  expect(markup).toContain('data-column="unclaimed"><span>-</span>')
})

it('shows one extra decimal for table prices without changing the default', () => {
  expect(
    renderToStaticMarkup(
      <FormattedNumber number="0.010964" maxDecimalPlaces={3} />,
    ),
  ).toBe('<span>0.011</span>')
  expect(renderToStaticMarkup(<FormattedNumber number="0.010964" />)).toBe(
    '<span>0.01</span>',
  )
})

it('renders the indexed pool fee before the current pool price loads', () => {
  state.renderCells = true
  state.hasResults = true
  state.poolLoaded = false
  position.pool.fee = { __typename: 'TerminalStaticFee', rate: 500 }
  const markup = renderToStaticMarkup(
    <V4PositionsTable chainId={EvmChainId.ROBINHOOD} />,
  )
  expect(markup).toContain('0.05%')
  position.pool.fee = { __typename: 'TerminalDynamicFee' }
  expect(
    renderToStaticMarkup(<V4PositionsTable chainId={EvmChainId.ROBINHOOD} />),
  ).toContain('Dynamic')
})

it.each(['sorting', 'filtering'])(
  'updates the positions table when %s changes',
  (change) => {
    state.interactive = true
    state.isRestoring = false
    state.isPending = false
    state.isLoading = false
    interactivePositions.splice(
      0,
      interactivePositions.length,
      ...Array.from({ length: 15 }, (_, index) => ({
        ...position,
        id: `position-${index}`,
        tokenId: BigInt(index),
        amountUSD: index,
        liquidity: index < 2 ? 1n : 0n,
      })),
    )
    const container = document.createElement('div')
    const root = createRoot(container)
    function render(hideClosedPositions: boolean): void {
      act(() =>
        root.render(
          <V4PositionsTable
            chainId={EvmChainId.ROBINHOOD}
            hideClosedPositions={hideClosedPositions}
          />,
        ),
      )
    }
    try {
      render(false)
      if (change === 'sorting') {
        const header = [...container.querySelectorAll('th')].find((node) =>
          node.textContent?.includes('Position Size'),
        )
        const button = header?.querySelector('button')
        if (!button) throw new Error('Missing sort button')
        act(() => button.click())
        expect(container.querySelector('tbody tr')?.textContent).toContain(
          '$0.00',
        )
      } else {
        const next = [...container.querySelectorAll('button')].find((button) =>
          button.textContent?.includes('Go to next page'),
        )
        if (!next) throw new Error('Missing next page button')
        act(() => next.click())
        expect(container.textContent).toContain('Page 2 of 2')
        render(true)
        expect(container.textContent).toContain('Page 1 of 1')
        expect(container.textContent).not.toContain('No results')
      }
    } finally {
      act(() => root.unmount())
      state.interactive = false
    }
  },
)
