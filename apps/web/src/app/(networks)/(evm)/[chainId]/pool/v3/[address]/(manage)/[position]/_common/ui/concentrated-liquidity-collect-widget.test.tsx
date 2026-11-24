/** @vitest-environment jsdom */

import { type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Amount } from 'sushi'
import { EvmChainId, Position, SushiSwapV3Pool, USDC, WETH9 } from 'sushi/evm'
import { type Hash, type TransactionReceipt, zeroAddress } from 'viem'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ConcentratedLiquidityCollectWidget } from './concentrated-liquidity-collect-widget'

const mocks = vi.hoisted(() => ({
  waitForReceipt: vi.fn(),
  refetch: vi.fn(),
  send: vi.fn(),
  simulate: vi.fn(),
}))
vi.mock('wagmi', () => ({
  useConnection: () => ({ chain: { id: EvmChainId.POLYGON } }),
  useCall: mocks.simulate,
  usePublicClient: () => ({ waitForTransactionReceipt: mocks.waitForReceipt }),
  useSendTransaction: ({
    mutation,
  }: { mutation: { onSuccess(hash: Hash): Promise<void> } }) => ({
    mutateAsync: async (request: unknown) => {
      mocks.send(request)
      await mutation.onSuccess('0x1234')
    },
  }),
}))
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain: mocks.refetch }),
}))
vi.mock('src/lib/wagmi/systems/checker', () => {
  function Connected({ children }: { children: ReactNode }): ReactNode {
    return children
  }
  return { Checker: { Connect: Connected, Network: Connected } }
})
vi.mock('@sushiswap/notifications', () => ({
  createToast: ({ promise }: { promise: Promise<unknown> }) =>
    promise.catch(() => undefined),
  createErrorToast: vi.fn(),
}))
vi.mock('src/lib/logger', () => ({ logger: { error: vi.fn() } }))

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
  liquidity: pool.liquidity,
})
const positionDetails = {
  id: '1',
  address: SushiSwapV3Pool.getAddress(pool.token0, pool.token1, pool.fee),
  tokenId: 1n,
  chainId,
  nonce: 0n,
  operator: zeroAddress,
  token0: pool.token0.address,
  token1: pool.token1.address,
  fee: pool.fee,
  fees: [10n, 20n],
  tickLower: position.tickLower,
  tickUpper: position.tickUpper,
  liquidity: position.liquidity,
  feeGrowthInside0LastX128: 0n,
  feeGrowthInside1LastX128: 0n,
  tokensOwed0: 10n,
  tokensOwed1: 20n,
}
const onFeesClaimed = vi.fn()
let root: Root
let container: HTMLDivElement
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
beforeEach(() => {
  vi.clearAllMocks()
  mocks.simulate.mockReturnValue({ isSuccess: true })
  container = document.createElement('div')
  root = createRoot(container)
})
afterEach(() => act(() => root.unmount()))

function render(
  fiatValuesAmounts: readonly (number | undefined)[] = [1, 2],
): void {
  act(() => {
    root.render(
      <ConcentratedLiquidityCollectWidget
        token0={pool.token0}
        token1={pool.token1}
        position={position}
        positionDetails={positionDetails}
        chainId={chainId}
        address="0x0000000000000000000000000000000000000001"
        amounts={[new Amount(pool.token0, 10n), new Amount(pool.token1, 20n)]}
        fiatValuesAmounts={fiatValuesAmounts}
        isLoading={false}
        onFeesClaimed={onFeesClaimed}
      />,
    )
  })
}

it('shows a known zero valuation and omits unavailable fee prices', () => {
  render([undefined, 0])
  expect(container.textContent?.match(/\$[\d.]+/g)).toEqual(['$0.00'])
})

it.each([
  { status: 'success', reopen: false, closed: 1 },
  { status: 'reverted', reopen: false, closed: 0 },
  { status: 'success', reopen: true, closed: 0 },
] as const)(
  'closes only the submitting form after confirmation, status=$status, reopened=$reopen',
  async ({ status, reopen, closed }) => {
    const receipt =
      Promise.withResolvers<
        Pick<TransactionReceipt, 'status' | 'transactionHash'>
      >()
    mocks.waitForReceipt.mockReturnValue(receipt.promise)
    render()
    const collect = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Collect',
    )
    act(() => collect?.click())
    expect(mocks.send).toHaveBeenCalledOnce()
    expect(mocks.waitForReceipt).toHaveBeenCalledTimes(1)
    expect(onFeesClaimed).not.toHaveBeenCalled()
    if (reopen) {
      act(() => root.render(null))
      render()
    }
    await act(async () => {
      receipt.resolve({ status, transactionHash: '0x1234' })
    })
    expect(mocks.refetch).toHaveBeenCalledWith(chainId)
    expect(onFeesClaimed).toHaveBeenCalledTimes(closed)
  },
)
