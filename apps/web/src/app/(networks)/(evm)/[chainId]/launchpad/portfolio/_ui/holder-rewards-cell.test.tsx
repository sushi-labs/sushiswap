/** @vitest-environment jsdom */

import { type ComponentProps, type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { EvmChainId } from 'sushi/evm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { HolderRewardsCell } from './holder-rewards-cell'

const mocks = vi.hoisted(() => ({
  launchInfo: vi.fn(),
  rewards: vi.fn(),
  connection: vi.fn(),
  simulate: vi.fn(),
  write: vi.fn(),
  receipt: vi.fn(),
  refetch: vi.fn(),
}))

vi.mock('../../_providers/sushi-v2/use-launch-info', () => ({
  useSushiV2LaunchInfo: mocks.launchInfo,
}))
vi.mock('../_lib/use-holder-rewards', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../_lib/use-holder-rewards')>()),
  useHolderRewards: mocks.rewards,
}))
vi.mock('wagmi', () => ({
  useConnection: mocks.connection,
  usePublicClient: () => ({
    simulateContract: mocks.simulate,
    waitForTransactionReceipt: mocks.receipt,
  }),
  useWriteContract: () => ({ mutateAsync: mocks.write }),
}))
vi.mock('@sushiswap/notifications', () => ({ createToast: vi.fn() }))
vi.mock('@sushiswap/ui', () => ({
  Button: ({ children, disabled, onClick }: ComponentProps<'button'>) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}))
vi.mock('src/lib/wagmi/systems/checker', () => ({
  Checker: { Network: ({ children }: { children: ReactNode }) => children },
}))

