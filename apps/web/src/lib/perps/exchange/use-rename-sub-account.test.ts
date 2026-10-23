import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRenameSubAccount } from './use-rename-sub-account'

const mocks = vi.hoisted(() => ({
  subAccountModify: vi.fn(),
  useAccount: vi.fn(),
  useWalletClient: vi.fn(),
  useLegalCheck: vi.fn(),
  useSubAccounts: vi.fn(),
  useActiveAccountState: vi.fn(),
  setActiveAccount: vi.fn(),
  setQueryData: vi.fn(),
  invalidateQueries: vi.fn(),
  createSuccessToast: vi.fn(),
}))

vi.mock('@nktkas/hyperliquid/api/exchange', () => ({
  subAccountModify: mocks.subAccountModify,
}))
vi.mock('@sushiswap/notifications', () => ({
  createInfoToast: vi.fn(),
  createFailedToast: vi.fn(),
  createSuccessToast: mocks.createSuccessToast,
}))
vi.mock('@tanstack/react-query', () => ({
  useMutation<TData, TVariables, TContext>({
    mutationFn,
    onMutate,
    onSuccess,
  }: {
    mutationFn: (variables: TVariables) => Promise<TData>
    onMutate: (variables: TVariables) => TContext
    onSuccess: (data: TData, variables: TVariables, context: TContext) => void
  }) {
    return {
      async mutateAsync(variables: TVariables): Promise<TData> {
        const context = onMutate(variables)
        const data = await mutationFn(variables)
        onSuccess(data, variables, context)
        return data
      },
    }
  },
  useQueryClient: () => ({
    setQueryData: mocks.setQueryData,
    invalidateQueries: mocks.invalidateQueries,
  }),
}))
vi.mock('src/lib/wallet', () => ({ useAccount: mocks.useAccount }))
vi.mock('wagmi', () => ({ useWalletClient: mocks.useWalletClient }))
vi.mock('../info/use-legal-check', () => ({
  useLegalCheck: mocks.useLegalCheck,
}))
vi.mock('../info/use-sub-accounts', () => ({
  useSubAccounts: mocks.useSubAccounts,
}))
vi.mock('~evm/perps/active-account-provider', () => ({
  useActiveAccountState: mocks.useActiveAccountState,
}))
vi.mock('../config', () => ({ TOAST_AUTOCLOSE_TIME: 0 }))
vi.mock('../transports', () => ({ hlHttpTransport: {} }))

const masterAddress = '0x0000000000000000000000000000000000000001'
const subAccountUser = '0x0000000000000000000000000000000000000002'
const otherAddress = '0x0000000000000000000000000000000000000003'
const walletClient = { account: { address: masterAddress } }
const subAccount = { subAccountUser, master: masterAddress, name: 'Old name' }
const variables = { masterAddress, subAccountUser, name: 'New name' } as const

describe('useRenameSubAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useAccount.mockReturnValue(masterAddress)
    mocks.useWalletClient.mockReturnValue({ data: walletClient })
    mocks.useLegalCheck.mockReturnValue({
      data: { ipAllowed: true, userAllowed: true },
    })
    mocks.useSubAccounts.mockReturnValue({ data: [subAccount] })
    mocks.useActiveAccountState.mockReturnValue({
      state: {
        activeAccount: {
          address: subAccountUser,
          walletAddress: masterAddress,
          type: 'sub',
          name: 'Old name',
        },
      },
      mutate: { setActiveAccount: mocks.setActiveAccount },
    })
    mocks.subAccountModify.mockResolvedValue({
      status: 'ok',
      response: { type: 'default' },
    })
  })

  it('renames with the master wallet and trims the submitted name', async () => {
    await useRenameSubAccount().renameSubAccountAsync({
      ...variables,
      name: '  New name  ',
    })

    expect(mocks.subAccountModify).toHaveBeenCalledOnce()
    expect(mocks.subAccountModify).toHaveBeenCalledWith(
      { wallet: walletClient, transport: {} },
      { subAccountUser, name: 'New name' },
    )
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['useSubAccounts', masterAddress],
    })
    expect(mocks.setQueryData).toHaveBeenCalledWith(
      ['useSubAccounts', masterAddress],
      expect.any(Function),
    )
    expect(mocks.setActiveAccount).toHaveBeenCalledWith(
      subAccountUser,
      'sub',
      'New name',
    )
  })

  it('requires a connected wallet', async () => {
    mocks.useWalletClient.mockReturnValue({ data: undefined })
    await expect(
      useRenameSubAccount().renameSubAccountAsync(variables),
    ).rejects.toThrow('Connect your master account wallet')
    expect(mocks.subAccountModify).not.toHaveBeenCalled()
  })

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
        useRenameSubAccount().renameSubAccountAsync(variables),
      ).rejects.toThrow('Connect the master account wallet')
      expect(mocks.subAccountModify).not.toHaveBeenCalled()
    },
  )

  it.each([undefined, [], [{ ...subAccount, master: otherAddress }]])(
    'rejects a sub-account whose ownership cannot be verified: %j',
    async (accounts) => {
      mocks.useSubAccounts.mockReturnValue({ data: accounts })
      await expect(
        useRenameSubAccount().renameSubAccountAsync(variables),
      ).rejects.toThrow('does not belong to the connected master account')
      expect(mocks.subAccountModify).not.toHaveBeenCalled()
    },
  )

  it.each(['', '   ', 'a'.repeat(17)])(
    'rejects an invalid name: %j',
    async (name) => {
      await expect(
        useRenameSubAccount().renameSubAccountAsync({ ...variables, name }),
      ).rejects.toThrow('Enter a name between 1 and 16 characters')
      expect(mocks.subAccountModify).not.toHaveBeenCalled()
    },
  )

  it('requires the legal check to succeed', async () => {
    mocks.useLegalCheck.mockReturnValue({
      data: { ipAllowed: true, userAllowed: false },
    })
    await expect(
      useRenameSubAccount().renameSubAccountAsync(variables),
    ).rejects.toThrow('Legal check failed')
    expect(mocks.subAccountModify).not.toHaveBeenCalled()
  })

  it('does not update local state when the SDK rejects the request', async () => {
    mocks.subAccountModify.mockRejectedValue(new Error('User rejected request'))
    await expect(
      useRenameSubAccount().renameSubAccountAsync(variables),
    ).rejects.toThrow('User rejected request')
    expect(mocks.setQueryData).not.toHaveBeenCalled()
    expect(mocks.setActiveAccount).not.toHaveBeenCalled()
    expect(mocks.createSuccessToast).not.toHaveBeenCalled()
  })

  it('preserves a different active trading account after renaming', async () => {
    mocks.useActiveAccountState.mockReturnValue({
      state: {
        activeAccount: {
          address: otherAddress,
          walletAddress: masterAddress,
          type: 'sub',
          name: 'Other account',
        },
      },
      mutate: { setActiveAccount: mocks.setActiveAccount },
    })
    await useRenameSubAccount().renameSubAccountAsync(variables)
    expect(mocks.setActiveAccount).not.toHaveBeenCalled()
  })
})
