/** @vitest-environment jsdom */

import {
  type ComponentProps,
  type PropsWithChildren,
  type ReactElement,
  act,
  cloneElement,
  createContext,
  useContext,
  useState,
} from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { EvmChainId } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import type { ActiveAccount } from '~evm/perps/active-account-state'
import {
  type AnyTokenDepositOption,
  DepositDialog,
  type HyperunitDepositOption,
} from './deposit-dialog'

vi.mock('@sushiswap/ui', () => {
  const DialogContext = createContext(false)
  const SelectContext = createContext({
    value: '',
    onValueChange: (_value: string): void => {},
  })

  function Wrapper({ children }: PropsWithChildren) {
    return <>{children}</>
  }

  return {
    Button: ({ children, disabled }: ComponentProps<'button'>) => (
      <button type="button" disabled={disabled}>
        {children}
      </button>
    ),
    Currency: { Icon: () => null },
    PerpsDialog: ({ children, open }: PropsWithChildren<{ open: boolean }>) => (
      <DialogContext.Provider value={open}>{children}</DialogContext.Provider>
    ),
    PerpsDialogContent: ({ children }: PropsWithChildren) =>
      useContext(DialogContext) ? <div role="dialog">{children}</div> : null,
    PerpsDialogDescription: Wrapper,
    PerpsDialogHeader: Wrapper,
    PerpsDialogInnerContent: Wrapper,
    PerpsDialogTitle: Wrapper,
    PerpsDialogTrigger: ({
      children,
      disabled,
    }: {
      children: ReactElement<ComponentProps<'button'>>
      disabled?: boolean
    }) => cloneElement(children, { disabled }),
    Select: ({
      children,
      value,
      onValueChange,
    }: PropsWithChildren<{
      value: string
      onValueChange: (value: string) => void
    }>) => (
      <SelectContext.Provider value={{ value, onValueChange }}>
        {children}
      </SelectContext.Provider>
    ),
    SelectContent: Wrapper,
    SelectItem: ({ children, value }: PropsWithChildren<{ value: string }>) => {
      const select = useContext(SelectContext)
      return (
        <button
          type="button"
          role="option"
          data-value={value}
          aria-selected={value === select.value}
          onClick={() => select.onValueChange(value)}
        >
          {children}
        </button>
      )
    },
    SelectTrigger: Wrapper,
    classNames: (...classes: string[]) => classes.join(' '),
  }
})
vi.mock('@sushiswap/ui/icons/network-icon', () => ({
  NetworkIcon: () => null,
}))
vi.mock('src/app/(networks)/_ui/sidebar', () => ({
  useSidebar: () => ({ isOpen: false }),
}))
vi.mock('~evm/perps/active-account-provider', () => ({
  useActiveAccountState: vi.fn(),
}))
vi.mock('./any-token-deposit', () => ({
  AnyTokenDeposit: ({
    depositOption,
  }: { depositOption: AnyTokenDepositOption }) => {
    const [bridgeComplete, setBridgeComplete] = useState(false)
    return (
      <div
        data-testid="any-token-deposit"
        data-chain-id={depositOption.chainId}
        data-deposit-type={depositOption.type}
      >
        {depositOption.label}
        <button type="button" onClick={() => setBridgeComplete(true)}>
          {bridgeComplete ? 'Bridge complete' : 'Start bridge'}
        </button>
      </div>
    )
  },
}))
vi.mock('./hyperunit/hyperunit-options', () => ({
  HyperunitOptions: ({
    depositOption,
  }: { depositOption: HyperunitDepositOption }) => (
    <div data-testid="unit-deposit">{depositOption.label}</div>
  ),
}))
vi.mock('./usdc-options', () => ({
  USDCOptions: ({ depositChainId }: { depositChainId: EvmChainId }) => (
    <div data-testid="usdc-deposit" data-chain-id={depositChainId} />
  ),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

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

describe('DepositDialog chain selection', () => {
  let container: HTMLDivElement
  let root: Root

  function selectChain(chainId: EvmChainId | 'Bitcoin'): void {
    const option = container.querySelector<HTMLButtonElement>(
      `[role="option"][data-value="${chainId}"]`,
    )
    if (!option) throw new Error(`Chain option not found: ${chainId}`)
    act(() => option.click())
  }

  beforeEach(() => {
    vi.clearAllMocks()
    selectAccount('master')
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    act(() => root.render(<DepositDialog isOpen />))
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it.each([EvmChainId.ETHEREUM, EvmChainId.ROBINHOOD])(
    'uses the any-token cross-chain flow for chain %s',
    (chainId) => {
      selectChain(chainId)

      const deposit = container.querySelector(
        '[data-testid="any-token-deposit"]',
      )
      expect(deposit?.getAttribute('data-chain-id')).toBe(String(chainId))
      expect(deposit?.getAttribute('data-deposit-type')).toBe(
        'any-token-any-chain',
      )
      expect(deposit?.textContent).toContain('Any Token')
      expect(container.querySelector('[data-testid="unit-deposit"]')).toBeNull()
    },
  )

  it('preserves the direct USDC, same-chain swap, and Unit deposit flows', () => {
    expect(
      container
        .querySelector('[data-testid="usdc-deposit"]')
        ?.getAttribute('data-chain-id'),
    ).toBe(String(EvmChainId.HYPEREVM))

    selectChain(EvmChainId.ARBITRUM)
    expect(
      container
        .querySelector('[data-testid="any-token-deposit"]')
        ?.getAttribute('data-deposit-type'),
    ).toBe('any-token')

    selectChain('Bitcoin')
    expect(
      container.querySelector('[data-testid="unit-deposit"]')?.textContent,
    ).toBe('BTC (Bitcoin)')
  })

  it('resets the deposit flow when switching between cross-chain sources', () => {
    selectChain(EvmChainId.ETHEREUM)
    const startBridge = container.querySelector<HTMLButtonElement>(
      '[data-testid="any-token-deposit"] button',
    )
    if (!startBridge) throw new Error('Bridge button not found')
    act(() => startBridge.click())
    expect(container.textContent).toContain('Bridge complete')

    selectChain(EvmChainId.ROBINHOOD)
    expect(container.textContent).toContain('Start bridge')
    expect(container.textContent).not.toContain('Bridge complete')
  })
})
