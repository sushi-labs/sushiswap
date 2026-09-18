/** @vitest-environment jsdom */

import { type ComponentProps, type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { UserRejectedRequestError } from 'viem'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { LaunchpadTokenFor } from '../../../_providers/provider-types'
import type { SushiV2FeeDisposition } from '../../../_providers/sushi-v2/contract'
import { DistributeFeesCard } from './distribute-fees-card'

const mocks = vi.hoisted(() => ({
  launchInfo: vi.fn(),
  rate: vi.fn(),
  simulation: vi.fn(),
  connection: vi.fn(),
  simulate: vi.fn(),
  write: vi.fn(),
  receipt: vi.fn(),
  invalidate: vi.fn(),
  refetchRate: vi.fn(),
  refetchLaunch: vi.fn(),
  refetchPreview: vi.fn(),
}))

vi.mock('../../../_providers/sushi-v2/use-launch-info', () => ({
  useSushiV2LaunchInfo: mocks.launchInfo,
}))
vi.mock('../../../_ui/_common/token-avatar', () => ({
  TokenAvatar: () => null,
}))
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mocks.invalidate }),
  useQuery: mocks.simulation,
}))
vi.mock('wagmi', () => ({
  useConnection: mocks.connection,
  useReadContracts: mocks.rate,
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
  SkeletonBox: () => <span />,
}))
vi.mock('~evm/perps/_ui/_common/perps-card', () => ({
  PerpsCard: ({ children }: { children: ReactNode }) => (
    <section>{children}</section>
  ),
}))
vi.mock('src/lib/wagmi/systems/checker', () => ({
  Checker: {
    Network: ({ children }: { children: ReactNode }) => children,
    Connect: ({ children }: { children: ReactNode }) => children,
  },
}))

const v1: LaunchpadTokenFor<'SUSHI_V1'> = {
  __typename: 'SushiV1LaunchpadToken',
  id: 'test',
  chainId: 4663,
  provider: 'SUSHI_V1',
  address: '0x1111111111111111111111111111111111111111',
  creator: '0x2222222222222222222222222222222222222222',
  factoryAddress: '0x3333333333333333333333333333333333333333',
  name: 'Test Token',
  symbol: 'TEST',
  decimals: 18,
  initialSupply: '1000000000000000000000000000',
  initialFdvUsd: '5000',
  indexingStatus: 'CONFIRMED',
  pool: {
    address: '0x4444444444444444444444444444444444444444',
    feeTier: 3000,
    quoteToken: {
      address: '0x5555555555555555555555555555555555555555',
      symbol: 'USDG',
      name: 'Global Dollar',
      decimals: 6,
    },
  },
  feeSplit: { sushiFeeBps: 1000, creatorFeeBps: 9000 },
  metadata: { description: null, links: [], revision: 1, updatedAt: null },
  metrics: null,
  creationTransactionHash:
    '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  createdAt: '2026-07-24T12:00:00.000Z',
}
const v2: LaunchpadTokenFor<'SUSHI_V2'> = {
  ...v1,
  __typename: 'SushiV2LaunchpadToken',
  provider: 'SUSHI_V2',
  launchCreator: v1.creator,
  currentSupply: v1.initialSupply,
  feeReceiver: v1.creator,
  liquidityMode: 'STANDARD',
  feeDisposition: 'DIRECT_PAYOUT',
  feeSplit: { sushiFeeBps: 1000, nonSushiFeeBps: 9000 },
  devBuy: { quoteSpent: '0', launchTokenReceived: '0' },
  burns: {
    directFeeBurned: '0',
    buybackBurned: '0',
    protocolBurned: '0',
    totalBurned: '0',
  },
  poolInitializedAt: '2026-07-24T12:00:00.000Z',
}
const account = '0x6666666666666666666666666666666666666666'
const distributor = '0x7777777777777777777777777777777777777777'
const precision = 10n ** 36n
const simulationKey = [
  'launchpad',
  'fee-distribution',
  v2.chainId,
  v2.factoryAddress,
  v2.address,
  v2.__typename,
]
const launchKey = ['readContract', 'launchInfo']
const rateKey = ['readContracts', 'rate']
let root: Root
let container: HTMLDivElement
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function setMode(feeDisposition: SushiV2FeeDisposition) {
  mocks.launchInfo.mockReturnValue({
    data: {
      feeDisposition,
      creator: v2.creator,
      feeReceiver: v2.feeReceiver,
      rewardDistributor: distributor,
    },
    queryKey: launchKey,
    refetch: mocks.refetchLaunch,
  })
  const direct = feeDisposition === 'DIRECT_PAYOUT'
  const buyback = feeDisposition === 'BUYBACK_AND_BURN'
  mocks.simulation.mockReturnValue({
    data: {
      result: {
        quoteToSushi: 2_000_000n,
        launchTokenToSushi: 10n ** 18n,
        quoteToReceiver: buyback ? 0n : 18_000_000n,
        launchTokenToReceiver: direct ? 9n * 10n ** 18n : 0n,
        launchTokenFeesBurned: direct ? 0n : 9n * 10n ** 18n,
        quoteUsedForBuyback: buyback ? 18_000_000n : 0n,
        launchTokenBoughtAndBurned: buyback ? 3n * 10n ** 18n : 0n,
      },
    },
    queryKey: simulationKey,
    refetch: mocks.refetchPreview,
  })
}