const props = {
  chainId: EvmChainId.ROBINHOOD,
  holder: '0x0000000000000000000000000000000000000001',
  token: {
    address: '0x0000000000000000000000000000000000000002',
    chainId: EvmChainId.ROBINHOOD,
    createdAt: '2026-01-01',
    creator: '0x0000000000000000000000000000000000000001',
    decimals: 18,
    initialSupply: '1000000',
    name: 'Test token',
    provider: 'SUSHI_V2',
    factoryAddress: '0x0000000000000000000000000000000000000005',
    feeDisposition: 'DISTRIBUTE_TO_HOLDERS',
    tokenVersion: 'V2_2',
    symbol: 'TEST',
    quoteToken: {
      address: '0x0000000000000000000000000000000000000003',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
  },
} as const satisfies ComponentProps<typeof HolderRewardsCell>
const distributor = '0x0000000000000000000000000000000000000004'
let root: Root
let container: HTMLDivElement

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

beforeEach(() => {
  vi.resetAllMocks()
  mocks.connection.mockReturnValue({
    address: props.holder,
    chainId: props.chainId,
  })
  mocks.launchInfo.mockReturnValue({
    data: {
      feeDisposition: 'DISTRIBUTE_TO_HOLDERS',
      rewardDistributor: distributor,
    },
  })
  mocks.rewards.mockReturnValue({
    data: { earned: 1_250_000n, ratePerDay: 2_500_000n },
    refetch: mocks.refetch,
  })
  mocks.write.mockResolvedValue('0x123')
  mocks.receipt.mockResolvedValue({ status: 'success' })
  container = document.createElement('div')
  root = createRoot(container)
})
afterEach(() => act(() => root.unmount()))

function render(
  token: ComponentProps<typeof HolderRewardsCell>['token'] = props.token,
) {
  act(() => root.render(<HolderRewardsCell {...props} token={token} />))
}

async function clickClaim() {
  const button = container.querySelector('button')
  if (!button) throw new Error('Claim button missing')
  await act(async () => button.click())
}

it('shows quote-token rewards and the holder rate, then claims to the holder and refreshes after confirmation', async () => {
  let confirm: (value: { status: string }) => void = () => {
    throw new Error('No pending receipt')
  }
  mocks.receipt.mockReturnValue(
    new Promise((resolve) => {
      confirm = resolve
    }),
  )
  render()
  expect(container.textContent).toContain('1.25 USDC')
  expect(container.textContent).toContain('2.5 USDC/day')
  await clickClaim()
  expect(mocks.simulate).toHaveBeenCalledWith(
    expect.objectContaining({
      address: distributor,
      chainId: props.chainId,
      account: props.holder,
      functionName: 'claim',
      args: [props.holder],
    }),
  )
  expect(mocks.write).toHaveBeenCalledWith(mocks.simulate.mock.calls[0][0])
  expect(container.querySelector('button')?.disabled).toBe(true)
  expect(mocks.refetch).not.toHaveBeenCalled()
  await act(async () => confirm({ status: 'success' }))
  expect(mocks.refetch).toHaveBeenCalledOnce()
})

it('does not report a reverted claim as successful', async () => {
  mocks.receipt.mockResolvedValue({ status: 'reverted' })
  render()
  await clickClaim()
  expect(container.querySelector('[role="alert"]')?.textContent).toContain(
    'Claim failed',
  )
  expect(mocks.refetch).not.toHaveBeenCalled()
})

it('does not submit a claim after the wallet changes', async () => {
  mocks.connection.mockReturnValue({
    address: distributor,
    chainId: props.chainId,
  })
  render()
  await clickClaim()
  expect(mocks.write).not.toHaveBeenCalled()
})

it('disables claims when no rewards have accrued', () => {
  mocks.rewards.mockReturnValue({
    data: { earned: 0n, ratePerDay: 2_500_000n },
  })
  render()
  expect(container.querySelector('button')?.disabled).toBe(true)
})

it('shows failed reads as unavailable and offers a retry', async () => {
  mocks.rewards.mockReturnValue({ isError: true, refetch: mocks.refetch })
  render()
  expect(container.textContent).toContain('Rewards unavailable')
  await clickClaim()
  expect(mocks.refetch).toHaveBeenCalledOnce()
  expect(mocks.write).not.toHaveBeenCalled()
})

it('does not offer claiming for direct payout tokens', () => {
  mocks.launchInfo.mockReturnValue({
    data: { feeDisposition: 'DIRECT_PAYOUT' },
  })
  render()
  expect(container.querySelector('button')).toBeNull()
  expect(mocks.rewards).toHaveBeenCalledWith(
    expect.objectContaining({ distributor: undefined }),
  )
})

it.each([
  { tokenVersion: 'V2_0', feeDisposition: 'DIRECT_PAYOUT' },
  { tokenVersion: 'V2_2', feeDisposition: 'BUYBACK_AND_BURN' },
] as const)(
  'skips reward detection for $tokenVersion / $feeDisposition',
  (configuration) => {
    mocks.launchInfo.mockReturnValue({ isError: true })
    render({ ...props.token, ...configuration })
    expect(container.textContent).toBe('—')
    expect(container.querySelector('button')).toBeNull()
    expect(mocks.launchInfo).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    )
    expect(mocks.rewards).toHaveBeenCalledWith(
      expect.objectContaining({ distributor: undefined }),
    )
  },
)

it.each(['DIRECT_PAYOUT', 'BURN_LAUNCH_TOKEN_FEES'] as const)(
  'shows a dash while checking %s, including failed background reads',
  (feeDisposition) => {
    for (const isError of [false, true]) {
      mocks.launchInfo.mockReturnValue({ isError })
      render({ ...props.token, feeDisposition })
      expect(container.textContent).toBe('—')
      expect(container.querySelector('button')).toBeNull()
    }
    expect(mocks.launchInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
        factoryAddress: props.token.factoryAddress,
      }),
    )
  },
)

it('detects a recent switch before the indexed fee mode catches up', () => {
  render({ ...props.token, feeDisposition: 'DIRECT_PAYOUT' })
  expect(container.textContent).toContain('1.25 USDC')
  expect(container.querySelector('button')?.textContent).toBe('Claim')
})

it('offers retry when a known distribution token cannot be read', async () => {
  mocks.launchInfo.mockReturnValue({ isError: true, refetch: mocks.refetch })
  render()
  expect(container.textContent).toContain('Rewards unavailable')
  await clickClaim()
  expect(mocks.refetch).toHaveBeenCalledOnce()
})
