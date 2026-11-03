/** @vitest-environment jsdom */

import { type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { WalletNamespace } from 'src/lib/wallet/types'
import { Percent } from 'sushi'
import {
  EvmChainId,
  EvmToken,
  NonfungiblePositionManager,
  Position,
  SushiSwapV3Pool,
  TickMath,
  USDG,
  WETH9,
} from 'sushi/evm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { AddSectionReviewModalConcentrated } from './add-section-review-modal-concentrated'

const mocks = vi.hoisted(() => ({
  connected: true,
  otherWallet: false,
  send: vi.fn(),
  simulate: vi.fn(() => ({ isError: false })),
}))
vi.mock('wagmi', () => ({
  useConnection: () => ({
    address: mocks.connected
      ? '0x0000000000000000000000000000000000000001'
      : undefined,
    chain: mocks.connected ? { id: EvmChainId.ROBINHOOD } : undefined,
  }),
  useCall: mocks.simulate,
  usePublicClient: () => ({}),
  useSendTransaction: () => ({ mutateAsync: mocks.send, isPending: false }),
  useWaitForTransactionReceipt: () => ({ status: 'pending' }),
}))
vi.mock('src/lib/wallet', () => ({
  useWalletConnection: (namespace?: WalletNamespace) => ({
    isConnected: mocks.connected || (!namespace && mocks.otherWallet),
    isPending: false,
    isRestoring: false,
  }),
}))
vi.mock('src/lib/wagmi/components/connect-button', () => ({
  ConnectButton: ({ children }: { children: ReactNode }) => (
    <button type="button">{children}</button>
  ),
}))
vi.mock('src/lib/wagmi/systems/checker', async () => {
  const { Connect } = await import('src/lib/wagmi/systems/checker/connect')
  return { Checker: { Connect } }
})
vi.mock('src/lib/hooks/use-slippage-tolerance', () => ({
  useSlippageTolerance: () => [
    new Percent({ numerator: 50, denominator: 10000 }),
  ],
}))
vi.mock('src/lib/hooks/use-token-amount-dollar-values', () => ({
  useTokenAmountDollarValues: () => [0, 0],
}))
vi.mock('src/lib/wagmi/hooks/utils/hooks/use-transaction-deadline', () => ({
  useTransactionDeadline: () => ({ data: 1n }),
  getDefaultTTL: () => 30n,
}))
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain: vi.fn() }),
}))
vi.mock('src/lib/transaction-dialog', () => ({
  DialogProvider: ({ children }: { children: ReactNode }) => children,
  DialogReview: ({
    children,
  }: { children(props: { confirm(): void }): ReactNode }) =>
    children({ confirm: vi.fn() }),
  DialogConfirm: () => null,
}))
vi.mock('@sushiswap/ui', async (importOriginal) => {
  const original = await importOriginal<typeof import('@sushiswap/ui')>()
  function Container({ children }: { children: ReactNode }): ReactNode {
    return <div>{children}</div>
  }
  return {
    ...original,
    DialogContent: Container,
    DialogHeader: Container,
    DialogFooter: Container,
    DialogTitle: Container,
    DialogDescription: Container,
    SettingsOverlay: Container,
  }
})

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root
let container: HTMLDivElement
const coin = new EvmToken({
  chainId: EvmChainId.ROBINHOOD,
  address: '0x6330d8c3178a418788df01a47479c0ce7ccf450b',
  decimals: 18,
  symbol: 'COIN',
  name: 'Coinbase',
})
const extremePool = new SushiSwapV3Pool(
  USDG[EvmChainId.ROBINHOOD],
  coin,
  500,
  TickMath.MAX_SQRT_RATIO - 1n,
  0n,
  TickMath.MAX_TICK - 1,
)

function fullRangePosition(amount1: bigint): Position {
  return Position.fromAmount1({
    pool: extremePool,
    tickLower: -887270,
    tickUpper: 887270,
    amount1,
  })
}

