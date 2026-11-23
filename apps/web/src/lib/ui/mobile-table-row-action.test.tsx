/** @vitest-environment jsdom */

import { type ReactNode, act } from 'react'
import { createPortal } from 'react-dom'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MobileTableRowAction } from '../../../../../packages/ui/src/components/mobile-table/mobile-table-row-action'

const push = vi.hoisted(() => vi.fn())
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('MobileTableRowAction', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    push.mockClear()
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function render(content: ReactNode): HTMLElement {
    act(() => root.render(content))
    return container.firstElementChild as HTMLElement
  }

  function keyDown(element: Element, key: string): void {
    element.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    )
  }

  it('leaves a row without an action outside the tab order', () => {
    const row = render(
      <MobileTableRowAction>
        <span>Position</span>
      </MobileTableRowAction>,
    )
    expect(row.textContent).toBe('Position')
    expect(container.querySelector('[role], a, button, [tabindex]')).toBeNull()
  })

  it('activates a callback-only row with click, Enter, and Space', () => {
    const onClick = vi.fn()
    const row = render(
      <MobileTableRowAction label="Select position" onClick={onClick}>
        <span>Position</span>
      </MobileTableRowAction>,
    )
    expect(row.getAttribute('role')).toBe('button')
    expect(row.tabIndex).toBe(0)
    expect(row.getAttribute('aria-label')).toBe('Select position')
    row.querySelector('span')!.click()
    keyDown(row, 'Enter')
    keyDown(row, ' ')
    expect(onClick).toHaveBeenCalledTimes(3)
    expect(push).not.toHaveBeenCalled()
  })

  it('runs the row callback once before each link navigation', () => {
    const onClick = vi.fn()
    const row = render(
      <MobileTableRowAction href="/pool" label="View pool" onClick={onClick}>
        <span>Pool</span>
      </MobileTableRowAction>,
    )
    expect(row.getAttribute('role')).toBe('link')
    expect(row.tabIndex).toBe(0)
    row.querySelector('span')!.click()
    keyDown(row, 'Enter')
    keyDown(row, ' ')
    expect(onClick).toHaveBeenCalledTimes(2)
    expect(push.mock.calls).toEqual([['/pool'], ['/pool']])
    for (const [index, order] of onClick.mock.invocationCallOrder.entries()) {
      expect(order).toBeLessThan(push.mock.invocationCallOrder[index])
    }
  })

  it('preserves nested controls, canceled events, and portaled content', () => {
    const onClick = vi.fn()
    const nestedAction = vi.fn()
    const row = render(
      <MobileTableRowAction href="/pool" label="View pool" onClick={onClick}>
        <button type="button" onClick={nestedAction}>
          Expand
        </button>
        <a href="#details">Details</a>
        <span aria-haspopup="menu">
          <span>Actions</span>
        </span>
        <span
          id="invert-price"
          onClickCapture={(event) => event.preventDefault()}
        >
          Invert price
        </span>
        {createPortal(<span data-portal="">Menu content</span>, document.body)}
      </MobileTableRowAction>,
    )
    const button = row.querySelector('button')!
    button.click()
    keyDown(button, 'Enter')
    row.querySelector('a')!.click()
    row.querySelector<HTMLElement>('[aria-haspopup] span')!.click()
    row.querySelector<HTMLElement>('#invert-price')!.click()
    document.querySelector<HTMLElement>('[data-portal]')!.click()
    expect(nestedAction).toHaveBeenCalledOnce()
    expect(onClick).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })
})
