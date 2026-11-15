/** @vitest-environment jsdom */

import { act, createElement, useState } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { EvmChainId } from 'sushi/evm'
import type { Address } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { UseBalancesReturn } from './types'

const mocks = vi.hoisted(() => ({
  multicall: vi.fn(),
  config: { getClient: () => ({}) },
  connection: { address: '0x00000000000000000000000000000000000000aa' },
}))

vi.mock('wagmi', () => ({
  useConnection: () => mocks.connection,
  useConfig: () => mocks.config,
}))

vi.mock('viem/actions', () => ({
  multicall: mocks.multicall,
}))

import { BalanceProvider } from './balance-provider'
import { useEvmBalances } from './use-evm-balances'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const token: Address = '0x00000000000000000000000000000000000000bb'

let result: UseBalancesReturn<EvmChainId> | undefined
let renders = 0
let rerender: () => void = () => {}

// Passes a new (but equal) token array on every render, as callers often do.
function Consumer() {
  const [, setTick] = useState(0)
  rerender = () => setTick((tick) => tick + 1)
  renders += 1
  result = useEvmBalances(EvmChainId.ETHEREUM, [token])
  return null
}

function Sibling() {
  // Mounting a second consumer shows whether the first one's balance survived.
  result = useEvmBalances(EvmChainId.ETHEREUM, [token])
  return null
}

async function flush() {
  await act(async () => {
    await Promise.resolve()
  })
}

describe('BalanceProvider subscriptions', () => {
  let container: HTMLDivElement
  let root: Root

  function render(child: () => null) {
    act(() =>
      root.render(createElement(BalanceProvider, null, createElement(child))),
    )
  }

  beforeEach(() => {
    vi.useFakeTimers()
    mocks.multicall.mockReset()
    mocks.multicall.mockResolvedValue([
      { status: 'success', result: 5n },
      { status: 'success', result: 7n },
    ])
    result = undefined
    renders = 0
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.useRealTimers()
  })

  it('fetches an uncached token immediately', async () => {
    render(Consumer)
    await flush()

    expect(mocks.multicall).toHaveBeenCalledTimes(1)
    expect(result?.data?.get(token)).toBe(5n)
  })

  it('does not refetch or loop when a consumer re-renders with an equal array', async () => {
    render(Consumer)
    await flush()
    const rendersAfterLoad = renders

    act(() => rerender())
    await flush()

    // One render for the state update; the resubscription itself must not
    // cause another.
    expect(renders).toBe(rendersAfterLoad + 1)
    expect(mocks.multicall).toHaveBeenCalledTimes(1)
    expect(result?.data?.get(token)).toBe(5n)
  })

  it('keeps the cached balance for a remount before the sweep', async () => {
    render(Consumer)
    await flush()

    render(Sibling)
    await flush()

    expect(mocks.multicall).toHaveBeenCalledTimes(1)
    expect(result?.data?.get(token)).toBe(5n)
  })

  it('evicts an unsubscribed balance on the sweep', async () => {
    render(Consumer)
    await flush()

    act(() => root.render(createElement(BalanceProvider, null)))
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    render(Sibling)

    // The balance was pruned, so the new consumer waits for a fresh fetch.
    expect(result?.data).toBeUndefined()

    await flush()

    expect(mocks.multicall).toHaveBeenCalledTimes(2)
    expect(result?.data?.get(token)).toBe(5n)
  })
})
