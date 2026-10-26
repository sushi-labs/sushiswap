import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  cloneElement,
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import type { ActiveAccount } from '~evm/perps/active-account-state'
import { DepositDialog } from './deposit-dialog'

vi.mock('@sushiswap/ui', () => ({
  Button: ({ children, disabled }: ComponentProps<'button'>) => (
    <button type="button" disabled={disabled}>
      {children}
    </button>
  ),
  Currency: { Icon: () => null },
  PerpsDialog: ({ children }: { children: ReactNode }) => <>{children}</>,
  PerpsDialogContent: () => null,
  PerpsDialogDescription: () => null,
  PerpsDialogHeader: () => null,
  PerpsDialogInnerContent: () => null,
  PerpsDialogTitle: () => null,
  PerpsDialogTrigger: ({
    children,
    disabled,
  }: {
    children: ReactElement<ComponentProps<'button'>>
    disabled?: boolean
  }) => cloneElement(children, { disabled }),
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

  it('disables the default and custom deposit triggers for subaccounts', () => {
    selectAccount('sub')

    const markup = renderToStaticMarkup(<DepositDialog />)
    expect(markup).toContain('Deposit')
    expect(markup).toContain('disabled=""')
    expect(
      renderToStaticMarkup(
        <DepositDialog trigger={<button type="button">Fund account</button>} />,
      ),
    ).toBe('<button type="button" disabled="">Fund account</button>')
  })

  it.each(['master', 'vault'] as const)(
    'preserves an enabled deposit trigger for %s accounts',
    (type) => {
      selectAccount(type)

      const markup = renderToStaticMarkup(<DepositDialog />)
      expect(markup).toContain('Deposit')
      expect(markup).not.toContain('disabled')
    },
  )
})
