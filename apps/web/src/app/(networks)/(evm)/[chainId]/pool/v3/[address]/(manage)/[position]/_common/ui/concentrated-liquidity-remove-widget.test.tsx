/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Percent } from 'sushi'
import { EvmChainId, Position, SushiSwapV3Pool, USDC, WETH9 } from 'sushi/evm'
import { type Hash, type TransactionReceipt, zeroAddress } from 'viem'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ConcentratedLiquidityRemoveWidget } from './concentrated-liquidity-remove-widget'

const mocks = vi.hoisted(() => ({
  simulate: vi.fn(() => ({ isSuccess: true, isError: false })),
  send: vi.fn(),
  receipt: vi.fn(),
}))
vi.mock('wagmi', () => ({
  useConnection: () => ({ chain: { id: EvmChainId.POLYGON } }),
  usePublicClient: () => ({ waitForTransactionReceipt: mocks.receipt }),
  useCall: mocks.simulate,
  useSendTransaction: ({
    mutation,
  }: { mutation: { onSuccess(hash: Hash): Promise<void> } }) => ({
    isPending: false,
    mutate: (request: unknown) => {
      mocks.send(request)
      void mutation.onSuccess('0x1234').catch(() => undefined)
    },
  }),
}))
vi.mock('@sushiswap/notifications', () => ({
  createToast: ({ promise }: { promise: Promise<unknown> }) =>
    promise.catch(() => undefined),
  createErrorToast: vi.fn(),
}))
vi.mock('src/lib/wallet', () => ({
  useWalletConnection: () => ({ isConnected: true }),
}))
vi.mock('src/lib/wagmi/components/connect-button', () => ({
  ConnectButton: () => null,
}))
vi.mock('src/lib/wallet/namespaces/evm/hooks/use-switch-chain', () => ({
  useSwitchChain: () => ({ mutateAsync: vi.fn() }),
}))
vi.mock('src/lib/wagmi/systems/checker', async () => {
  const { Connect } = await import('src/lib/wagmi/systems/checker/connect')
  const { Guard } = await import('src/lib/wagmi/systems/checker/guard')
  const { Network } = await import('src/lib/wagmi/systems/checker/network')
  const { StockTokenRegion } = await import(
    'src/lib/wagmi/systems/checker/stock-token-region'
  )
  return { Checker: { Connect, Guard, Network, StockTokenRegion } }
})
vi.mock('src/lib/hooks/use-slippage-tolerance', () => ({
  useSlippageTolerance: () => [
    new Percent({ numerator: 50, denominator: 10000 }),
  ],
}))
vi.mock('src/lib/hooks/use-token-amount-dollar-values', () => ({
  useTokenAmountDollarValues: () => [1, 1],
}))
vi.mock('src/lib/wagmi/hooks/utils/hooks/use-transaction-deadline', () => ({
  useTransactionDeadline: () => ({ data: 1000n }),
}))
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain: vi.fn() }),
}))

const chainId = EvmChainId.POLYGON
const pool = new SushiSwapV3Pool(
  USDC[chainId],
  WETH9[chainId],
  500,
  2n ** 96n,
  1000000n,
  0,
)
const position = new Position({
  pool,
  tickLower: -100,
  tickUpper: 100,
  liquidity: 1000000n,
})
const account = '0x0000000000000000000000000000000000000001'
const positionDetails = {
  id: '10608',
  address: SushiSwapV3Pool.getAddress(pool.token0, pool.token1, pool.fee),
  chainId,
  nonce: 0n,
  tokenId: 10608n,
  operator: zeroAddress,
  token0: pool.token0.address,
  token1: pool.token1.address,
  fee: pool.fee,
  fees: undefined,
  tickLower: position.tickLower,
  tickUpper: position.tickUpper,
  liquidity: position.liquidity,
  feeGrowthInside0LastX128: 0n,
  feeGrowthInside1LastX128: 0n,
  tokensOwed0: 0n,
  tokensOwed1: 0n,
}
let container: HTMLDivElement
let root: Root
const onPositionDecreased = vi.fn()
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function render(): void {
  act(() => {
    root.render(
      <ConcentratedLiquidityRemoveWidget
        chainId={chainId}
        token0={pool.token0}
        token1={pool.token1}
        account={account}
        position={position}
        positionDetails={positionDetails}
        onPositionDecreased={onPositionDecreased}
      />,
    )
  })
}

function button(id: string): HTMLButtonElement {
  const button = container.querySelector<HTMLButtonElement>(
    `[testdata-id="${id}-button"]`,
  )
  if (!button) throw new Error(`Missing ${id} button`)
  return button
}

function settlePercentage(): void {
  act(() => {
    vi.advanceTimersByTime(300)
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.clearAllMocks()
  mocks.simulate.mockReturnValue({ isSuccess: true, isError: false })
  container = document.createElement('div')
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  vi.useRealTimers()
})

it.each(['success', 'reverted'] as const)(
  'submits directly and reports removal only for a successful receipt, status=%s',
  async (status) => {
    const receipt =
      Promise.withResolvers<
        Pick<TransactionReceipt, 'status' | 'transactionHash'>
      >()
    mocks.receipt.mockReturnValue(receipt.promise)
    render()
    act(() => button('liquidity-max').click())
    settlePercentage()
    act(() => button('confirm-remove-liquidity').click())
    expect(mocks.send).toHaveBeenCalledOnce()
    expect(mocks.receipt).toHaveBeenCalledWith(
      expect.objectContaining({ hash: '0x1234' }),
    )
    expect(onPositionDecreased).not.toHaveBeenCalled()

    await act(async () => {
      receipt.resolve({ status, transactionHash: '0x1234' })
    })
    expect(onPositionDecreased).toHaveBeenCalledTimes(
      status === 'success' ? 1 : 0,
    )
  },
)

it('blocks the prior percentage and waits for simulation of the new removal', () => {
  render()
  act(() => button('liquidity-max').click())
  settlePercentage()
  const submit = button('confirm-remove-liquidity')
  expect(submit.disabled).toBe(false)
  act(() => button('liquidity-25').click())
  act(() => submit.click())
  expect(mocks.send).not.toHaveBeenCalled()

  mocks.simulate.mockReturnValue({ isSuccess: false, isError: false })
  settlePercentage()
  act(() => submit.click())
  expect(mocks.send).not.toHaveBeenCalled()

  mocks.simulate.mockReturnValue({ isSuccess: false, isError: true })
  render()
  act(() => submit.click())
  expect(mocks.send).not.toHaveBeenCalled()

  mocks.simulate.mockReturnValue({ isSuccess: true, isError: false })
  render()
  expect(submit.disabled).toBe(false)
})
