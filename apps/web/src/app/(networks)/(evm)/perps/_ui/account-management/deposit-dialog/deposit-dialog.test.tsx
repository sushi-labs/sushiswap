import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import type { ActiveAccount } from '~evm/perps/active-account-state'
import { DepositDialog } from './deposit-dialog'

vi.mock('@sushiswap/ui', () => ({
  Button: ({ children }: { children: ReactNode }) => (
    <button type="button">{children}</button>
  ),
  Currency: { Icon: () => null },
  PerpsDialog: ({ children }: { children: ReactNode }) => <>{children}</>,
  PerpsDialogContent: () => null,
  PerpsDialogDescription: () => null,
  PerpsDialogHeader: () => null,
  PerpsDialogInnerContent: () => null,
  PerpsDialogTitle: () => null,
  PerpsDialogTrigger: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
  Select: () => null,
  SelectContent: () => null,
  SelectItem: () => null,
  SelectTrigger: () => null,
  classNames: (...classes: string[]) => classes.join(' '),
}))
vi.mock('@sushiswap/ui/icons/network-icon', () => ({
  NetworkIcon: () => null,
}))
vi.mock('src/app/(networks)/_ui/sidebar', () => ({
  useSidebar: () => ({ isOpen: false }),
}))
vi.mock('~evm/perps/active-account-provider', () => ({
  useActiveAccountState: vi.fn(),
}))
vi.mock('./any-token-deposit', () => ({ AnyTokenDeposit: () => null }))
vi.mock('./hyperunit/hyperunit-options', () => ({
  HyperunitOptions: () => null,
}))
vi.mock('./usdc-options', () => ({ USDCOptions: () => null }))

function selectAccount(type: ActiveAccount['type']): void {
  const activeAccount: ActiveAccount = {
    address:
      type === 'master'
        ? '0x52908400098527886E0F7030069857D2E4169EE7'
        : '0x27b1fdb04752bbc536007a920d24acb045561c26',
    walletAddress: '0x52908400098527886E0F7030069857D2E4169EE7',
    type,
    name: 'Trading account',
  }
  vi.mocked(useActiveAccountState).mockReturnValue({
    state: { activeAccount, activeAddress: activeAccount.address },
    mutate: { setActiveAccount: vi.fn() },
  })
}

describe('DepositDialog account scope', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hides master funding for subaccounts, including controlled dialogs with custom triggers', () => {
    selectAccount('sub')

    expect(renderToStaticMarkup(<DepositDialog />)).toBe('')
    expect(
      renderToStaticMarkup(
        <DepositDialog
          isOpen
          trigger={<button type="button">Fund account</button>}
        />,
      ),
    ).toBe('')
  })

  it.each(['master', 'vault'] as const)(
    'preserves the existing deposit trigger for %s accounts',
    (type) => {
      selectAccount(type)

      expect(renderToStaticMarkup(<DepositDialog />)).toContain('Deposit')
    },
  )
})
