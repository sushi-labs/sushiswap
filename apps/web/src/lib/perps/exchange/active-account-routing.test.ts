import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ActiveAccount } from '~evm/perps/active-account-state'
import { getVaultAddress } from './get-vault-address'
import { useCancelOpenOrders } from './use-cancel-open-orders'
import { useCancelTwap } from './use-cancel-twap'
import { useExecuteOrders } from './use-execute-orders'
import { useExecuteTwapOrder } from './use-execute-twap-order'
import { useModifyOrder } from './use-modify-order'
import { useUpdateIsolatedMargin } from './use-update-isolated-margin'
import { useUpdateLeverage } from './use-update-leverage'

const mocks = vi.hoisted(() => ({
  useActiveAccountState: vi.fn(),
  order: vi.fn(),
  modify: vi.fn(),
  cancel: vi.fn(),
  twapOrder: vi.fn(),
  twapCancel: vi.fn(),
  updateLeverage: vi.fn(),
  updateIsolatedMargin: vi.fn(),
  walletAddress: '0x0000000000000000000000000000000000000001',
  agentAccount: { address: '0x0000000000000000000000000000000000000002' },
}))

vi.mock('@nktkas/hyperliquid/api/exchange', () => ({
  ...mocks,
  ApiRequestError: class extends Error {},
}))

vi.mock('@sushiswap/notifications', () => ({
  createFailedToast: vi.fn(),
  createInfoToast: vi.fn(),
  createSuccessToast: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useMutation<T>({
    mutationFn,
  }: { mutationFn: (variables: T) => Promise<unknown> }) {
    return { mutateAsync: mutationFn }
  },
}))

vi.mock('src/lib/wallet', () => ({
  useAccount: () => mocks.walletAddress,
}))

vi.mock('~evm/perps/active-account-provider', () => ({
  useActiveAccountState: mocks.useActiveAccountState,
}))

vi.mock('~evm/perps/_ui/asset-selector', () => ({
  useAssetListState: () => ({
    state: {
      symbolConverter: { getAssetId: () => 0 },
      assetListQuery: { data: new Map([['BTC', { name: 'BTC' }]]) },
    },
  }),
}))

vi.mock('../agent', () => ({
  useAgent: () => ({ agentAccount: mocks.agentAccount }),
}))

vi.mock('../config', () => ({
  IS_PERPS_TESTNET: true,
  BUILDER_FEE_RECEIVER: mocks.walletAddress,
  TOAST_AUTOCLOSE_TIME: 0,
}))

vi.mock('../info/use-legal-check', () => ({
  useLegalCheck: () => ({ data: { ipAllowed: true, userAllowed: true } }),
}))

vi.mock('../transports', () => ({ hlHttpTransport: {} }))

vi.mock('../utils', () => ({ getAssetIdForConverter: () => 'BTC' }))

const account: ActiveAccount = {
  address: '0x0000000000000000000000000000000000000003',
  walletAddress: '0x0000000000000000000000000000000000000001',
  name: 'Trading account',
  type: 'sub',
}

const operations = [
  {
    name: 'placing orders',
    request: mocks.order,
    execute: () =>
      useExecuteOrders().executeOrdersAsync({
        orderData: {
          orders: [
            {
              asset: 'BTC',
              side: 'long',
              price: '100000',
              size: '0.01',
              reduceOnly: false,
              orderType: { limit: { timeInForce: 'Gtc' } },
            },
          ],
          builder: { builderFee: 0 },
        },
      }),
  },
  {
    name: 'modifying orders',
    request: mocks.modify,
    execute: () =>
      useModifyOrder().modifyOrderAsync({
        asset: 'BTC',
        orderId: 1,
        side: 'B',
        size: '0.02',
        price: '100000',
        reduceOnly: false,
        orderType: { limit: { timeInForce: 'Gtc' } },
      }),
  },
  {
    name: 'cancelling orders',
    request: mocks.cancel,
    execute: () =>
      useCancelOpenOrders().cancelOrdersAsync({
        cancelData: [{ asset: 'BTC', orderId: 1 }],
      }),
  },
  {
    name: 'placing TWAP orders',
    request: mocks.twapOrder,
    execute: () =>
      useExecuteTwapOrder().executeTwapOrderAsync({
        orderData: {
          asset: 'BTC',
          side: 'long',
          size: '0.01',
          reduceOnly: false,
          minutes: 10,
          ramdonize: false,
        },
      }),
  },
  {
    name: 'cancelling TWAP orders',
    request: mocks.twapCancel,
    execute: () =>
      useCancelTwap().cancelTwapOrderAsync({
        cancelData: { asset: 'BTC', twapId: 1 },
      }),
  },
  {
    name: 'updating leverage',
    request: mocks.updateLeverage,
    execute: () =>
      useUpdateLeverage().updateLeverageAsync({
        assetString: 'BTC',
        isCross: true,
        newLeverage: 3,
      }),
  },
  {
    name: 'updating isolated margin',
    request: mocks.updateIsolatedMargin,
    execute: () =>
      useUpdateIsolatedMargin().updateIsolatedMarginAsync({
        assetString: 'BTC',
        side: 'long',
        amount: '10',
        isAdd: true,
      }),
  },
]

describe('active account exchange routing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('has no delegated address without an active account', () => {
    expect(getVaultAddress(null)).toBeUndefined()
  })

  describe.each(operations)('$name', ({ request, execute }) => {
    it.each(['master', 'vault', 'sub'] as const)(
      'routes the request to the selected %s account',
      async (type) => {
        const activeAccount = {
          ...account,
          type,
          address: type === 'master' ? account.walletAddress : account.address,
        }
        mocks.useActiveAccountState.mockReturnValue({
          state: { activeAccount },
        })

        await execute()

        expect(request).toHaveBeenCalledOnce()
        expect(request).toHaveBeenCalledWith(
          expect.objectContaining({ wallet: mocks.agentAccount }),
          expect.any(Object),
          {
            vaultAddress: type === 'master' ? undefined : activeAccount.address,
          },
        )
      },
    )
  })
})