beforeEach(() => {
  vi.resetAllMocks()
  setMode('DISTRIBUTE_TO_HOLDERS')
  mocks.connection.mockReturnValue({ address: account, chainId: v2.chainId })
  mocks.rate.mockReturnValue({
    data: [(precision * 1_000_000n) / 86_400n, precision],
    queryKey: rateKey,
    refetch: mocks.refetchRate,
  })
  mocks.invalidate.mockResolvedValue(undefined)
  mocks.write.mockResolvedValue('0x123')
  mocks.receipt.mockResolvedValue({ status: 'success' })
  container = document.createElement('div')
  root = createRoot(container)
})
afterEach(() => act(() => root.unmount()))

function render(
  token: ComponentProps<typeof DistributeFeesCard>['token'] = v2,
) {
  act(() => root.render(<DistributeFeesCard token={token} />))
}
async function clickDistribute() {
  const button = Array.from(container.querySelectorAll('button')).find(
    (button) => button.textContent === 'Distribute fees',
  )
  if (!button) throw new Error('Distribution button missing')
  await act(async () => button.click())
}

it.each([
  ['DIRECT_PAYOUT', 'Fee Recipient', 'Fee Recipient'],
  ['BURN_LAUNCH_TOKEN_FEES', 'Burned', 'Fee Recipient'],
  ['BUYBACK_AND_BURN', 'Burned', 'Buyback & burn'],
  ['DISTRIBUTE_TO_HOLDERS', 'Burned', 'Holder rewards'],
] as const)(
  'shows only the non-Sushi amounts for live mode %s',
  (mode, tokenRoute, quoteRoute) => {
    setMode(mode)
    render()
    expect(container.textContent).toContain(`${tokenRoute}9 TEST`)
    expect(container.textContent).toContain(`${quoteRoute}18 USDG`)
    expect(container.textContent).not.toContain('Sushi')
    expect(container.textContent).not.toContain('10 TEST')
    expect(container.textContent).not.toContain('20 USDG')
    if (mode === 'BUYBACK_AND_BURN')
      expect(container.textContent).toContain('3 TEST burned')
    expect(mocks.rate).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          enabled: mode === 'DISTRIBUTE_TO_HOLDERS',
        }),
      }),
    )
  },
)

it('shows the total holder distribution rate independently of the connected balance', () => {
  mocks.rate.mockReturnValue({ data: [precision / 2n, precision] })
  render()
  expect(container.textContent).toContain(
    'Current distribution: 0.0432 USDG / day',
  )
})

it('subtracts the actual Sushi amounts for V1 recipient payouts', () => {
  mocks.simulation.mockReturnValue({
    data: { result: [20_000_000n, 10n * 10n ** 18n, 2_000_000n, 10n ** 18n] },
  })
  render(v1)
  expect(container.textContent).toContain('Fee Recipient9 TEST')
  expect(container.textContent).toContain('Fee Recipient18 USDG')
  expect(container.textContent).not.toContain('/ day')
  expect(mocks.launchInfo).toHaveBeenCalledWith(
    expect.objectContaining({ enabled: false }),
  )
})

