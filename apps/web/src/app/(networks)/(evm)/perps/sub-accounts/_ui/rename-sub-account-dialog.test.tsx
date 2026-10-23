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
import { RenameSubAccountDialog } from './rename-sub-account-dialog'

const mocks = vi.hoisted(() => ({
  useRenameSubAccount: vi.fn(),
  renameSubAccount: vi.fn(),
  reset: vi.fn(),
}))

vi.mock('src/lib/perps/exchange/use-rename-sub-account', () => ({
  MAX_SUB_ACCOUNT_NAME_LENGTH: 16,
  useRenameSubAccount: mocks.useRenameSubAccount,
}))
vi.mock('~evm/perps/_ui/perps-checker', () => ({
  PerpsChecker: {
    Legal: ({ children }: PropsWithChildren) => <>{children}</>,
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
    IconButton: ({ name, onClick }: ComponentProps<'button'>) => (
      <button type="button" aria-label={name} onClick={onClick} />
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
const subAccount = {
  subAccountUser: '0x0000000000000000000000000000000000000002',
  name: 'My account',
} as const

describe('RenameSubAccountDialog', () => {
  let container: HTMLDivElement
  let root: Root

  function render(): void {
    act(() => {
      root.render(
        <RenameSubAccountDialog
          masterAddress={masterAddress}
          subAccount={subAccount}
        />,
      )
    })
  }

  function button(label: string): HTMLButtonElement {
    const found = Array.from(container.querySelectorAll('button')).find(
      (element) =>
        element.textContent === label ||
        element.getAttribute('aria-label') === label,
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
    mocks.renameSubAccount.mockReset()
    mocks.useRenameSubAccount.mockReturnValue({
      renameSubAccount: mocks.renameSubAccount,
      isPending: false,
      error: null,
      reset: mocks.reset,
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    render()
    act(() => button('Rename My account').click())
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('opens the pencil dialog with the selected name and disables unchanged or blank names', () => {
    expect(container.querySelector('[role="dialog"]')).not.toBeNull()
    expect(container.querySelector('input')?.value).toBe('My account')
    expect(button('Confirm').disabled).toBe(true)
    expect(mocks.reset).toHaveBeenCalledOnce()

    changeName('   ')
    expect(button('Confirm').disabled).toBe(true)
    changeName('New name')
    expect(button('Confirm').disabled).toBe(false)
  })

  it('submits the selected sub-account and closes after success', () => {
    mocks.renameSubAccount.mockImplementation(
      (_variables: unknown, options: { onSuccess: () => void }) =>
        options.onSuccess(),
    )
    changeName('  Updated name  ')
    act(() => button('Confirm').click())

    expect(mocks.renameSubAccount).toHaveBeenCalledWith(
      {
        masterAddress,
        subAccountUser: subAccount.subAccountUser,
        name: 'Updated name',
      },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )
    expect(container.querySelector('[role="dialog"]')).toBeNull()
  })

  it('cancels without renaming and restores the saved name when reopened', () => {
    changeName('Unsaved name')
    act(() => button('Cancel').click())
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    expect(mocks.renameSubAccount).not.toHaveBeenCalled()

    act(() => button('Rename My account').click())
    expect(container.querySelector('input')?.value).toBe('My account')
  })

  it('keeps the form open and displays rejected requests', () => {
    mocks.renameSubAccount.mockImplementation(() => {})
    changeName('Updated name')
    act(() => button('Confirm').click())
    mocks.useRenameSubAccount.mockReturnValue({
      renameSubAccount: mocks.renameSubAccount,
      isPending: false,
      error: new Error('User rejected request'),
      reset: mocks.reset,
    })
    render()

    expect(container.querySelector('[role="dialog"]')).not.toBeNull()
    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      'User rejected request',
    )
    expect(container.querySelector('input')?.value).toBe('Updated name')
  })
})
