import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSendAsset } from './use-send-asset'

const mocks = vi.hoisted(() => ({
  sendAsset: vi.fn(),
  useWalletClient: vi.fn(),
  useLegalCheck: vi.fn(),
}))

vi.mock('@nktkas/hyperliquid/api/exchange', () => ({
  sendAsset: mocks.sendAsset,
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
  useAccount: () => '0x0000000000000000000000000000000000000001',
}))
vi.mock('wagmi', () => ({ useWalletClient: mocks.useWalletClient }))
vi.mock('../info/use-legal-check', () => ({
  useLegalCheck: mocks.useLegalCheck,
}))
vi.mock('../transports', () => ({ hlHttpTransport: {} }))
vi.mock('../config', () => ({ TOAST_AUTOCLOSE_TIME: 0 }))

const masterAddress = '0x0000000000000000000000000000000000000001'
const subAccountAddress = '0x0000000000000000000000000000000000000002'
const transfer = {
  destination: subAccountAddress,
  sourceDex: 'spot',
  destinationDex: 'spot',
  token: 'TOKEN:0x00000000000000000000000000000001',
  amount: '1.12345678',
  decimals: 8,
  expectedWalletAddress: masterAddress,
} as const

describe('useSendAsset', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useWalletClient.mockReturnValue({
      data: { account: { address: masterAddress } },
    })
    mocks.useLegalCheck.mockReturnValue({
      data: { ipAllowed: true, userAllowed: true },
    })
  })

  it('transfers the precise spot amount from the master wallet', async () => {
    await useSendAsset().sendAssetAsync(transfer)
    expect(mocks.sendAsset).toHaveBeenCalledWith(
      { wallet: { account: { address: masterAddress } }, transport: {} },
      {
        destination: subAccountAddress,
        sourceDex: 'spot',
        destinationDex: 'spot',
        token: transfer.token,
        amount: '1.12345678',
      },
    )
  })

  it('passes the selected source sub-account to the SDK', async () => {
    await useSendAsset().sendAssetAsync({
      ...transfer,
      destination: masterAddress,
      fromSubAccount: subAccountAddress,
    })
    expect(mocks.sendAsset).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        destination: masterAddress,
        fromSubAccount: subAccountAddress,
      }),
    )
  })

  it.each(['', 'xyz'])(
    'transfers perps USDC from a sub-account on DEX %j at six-decimal precision',
    async (dex) => {
      await useSendAsset().sendAssetAsync({
        ...transfer,
        destination: masterAddress,
        fromSubAccount: subAccountAddress,
        sourceDex: dex,
        destinationDex: dex,
        token: 'USDC',
        decimals: 6,
        amount: '12.123456',
      })
      expect(mocks.sendAsset).toHaveBeenCalledWith(expect.anything(), {
        destination: masterAddress,
        fromSubAccount: subAccountAddress,
        sourceDex: dex,
        destinationDex: dex,
        token: 'USDC',
        amount: '12.123456',
      })
    },
  )

  it('rejects a missing wallet instead of treating it as success', async () => {
    mocks.useWalletClient.mockReturnValue({ data: undefined })
    await expect(useSendAsset().sendAssetAsync(transfer)).rejects.toThrow(
      'Connect your wallet',
    )
    expect(mocks.sendAsset).not.toHaveBeenCalled()
  })

  it('rejects a different master wallet before signing', async () => {
    mocks.useWalletClient.mockReturnValue({
      data: { account: { address: subAccountAddress } },
    })
    await expect(useSendAsset().sendAssetAsync(transfer)).rejects.toThrow(
      'Connect the master account wallet',
    )
    expect(mocks.sendAsset).not.toHaveBeenCalled()
  })

  it('rejects a failed legal check before signing', async () => {
    mocks.useLegalCheck.mockReturnValue({
      data: { ipAllowed: false, userAllowed: true },
    })
    await expect(useSendAsset().sendAssetAsync(transfer)).rejects.toThrow(
      'Cannot transfer assets',
    )
    expect(mocks.sendAsset).not.toHaveBeenCalled()
  })

  it.each(['0', '-1', 'NaN', 'Infinity', '0.000000001'])(
    'does not submit invalid amount %s',
    async (amount) => {
      await expect(
        useSendAsset().sendAssetAsync({ ...transfer, amount }),
      ).rejects.toThrow()
      expect(mocks.sendAsset).not.toHaveBeenCalled()
    },
  )
})
