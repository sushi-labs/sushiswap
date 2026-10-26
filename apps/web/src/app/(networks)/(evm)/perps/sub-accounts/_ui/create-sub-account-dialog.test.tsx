/** @vitest-environment jsdom */

import {
  type ComponentProps,
  type PropsWithChildren,
  act,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
} from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateSubAccountDialog } from './create-sub-account-dialog'

const mocks = vi.hoisted(() => ({
  useAccount: vi.fn(),
  useCreateSubAccount: vi.fn(),
  createSubAccount: vi.fn(),
  reset: vi.fn(),
}))

vi.mock('src/lib/wallet', () => ({ useAccount: mocks.useAccount }))
vi.mock('src/lib/perps/exchange/use-create-sub-account', () => ({
  useCreateSubAccount: mocks.useCreateSubAccount,
}))
vi.mock('src/lib/wagmi/systems/checker', () => ({
  Checker: {
    Connect: ({ children }: PropsWithChildren) =>
      mocks.useAccount() ? (
        <>{children}</>
      ) : (
        <button type="button">Connect Wallet</button>
      ),
  },
}))
vi.mock('~evm/perps/_ui/perps-checker', () => ({
  PerpsChecker: {
    Legal: ({ children }: PropsWithChildren) => <>{children}</>,
    EnableTrading: ({ children }: PropsWithChildren) => <>{children}</>,
  },
}))
vi.mock('@sushiswap/ui', () => {
  const DialogContext = createContext({
    open: false,
    onOpenChange: (_open: boolean): void => {},
  })

  function Wrapper({ children }: PropsWithChildren) {
    return <>{children}</>
  }

  return {
    Button: ({
      children,
      type,
      disabled,
      onClick,
    }: ComponentProps<'button'>) => (
      <button type={type} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    ),
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
    PerpsDialogTrigger: ({ children }: PropsWithChildren) => {
      const { onOpenChange } = useContext(DialogContext)
      return isValidElement<{ onClick: () => void }>(children)
        ? cloneElement(children, { onClick: () => onOpenChange(true) })
        : null
    },
    PerpsDialogContent: ({ children }: PropsWithChildren) => {
      const { open } = useContext(DialogContext)
      return open ? <div role="dialog">{children}</div> : null
    },
    PerpsDialogHeader: Wrapper,
    PerpsDialogDescription: Wrapper,
    PerpsDialogInnerContent: Wrapper,
    PerpsDialogTitle: Wrapper,
    TextField: ({
      onValueChange,
      ...props
    }: ComponentProps<'input'> & {
      onValueChange: (value: string) => void
    }) => (
      <input
        {...props}
        onChange={(event) => onValueChange(event.target.value)}
      />
    ),
  }
})

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const masterAddress = '0x0000000000000000000000000000000000000001'
const otherAddress = '0x0000000000000000000000000000000000000002'

type MutationCallbacks = {
  onSuccess: () => void
  onSettled: () => void
}

