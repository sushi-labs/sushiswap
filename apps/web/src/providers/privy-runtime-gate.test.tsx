/** @vitest-environment jsdom */

import { StrictMode, act, useEffect } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { privyRuntimeStore } from '../lib/wallet/privy/privy-runtime-store'
import { PrivyRuntimeGate } from './privy-runtime-gate'

const runtimeLifecycle = vi.hoisted(() => ({
  rendered: vi.fn(),
}))

vi.mock('../lib/wallet/privy-storage', () => ({
  hasStoredPrivySession: () => false,
  isPrivyOAuthCallback: () => false,
  isPrivySessionStorageKey: () => false,
}))

vi.mock('./privy-runtime', () => ({
  PrivyRuntime() {
    runtimeLifecycle.rendered()
    return <output data-privy-runtime="mounted" />
  },
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function HostOrderingProbe({
  onParentEffect,
}: {
  onParentEffect(hostMounted: boolean): void
}) {
  useEffect(() => {
    onParentEffect(privyRuntimeStore.getSnapshot().hostMounted)
  }, [onParentEffect])
  return <PrivyRuntimeGate />
}

describe('PrivyRuntimeGate', () => {
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

  it('honors pre-subscription requests and keeps its host registered in Strict Mode', async () => {
    const setError = vi.spyOn(privyRuntimeStore, 'setError')
    const onParentEffect = vi.fn()
    await import('./privy-runtime')
    privyRuntimeStore.requestRuntime()

    await act(async () => {
      root.render(
        <StrictMode>
          <HostOrderingProbe onParentEffect={onParentEffect} />
        </StrictMode>,
      )
    })
    for (let index = 0; index < 10; index += 1) {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0))
      })
      if (container.querySelector('[data-privy-runtime="mounted"]')) break
    }
    expect(setError).not.toHaveBeenCalled()
    const snapshot = privyRuntimeStore.getSnapshot()
    expect(snapshot).toMatchObject({
      status: 'loading',
    })
    expect(runtimeLifecycle.rendered).toHaveBeenCalled()
    expect(container.innerHTML).toContain('data-privy-runtime')

    expect(privyRuntimeStore.getSnapshot().hostMounted).toBe(true)
    expect(onParentEffect).toHaveBeenCalledWith(true)

    const renderCount = runtimeLifecycle.rendered.mock.calls.length
    await act(async () => {
      privyRuntimeStore.restartRuntime()
    })
    expect(runtimeLifecycle.rendered.mock.calls.length).toBeGreaterThan(
      renderCount,
    )

    act(() => root.unmount())
    expect(privyRuntimeStore.getSnapshot().hostMounted).toBe(false)
    root = createRoot(container)
  })
})