it('lets a non-creator distribute, invalidates before the wallet request without waiting, then refreshes on confirmation', async () => {
  let confirm: (receipt: { status: string }) => void = () => {
    throw new Error('No receipt')
  }
  mocks.receipt.mockReturnValue(
    new Promise((resolve) => {
      confirm = resolve
    }),
  )
  mocks.invalidate.mockImplementationOnce(() => new Promise(() => {}))
  render()
  await clickDistribute()
  expect(mocks.invalidate).toHaveBeenCalledWith({ queryKey: simulationKey })
  expect(mocks.invalidate.mock.invocationCallOrder[2]).toBeLessThan(
    mocks.simulate.mock.invocationCallOrder[0],
  )
  expect(mocks.simulate).toHaveBeenCalledWith(
    expect.objectContaining({
      account,
      chainId: v2.chainId,
      address: v2.factoryAddress,
      functionName: 'distributeFees',
      args: [v2.address],
    }),
  )
  expect(mocks.write).toHaveBeenCalledWith(mocks.simulate.mock.calls[0][0])
  expect(container.textContent).toContain('Distributing…')
  expect(mocks.refetchRate).not.toHaveBeenCalled()
  await act(async () => confirm({ status: 'success' }))
  expect(container.textContent).toContain('Fees distributed')
  expect(mocks.invalidate).toHaveBeenCalledWith({
    queryKey: [
      'readContracts',
      { scopeKey: `holder-rewards:${v2.chainId}:${v2.address}`, contracts: [] },
    ],
  })
  expect(mocks.refetchRate).toHaveBeenCalledOnce()
  expect(mocks.refetchLaunch).toHaveBeenCalledOnce()
})

it('does not submit if the fresh simulation fails', async () => {
  mocks.simulate.mockRejectedValue(new Error('Buyback price deviation'))
  render()
  await clickDistribute()
  expect(mocks.write).not.toHaveBeenCalled()
  expect(container.querySelector('[role="alert"]')?.textContent).toContain(
    'Buyback price deviation',
  )
})

it('reports a reverted transaction without claiming success', async () => {
  mocks.receipt.mockResolvedValue({ status: 'reverted' })
  render()
  await clickDistribute()
  expect(container.querySelector('[role="alert"]')?.textContent).toContain(
    'Fee distribution failed',
  )
  expect(mocks.refetchRate).not.toHaveBeenCalled()
  expect(container.textContent).not.toContain('Fees distributed')
})

it('allows retry after wallet rejection without displaying an error', async () => {
  mocks.write.mockRejectedValue(
    new UserRejectedRequestError(new Error('Rejected')),
  )
  render()
  await clickDistribute()
  expect(container.querySelector('[role="alert"]')).toBeNull()
  expect(container.querySelector('button')?.disabled).toBe(false)
})

it.each([
  { address: undefined, chainId: 4663 },
  { address: account, chainId: 1 },
])(
  'guards the transaction when the wallet is unavailable or on another network',
  async (connection) => {
    mocks.connection.mockReturnValue(connection)
    render()
    await clickDistribute()
    expect(mocks.simulate).not.toHaveBeenCalled()
    expect(mocks.write).not.toHaveBeenCalled()
  },
)

it('shows unavailable previews as an error, with retry, instead of zero fees', async () => {
  mocks.simulation.mockReturnValue({
    isError: true,
    refetch: mocks.refetchPreview,
  })
  render()
  expect(container.textContent).toContain('Fee preview unavailable')
  await act(async () => container.querySelector('button')?.click())
  expect(mocks.refetchPreview).toHaveBeenCalledOnce()
  expect(mocks.write).not.toHaveBeenCalled()
})

it('disables distribution when both fee balances are zero', () => {
  mocks.simulation.mockReturnValue({ data: { result: [0n, 0n, 0n, 0n] } })
  render(v1)
  expect(container.textContent).toContain('0 TEST')
  expect(container.querySelector('button')?.disabled).toBe(true)
})