describe('CreateSubAccountDialog', () => {
  let container: HTMLDivElement
  let root: Root

  function render(): void {
    act(() => root.render(<CreateSubAccountDialog />))
  }

  function button(label: string): HTMLButtonElement {
    const found = Array.from(container.querySelectorAll('button')).find(
      (element) => element.textContent === label,
    )
    if (!found) throw new Error(`Button not found: ${label}`)
    return found
  }

  function changeName(name: string): void {
    const input = container.querySelector('input')
    if (!input) throw new Error('Name input not found')
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set
    act(() => {
      setter?.call(input, name)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.createSubAccount.mockReset()
    mocks.useAccount.mockReturnValue(masterAddress)
    mocks.useCreateSubAccount.mockReturnValue({
      createSubAccount: mocks.createSubAccount,
      isPending: false,
      error: null,
      reset: mocks.reset,
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    render()
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('opens a blank name dialog from the Create Sub-Account button', () => {
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    act(() => button('Create Sub-Account').click())

    expect(container.querySelector('[role="dialog"]')).not.toBeNull()
    expect(container.querySelector('input')?.value).toBe('')
    expect(button('Confirm').disabled).toBe(true)
    expect(mocks.reset).toHaveBeenCalledOnce()
  })

  it('requires a trimmed name between one and sixteen characters', () => {
    act(() => button('Create Sub-Account').click())
    changeName('   ')
    expect(button('Confirm').disabled).toBe(true)
    changeName('a'.repeat(17))
    expect(button('Confirm').disabled).toBe(true)
    changeName('a'.repeat(16))
    expect(button('Confirm').disabled).toBe(false)
    changeName('a')
    expect(button('Confirm').disabled).toBe(false)
    expect(mocks.createSubAccount).not.toHaveBeenCalled()
  })

  it('creates the trimmed name for the connected master and closes after success', () => {
    mocks.createSubAccount.mockImplementation(
      (_variables: unknown, callbacks: MutationCallbacks) => {
        callbacks.onSuccess()
        callbacks.onSettled()
      },
    )
    act(() => button('Create Sub-Account').click())
    changeName('  New account  ')
    act(() => button('Confirm').click())

    expect(mocks.useAccount).toHaveBeenCalledWith('evm')
    expect(mocks.createSubAccount).toHaveBeenCalledWith(
      { masterAddress, name: 'New account' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onSettled: expect.any(Function),
      }),
    )
    expect(container.querySelector('[role="dialog"]')).toBeNull()

    act(() => button('Create Sub-Account').click())
    expect(container.querySelector('input')?.value).toBe('')
  })

  it('cancels without creating and clears an unsaved name on reopen', () => {
    act(() => button('Create Sub-Account').click())
    changeName('Unsaved account')
    act(() => button('Cancel').click())
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    expect(mocks.createSubAccount).not.toHaveBeenCalled()

    act(() => button('Create Sub-Account').click())
    expect(container.querySelector('input')?.value).toBe('')
    expect(mocks.reset).toHaveBeenCalledTimes(2)
  })

  it('preserves the draft and shows rejected requests so they can be retried', () => {
    act(() => button('Create Sub-Account').click())
    changeName('New account')
    act(() => button('Confirm').click())
    const callbacks = mocks.createSubAccount.mock
      .calls[0][1] as MutationCallbacks
    act(() => callbacks.onSettled())
    mocks.useCreateSubAccount.mockReturnValue({
      createSubAccount: mocks.createSubAccount,
      isPending: false,
      error: new Error('User rejected request'),
      reset: mocks.reset,
    })
    render()

    expect(container.querySelector('[role="dialog"]')).not.toBeNull()
    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      'User rejected request',
    )
    expect(container.querySelector('input')?.value).toBe('New account')
    expect(button('Confirm').disabled).toBe(false)
    act(() => button('Confirm').click())
    expect(mocks.createSubAccount).toHaveBeenCalledTimes(2)
  })

  it('prevents duplicate submission before the mutation rerenders', () => {
    act(() => button('Create Sub-Account').click())
    changeName('New account')
    const confirm = button('Confirm')
    act(() => {
      confirm.click()
      confirm.click()
    })

    expect(mocks.createSubAccount).toHaveBeenCalledOnce()
  })

  it('disables the input, cancel, and confirmation while creating', () => {
    act(() => button('Create Sub-Account').click())
    changeName('New account')
    mocks.useCreateSubAccount.mockReturnValue({
      createSubAccount: mocks.createSubAccount,
      isPending: true,
      error: null,
      reset: mocks.reset,
    })
    render()

    expect(container.querySelector('input')?.disabled).toBe(true)
    expect(button('Cancel').disabled).toBe(true)
    expect(button('Confirm').disabled).toBe(true)
    act(() => button('Cancel').click())
    expect(container.querySelector('[role="dialog"]')).not.toBeNull()
    expect(mocks.createSubAccount).not.toHaveBeenCalled()
  })

  it('clears the draft when the connected wallet changes', () => {
    act(() => button('Create Sub-Account').click())
    changeName('Old wallet draft')
    mocks.useAccount.mockReturnValue(otherAddress)
    render()

    expect(container.querySelector('[role="dialog"]')).toBeNull()
    act(() => button('Create Sub-Account').click())
    expect(container.querySelector('input')?.value).toBe('')
    changeName('Other account')
    act(() => button('Confirm').click())
    expect(mocks.createSubAccount).toHaveBeenCalledWith(
      { masterAddress: otherAddress, name: 'Other account' },
      expect.any(Object),
    )
  })

  it('requires a connected wallet before submission', () => {
    mocks.useAccount.mockReturnValue(undefined)
    render()
    act(() => button('Create Sub-Account').click())
    changeName('New account')

    expect(button('Connect Wallet')).toBeDefined()
    expect(
      Array.from(container.querySelectorAll('button')).some(
        (element) => element.textContent === 'Confirm',
      ),
    ).toBe(false)
    expect(mocks.createSubAccount).not.toHaveBeenCalled()
  })
})
