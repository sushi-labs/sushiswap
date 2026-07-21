/** @vitest-environment jsdom */

import { type ButtonHTMLAttributes, type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { EvmChainId, EvmToken } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@sushiswap/telemetry', () => ({
  BrowserEvent: { onClick: 'onClick', onKeyPress: 'onKeyPress' },
  InterfaceElementName: { TOKEN_SELECTOR_ROW: 'token-selector-row' },
  InterfaceEventName: { TOKEN_SELECTED: 'token-selected' },
  TraceEvent: ({ children }: PropsWithChildren) => children,
}))

vi.mock('@sushiswap/ui', () => ({
  Badge: ({ children }: PropsWithChildren) => children,
  Currency: { Icon: () => null },
  IconButton: ({
    name,
    onClick,
    onKeyDown,
    onKeyPress,
  }: ButtonHTMLAttributes<HTMLButtonElement> & { name: string }) => (
    <button
      type="button"
      aria-label={name}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyPress={onKeyPress}
    />
  ),
  SkeletonCircle: () => null,
  SkeletonText: () => null,
  Tooltip: ({ children }: PropsWithChildren) => children,
  TooltipContent: ({ children }: PropsWithChildren) => children,
  TooltipProvider: ({ children }: PropsWithChildren) => children,
  TooltipTrigger: ({ children }: PropsWithChildren) => children,
  classNames: (...values: unknown[]) => values.filter(Boolean).join(' '),
}))

import { TokenSelectorRow } from './token-selector-row'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const currency = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  symbol: 'TKN',
  name: 'Token',
  address: '0x0000000000000000000000000000000000000001',
  decimals: 18,
})

describe('TokenSelectorRow', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('uses a focusable native token selection control', () => {
    const onSelect = vi.fn()
    act(() => {
      root.render(
        <TokenSelectorRow
          currency={currency}
          onSelect={onSelect}
          showWarning={false}
          selected={false}
          isBalanceLoading={false}
          onShowInfo={vi.fn()}
        />,
      )
    })

    const selectButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Select TKN"]',
    )
    expect(selectButton?.tabIndex).toBe(0)

    selectButton?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', bubbles: true }),
    )
    expect(onSelect).not.toHaveBeenCalled()

    selectButton?.click()
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('keeps pin and info actions outside the selection button', () => {
    const onSelect = vi.fn()
    const onPin = vi.fn()
    const onShowInfo = vi.fn()
    act(() => {
      root.render(
        <TokenSelectorRow
          currency={currency}
          onSelect={onSelect}
          pin={{ isPinned: false, onPin }}
          showWarning={false}
          selected={false}
          isBalanceLoading={false}
          onShowInfo={onShowInfo}
        />,
      )
    })

    const selectButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Select TKN"]',
    )
    const pinButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="pin"]',
    )
    const infoButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="info"]',
    )

    expect(selectButton?.contains(pinButton)).toBe(false)
    expect(selectButton?.contains(infoButton)).toBe(false)

    pinButton?.click()
    infoButton?.click()
    expect(onPin).toHaveBeenCalledOnce()
    expect(onShowInfo).toHaveBeenCalledOnce()
    expect(onSelect).not.toHaveBeenCalled()
  })
})
