/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInitialWalletAutoConnectPending } from './use-initial-wallet-auto-connect-pending'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function Probe({
  getHasReconnectCandidate,
  isConnectionAttemptActive,
  timeoutMs,
}: {
  getHasReconnectCandidate: () => boolean | Promise<boolean>
  isConnectionAttemptActive: boolean
  timeoutMs?: number
}) {
  const isPending = useInitialWalletAutoConnectPending({
    getHasReconnectCandidate,
    isConnectionAttemptActive,
    timeoutMs,
  })

  return <output data-pending={isPending} />
}

describe('useInitialWalletAutoConnectPending', () => {
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
    vi.useRealTimers()
  })

  function isPending(): boolean {
    return container.querySelector('output')?.dataset.pending === 'true'
  }

  it('finishes immediately without a reconnect candidate', async () => {
    await act(async () => {
      root.render(
        <Probe
          getHasReconnectCandidate={() => false}
          isConnectionAttemptActive={false}
        />,
      )
    })

    expect(isPending()).toBe(false)
  })

  it('stays pending until the connection attempt starts', async () => {
    const getHasReconnectCandidate = vi.fn(() => true)

    await act(async () => {
      root.render(
        <Probe
          getHasReconnectCandidate={getHasReconnectCandidate}
          isConnectionAttemptActive={false}
        />,
      )
    })
    expect(isPending()).toBe(true)

    await act(async () => {
      root.render(
        <Probe
          getHasReconnectCandidate={getHasReconnectCandidate}
          isConnectionAttemptActive={true}
        />,
      )
    })

    expect(isPending()).toBe(false)
  })

  it('finishes after the fallback timeout', async () => {
    vi.useFakeTimers()

    await act(async () => {
      root.render(
        <Probe
          getHasReconnectCandidate={() => true}
          isConnectionAttemptActive={false}
          timeoutMs={1_000}
        />,
      )
    })

    act(() => vi.advanceTimersByTime(999))
    expect(isPending()).toBe(true)

    act(() => vi.advanceTimersByTime(1))
    expect(isPending()).toBe(false)
  })

  it('finishes when reconnect detection fails', async () => {
    await act(async () => {
      root.render(
        <Probe
          getHasReconnectCandidate={() => Promise.reject(new Error('failed'))}
          isConnectionAttemptActive={false}
        />,
      )
    })

    expect(isPending()).toBe(false)
  })
})
