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
import type { LifiPerpsDepositExecution } from 'src/lib/perps/deposit/use-lifi-perps-deposit-execution'
import { EvmChainId } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import type { ActiveAccount } from '~evm/perps/active-account-state'
import { ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS } from './any-token-deposit-config'
import {
  type AnyTokenDepositOption,
  DepositDialog,
  type HyperunitDepositOption,
} from './deposit-dialog'

vi.mock('@sushiswap/ui', () => {
  const DialogContext = createContext({
    open: false,
    onOpenChange: (_open: boolean): void => {},
  })
  const SelectContext = createContext({
    value: '',
    disabled: false,
    onValueChange: (_value: string): void => {},
  })

  function Wrapper({ children }: PropsWithChildren) {
    return <>{children}</>
  }

  return {
    Button: ({ children, disabled, onClick }: ComponentProps<'button'>) => (
      <button type="button" disabled={disabled} onClick={onClick}>
        {children}
      </button>
    ),
    Currency: { Icon: () => null },
    PerpsDialog: ({
      children,
      open,
      onOpenChange,
    }: PropsWithChildren<{
      open: boolean
      onOpenChange: (open: boolean) => void
    }>) => (
      <DialogContext.Provider value={{ open, onOpenChange }}>
        {children}
      </DialogContext.Provider>
    ),
    PerpsDialogContent: ({ children }: PropsWithChildren) => {
      const dialog = useContext(DialogContext)
      return dialog.open ? (
        <div role="dialog">
          <button type="button" onClick={() => dialog.onOpenChange(false)}>
            Dismiss deposit
          </button>
          {children}
        </div>
      ) : null
    },
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
    }) => {
      const dialog = useContext(DialogContext)
      return cloneElement(children, {
        disabled,
        onClick: () => dialog.onOpenChange(true),
      })
    },
    Select: ({
      children,
      value,
      onValueChange,
      disabled = false,
    }: PropsWithChildren<{
      value: string
      onValueChange: (value: string) => void
      disabled?: boolean
    }>) => (
      <SelectContext.Provider value={{ value, onValueChange, disabled }}>
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
          disabled={select.disabled}
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
    execution,
  }: {
    depositOption: AnyTokenDepositOption
    execution?: LifiPerpsDepositExecution
  }) => {
    const [bridgeComplete, setBridgeComplete] = useState(false)
    return (
      <div
        data-testid="any-token-deposit"
        data-chain-id={depositOption.chainId}
        data-deposit-type={depositOption.type}
        data-submitted-hash={execution?.submitted?.hash}
        data-submitting={execution?.isSubmitting}
      >
        {depositOption.label}
        <button type="button" onClick={() => setBridgeComplete(true)}>
          {bridgeComplete ? 'Bridge complete' : 'Start bridge'}
        </button>
        {execution && depositOption.type === 'any-token-any-chain' && (
          <>
            <button
              type="button"
              onClick={() => execution.setIsSubmitting(true)}
            >
              Prepare deposit
            </button>
            <button
              type="button"
              onClick={() => {
                execution.setSubmitted({
                  hash: depositTxHash,
                  chainId: depositOption.chainId,
                  recipient: '0x0000000000000000000000000000000000000001',
                  bridge: 'across',
                  amount: '11000000',
                  minimumAmount: '10000000',
                })
                execution.setIsSubmitting(false)
              }}
            >
              Broadcast deposit
            </button>
            <button
              type="button"
              onClick={() => {
                execution.setSubmitted(undefined)
                execution.setIsSubmitting(false)
              }}
            >
              Reset deposit
            </button>
          </>
        )}
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

const depositTxHash =
  '0x0000000000000000000000000000000000000000000000000000000000000001'

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

  function clickButton(label: string): void {
    const element = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === label,
    )
    if (!element) throw new Error(`Button not found: ${label}`)
    act(() => element.click())
  }

  function expectSelectorsDisabled(disabled: boolean): void {
    const options =
      container.querySelectorAll<HTMLButtonElement>('[role="option"]')
    expect(options.length).toBeGreaterThan(0)
    for (const option of options) expect(option.disabled).toBe(disabled)
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

  it.each(ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS)(
    'uses the direct perps flow for configured chain %s',
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
      expect(
        container.querySelectorAll(`[role="option"][data-value="${chainId}"]`),
      ).toHaveLength(1)
      expect(container.querySelector('[data-testid="usdc-deposit"]')).toBeNull()
      expect(container.querySelector('[data-testid="unit-deposit"]')).toBeNull()
    },
  )

  it('defaults to the first configured source and keeps Unit deposits available', () => {
    const deposit = container.querySelector('[data-testid="any-token-deposit"]')
    expect(deposit?.getAttribute('data-chain-id')).toBe(
      String(ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS[0]),
    )
    expect(container.querySelector('[data-testid="usdc-deposit"]')).toBeNull()

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

  it('locks chain and deposit-method selectors while submitting or tracking', () => {
    selectChain(EvmChainId.ETHEREUM)
    expectSelectorsDisabled(false)
    clickButton('Prepare deposit')
    expectSelectorsDisabled(true)

    selectChain(EvmChainId.ROBINHOOD)
    expect(
      container
        .querySelector('[data-testid="any-token-deposit"]')
        ?.getAttribute('data-chain-id'),
    ).toBe(String(EvmChainId.ETHEREUM))

    clickButton('Broadcast deposit')
    expectSelectorsDisabled(true)
    clickButton('Reset deposit')
    expectSelectorsDisabled(false)
    selectChain(EvmChainId.ROBINHOOD)
    expect(
      container
        .querySelector('[data-testid="any-token-deposit"]')
        ?.getAttribute('data-chain-id'),
    ).toBe(String(EvmChainId.ROBINHOOD))
  })

  it.each(['Prepare deposit', 'Broadcast deposit'] as const)(
    'preserves execution after %s when the dialog is dismissed and reopened',
    (action) => {
      act(() => root.render(<DepositDialog />))
      clickButton('Deposit')
      selectChain(EvmChainId.ETHEREUM)
      clickButton(action)
      clickButton('Dismiss deposit')

      expect(container.querySelector('[role="dialog"]')).toBeNull()
      clickButton('Deposit')
      const deposit = container.querySelector(
        '[data-testid="any-token-deposit"]',
      )
      expect(deposit?.getAttribute('data-chain-id')).toBe(
        String(EvmChainId.ETHEREUM),
      )
      if (action === 'Broadcast deposit') {
        expect(deposit?.getAttribute('data-submitted-hash')).toBe(depositTxHash)
      } else {
        expect(deposit?.getAttribute('data-submitting')).toBe('true')
      }
      expectSelectorsDisabled(true)
    },
  )
})
