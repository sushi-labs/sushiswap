/** @vitest-environment jsdom */

import { type SVGProps, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { IconButton } from '../../../../../packages/ui/src/components/iconbutton'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function TestIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...props} />
}

describe('IconButton', () => {
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

  it('uses native button and accessible-name semantics by default', () => {
    const onClick = vi.fn()
    act(() => {
      root.render(
        <IconButton icon={TestIcon} name="Open details" onClick={onClick} />,
      )
    })

    const button = container.querySelector('button')
    expect(button).not.toBeNull()
    expect(button?.type).toBe('button')
    expect(button?.getAttribute('aria-label')).toBe('Open details')
    expect(button?.tabIndex).toBe(0)

    button?.focus()
    expect(document.activeElement).toBe(button)
    button?.click()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('preserves native disabled behavior', () => {
    const onClick = vi.fn()
    act(() => {
      root.render(
        <IconButton
          disabled
          icon={TestIcon}
          name="Open details"
          onClick={onClick}
        />,
      )
    })

    const button = container.querySelector('button')
    expect(button?.disabled).toBe(true)
    button?.click()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('merges icon content into an asChild link', () => {
    act(() => {
      root.render(
        <IconButton asChild icon={TestIcon} name="Open explorer">
          <a href="https://example.com">Explorer</a>
        </IconButton>,
      )
    })

    expect(container.querySelector('button')).toBeNull()
    const link = container.querySelector('a')
    expect(link?.getAttribute('aria-label')).toBe('Open explorer')
    expect(link?.querySelector('svg')).not.toBeNull()
  })
})
