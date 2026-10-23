import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCreateSubAccount } from './use-create-sub-account'

const mocks = vi.hoisted(() => ({
  createSubAccount: vi.fn(),
  useAccount: vi.fn(),
  useWalletClient: vi.fn(),
  useLegalCheck: vi.fn(),
  invalidateQueries: vi.fn(),
  createInfoToast: vi.fn(),
  createFailedToast: vi.fn(),
  createSuccessToast: vi.fn(),
}))

vi.mock('@nktkas/hyperliquid/api/exchange', () => ({
  createSubAccount: mocks.createSubAccount,
}))
vi.mock('@sushiswap/notifications', () => ({
  createInfoToast: mocks.createInfoToast,
  createFailedToast: mocks.createFailedToast,
  createSuccessToast: mocks.createSuccessToast,
}))
vi.mock('@tanstack/react-query', () => ({
  useMutation<TData, TVariables, TContext>({
    mutationFn,
    onMutate,
    onSuccess,
    onError,
  }: {
    mutationFn: (variables: TVariables) => Promise<TData>
    onMutate: (variables: TVariables) => TContext
    onSuccess: (
      data: TData,
      variables: TVariables,
      context: TContext,
    ) => void | Promise<void>
    onError: (error: Error, variables: TVariables, context: TContext) => void
  }) {
    return {
      async mutateAsync(variables: TVariables): Promise<TData> {
        const context = onMutate(variables)
        try {
          const data = await mutationFn(variables)
          await onSuccess(data, variables, context)
          return data
        } catch (error) {
          if (error instanceof Error) onError(error, variables, context)
          throw error
        }
      },
    }
  },
  useQueryClient: () => ({ invalidateQueries: mocks.invalidateQueries }),
}))
vi.mock('src/lib/wallet', () => ({ useAccount: mocks.useAccount }))
vi.mock('wagmi', () => ({ useWalletClient: mocks.useWalletClient }))
vi.mock('../info/use-legal-check', () => ({
  useLegalCheck: mocks.useLegalCheck,
}))
vi.mock('../config', () => ({ TOAST_AUTOCLOSE_TIME: 0 }))
vi.mock('../transports', () => ({ hlHttpTransport: {} }))

const masterAddress = '0x0000000000000000000000000000000000000001'
const subAccountUser = '0x0000000000000000000000000000000000000002'
const otherAddress = '0x0000000000000000000000000000000000000003'
const walletClient = { account: { address: masterAddress } }
const variables = { masterAddress, name: 'New account' } as const
const response = {
  status: 'ok',
  response: { type: 'createSubAccount', data: subAccountUser },
} as const

describe('useCreateSubAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useAccount.mockReturnValue(masterAddress)
    mocks.useWalletClient.mockReturnValue({ data: walletClient })
    mocks.useLegalCheck.mockReturnValue({
      data: { ipAllowed: true, userAllowed: true },
    })
    mocks.createSubAccount.mockResolvedValue(response)
    mocks.invalidateQueries.mockResolvedValue(undefined)
  })

  it('creates with the master wallet, trims the name, and refreshes its accounts', async () => {
    await expect(
      useCreateSubAccount().createSubAccountAsync({
        ...variables,
        name: '  New account  ',
      }),
    ).resolves.toEqual(response)

    expect(mocks.createSubAccount).toHaveBeenCalledOnce()
    expect(mocks.createSubAccount).toHaveBeenCalledWith(
      { wallet: walletClient, transport: {} },
      { name: 'New account' },
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledOnce()
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['useSubAccounts', masterAddress],
    })
    expect(mocks.createSuccessToast).toHaveBeenCalledWith(
      expect.objectContaining({
        account: masterAddress,
        summary: 'Sub-account created successfully',
      }),
    )
    expect(mocks.createFailedToast).not.toHaveBeenCalled()
  })

  it.each(['account', 'wallet client', 'wallet account'])(
    'requires a connected %s',
    async (source) => {
      if (source === 'account') {
        mocks.useAccount.mockReturnValue(undefined)
      } else {
        mocks.useWalletClient.mockReturnValue({
          data: source === 'wallet client' ? undefined : {},
        })
      }
      await expect(
        useCreateSubAccount().createSubAccountAsync(variables),
      ).rejects.toThrow('Connect your master account wallet')
      expect(mocks.createSubAccount).not.toHaveBeenCalled()
      expect(mocks.invalidateQueries).not.toHaveBeenCalled()
    },
  )

  it.each(['account', 'wallet client'])(
    'rejects a changed %s',
    async (source) => {
      if (source === 'account') {
        mocks.useAccount.mockReturnValue(otherAddress)
      } else {
        mocks.useWalletClient.mockReturnValue({
          data: { account: { address: otherAddress } },
        })
      }
      await expect(
        useCreateSubAccount().createSubAccountAsync(variables),
      ).rejects.toThrow('Connect the master account wallet')
      expect(mocks.createSubAccount).not.toHaveBeenCalled()
      expect(mocks.invalidateQueries).not.toHaveBeenCalled()
    },
  )

  it.each(['', '   ', 'a'.repeat(17)])(
    'rejects an invalid name: %j',
    async (name) => {
      await expect(
        useCreateSubAccount().createSubAccountAsync({ ...variables, name }),
      ).rejects.toThrow('Enter a name between 1 and 16 characters')
      expect(mocks.createSubAccount).not.toHaveBeenCalled()
      expect(mocks.invalidateQueries).not.toHaveBeenCalled()
    },
  )

  it('accepts a name at the SDK length limit after trimming', async () => {
    const name = 'a'.repeat(16)
    await useCreateSubAccount().createSubAccountAsync({
      ...variables,
      name: ` ${name} `,
    })
    expect(mocks.createSubAccount).toHaveBeenCalledWith(
      { wallet: walletClient, transport: {} },
      { name },
    )
  })

  it.each([
    undefined,
    { ipAllowed: false, userAllowed: true },
    { ipAllowed: true, userAllowed: false },
  ])('requires a successful legal check: %j', async (legalCheck) => {
    mocks.useLegalCheck.mockReturnValue({ data: legalCheck })
    await expect(
      useCreateSubAccount().createSubAccountAsync(variables),
    ).rejects.toThrow('Legal check failed')
    expect(mocks.createSubAccount).not.toHaveBeenCalled()
    expect(mocks.invalidateQueries).not.toHaveBeenCalled()
  })

  it('shows SDK errors without refreshing accounts or reporting success', async () => {
    mocks.createSubAccount.mockRejectedValue(new Error('User rejected request'))
    await expect(
      useCreateSubAccount().createSubAccountAsync(variables),
    ).rejects.toThrow('User rejected request')
    expect(mocks.invalidateQueries).not.toHaveBeenCalled()
    expect(mocks.createSuccessToast).not.toHaveBeenCalled()
    expect(mocks.createFailedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        account: masterAddress,
        summary: 'User rejected request',
        timestamp: mocks.createInfoToast.mock.calls[0]?.[0].timestamp,
      }),
    )
  })
})