async function render({
  position,
  existingPosition,
}: {
  position?: Position
  existingPosition?: Position
} = {}): Promise<void> {
  await act(async () => {
    root.render(
      <AddSectionReviewModalConcentrated
        chainId={position?.pool.chainId ?? EvmChainId.ETHEREUM}
        feeAmount={500}
        token0={position?.pool.token0 ?? WETH9[EvmChainId.ETHEREUM]}
        token1={position?.pool.token1}
        input0={undefined}
        input1={undefined}
        existingPosition={existingPosition}
        position={position}
        price={undefined}
        pricesAtTicks={{}}
        ticksAtLimit={{}}
        noLiquidity={!position}
        tokenId={existingPosition ? '1' : undefined}
        onSuccess={vi.fn()}
      >
        Preview
      </AddSectionReviewModalConcentrated>,
    )
  })
}
beforeEach(() => {
  mocks.connected = true
  mocks.otherWallet = false
  mocks.send.mockReset()
  mocks.simulate.mockClear()
  container = document.createElement('div')
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  vi.restoreAllMocks()
})

it.each([false, true])(
  'requires an EVM wallet after disconnecting during review, other wallet=%s',
  async (otherWallet) => {
    await render()
    expect(container.textContent).toContain('Add Liquidity')
    mocks.connected = false
    mocks.otherWallet = otherWallet
    await render()
    expect(container.textContent).toContain('Connect EVM Wallet')
    expect(
      container.querySelector('[testdata-id="confirm-add-liquidity-button"]'),
    ).toBeNull()
    expect(mocks.send).not.toHaveBeenCalled()
  },
)

it.each([false, true])(
  'blocks a nonzero deposit that rounds to zero liquidity, existing position=%s',
  async (increase) => {
    const position = fullRangePosition(10n ** 18n)
    expect(position.liquidity).toBe(0n)
    const prepare = vi.spyOn(NonfungiblePositionManager, 'addCallParameters')

    await render({
      position,
      existingPosition: increase
        ? fullRangePosition(100n * 10n ** 18n)
        : undefined,
    })

    expect(prepare).not.toHaveBeenCalled()
    expect(mocks.simulate).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: { enabled: false } }),
    )
    expect(container.textContent).toContain(
      'This deposit rounds to zero liquidity. Adjust the amount or price range.',
    )
    const confirm = container.querySelector<HTMLButtonElement>(
      '[testdata-id="confirm-add-liquidity-button"]',
    )
    expect(confirm?.disabled).toBe(true)
    act(() => confirm?.click())
    expect(mocks.send).not.toHaveBeenCalled()
  },
)

it.each([false, true])(
  'prepares a valid single-sided position after correcting the range, existing position=%s',
  async (increase) => {
    const zeroPosition = fullRangePosition(10n ** 18n)
    const position = Position.fromAmount1({
      pool: extremePool,
      tickLower: 220520,
      tickUpper: 226210,
      amount1: 10n ** 18n,
    })
    expect(position.liquidity).toBeGreaterThan(0n)
    expect(position.amount0.amount).toBe(0n)
    const existingPosition = increase ? position : undefined
    const prepare = vi.spyOn(NonfungiblePositionManager, 'addCallParameters')

    await render({ position: zeroPosition, existingPosition })
    await render({ position, existingPosition })

    expect(prepare).toHaveBeenCalledTimes(1)
    expect(prepare).toHaveBeenCalledWith(
      position,
      expect.objectContaining(
        increase
          ? { tokenId: '1' }
          : { recipient: '0x0000000000000000000000000000000000000001' },
      ),
    )
    expect(mocks.simulate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.stringMatching(/^0x/),
        query: { enabled: true },
      }),
    )
    expect(container.textContent).not.toContain('rounds to zero liquidity')
    expect(
      container.querySelector<HTMLButtonElement>(
        '[testdata-id="confirm-add-liquidity-button"]',
      )?.disabled,
    ).toBe(false)
  },
)

it('continues preparing two-sided deposits into an empty pool at a usable price', async () => {
  const pool = new SushiSwapV3Pool(
    extremePool.token0,
    extremePool.token1,
    500,
    TickMath.getSqrtRatioAtTick(224752),
    0n,
    224752,
  )
  const position = Position.fromAmount1({
    pool,
    tickLower: 220520,
    tickUpper: 226210,
    amount1: 10n ** 18n,
  })
  expect(position.amount0.amount).toBeGreaterThan(0n)
  expect(position.amount1.amount).toBeGreaterThan(0n)

  await render({ position })

  expect(mocks.simulate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      data: expect.stringMatching(/^0x/),
      query: { enabled: true },
    }),
  )
  expect(
    container.querySelector<HTMLButtonElement>(
      '[testdata-id="confirm-add-liquidity-button"]',
    )?.disabled,
  ).toBe(false)
})
