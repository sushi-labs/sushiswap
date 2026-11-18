/** @vitest-environment jsdom */

import { type ReactNode, act } from 'react'
import { type Root, createRoot, hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SelectWalletButton } from './select-wallet-button'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const mocks = vi.hoisted(() => ({
  isPending: false,
  isOpen: false,
  open: vi.fn(),
  close: vi.fn(),
}))

vi.mock('@sushiswap/ui', async () => ({
  Button: (await import('../../../../../../packages/ui/src/components/button'))
    .Button,
}))

vi.mock('@sushiswap/telemetry', () => ({
  BrowserEvent: { onClick: 'onClick' },
  InterfaceElementName: { CONNECT_WALLET_BUTTON: 'connect-wallet-button' },
  InterfaceEventName: {
    CONNECT_WALLET_BUTTON_CLICKED: 'connect-wallet-clicked',
  },
  TraceEvent: ({ children }: { children: ReactNode }) => children,
}))

vi.mock('src/app/(networks)/_ui/sidebar', () => ({
  useSidebar: () => mocks,
}))

vi.mock('src/app/(networks)/_ui/sidebar/sidebar-provider', () => ({
  useSidebar: () => ({ ...mocks, contentId: 'wallet-sidebar' }),
}))

vi.mock('../provider', () => ({
  useWalletContext: () => ({ isPending: mocks.isPending }),
}))

describe('SelectWalletButton', () => {
  let container: HTMLDivElement
  let root: Root | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.isPending = false
    mocks.isOpen = false
    container = document.createElement('div')
    document.body.append(container)
    root = undefined
  })

  afterEach(() => {
    act(() => root?.unmount())
    container.remove()
    vi.restoreAllMocks()
  })

  it('hydrates when reconnection starts before the button hydrates', async () => {
    const button = <SelectWalletButton namespace="evm" />
    container.innerHTML = renderToString(button)
    expect(container.textContent).toContain('Connect Wallet')

    mocks.isPending = true
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onRecoverableError = vi.fn()

    await act(async () => {
      root = hydrateRoot(container, button, { onRecoverableError })
    })

    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    expect(container.textContent).toBe('Authorize Wallet')
    expect(container.querySelector('button')?.disabled).toBe(true)
  })

  it('preserves pending text and sidebar controls after mounting', async () => {
    const button = (
      <SelectWalletButton namespace="evm" pendingText="Connecting wallet">
        Choose wallet
      </SelectWalletButton>
    )
    mocks.isPending = true
    root = createRoot(container)

    await act(async () => root?.render(button))
    expect(container.textContent).toBe('Connecting wallet')
    expect(container.querySelector('button')?.disabled).toBe(true)

    mocks.isPending = false
    await act(async () => {
      root?.render(
        <SelectWalletButton namespace="evm" pendingText="Connecting wallet">
          Choose wallet
        </SelectWalletButton>,
      )
    })
    expect(container.textContent).toBe('Choose wallet')
    expect(container.querySelector('button')?.disabled).toBe(false)

    act(() => container.querySelector('button')?.click())
    expect(mocks.open).toHaveBeenCalledWith('connect', {
      namespace: 'evm',
      closeOnConnect: true,
    })

    mocks.isOpen = true
    await act(async () => {
      root?.render(<SelectWalletButton namespace="evm" />)
    })
    act(() => container.querySelector('button')?.click())
    expect(mocks.close).toHaveBeenCalledOnce()
  })
})
