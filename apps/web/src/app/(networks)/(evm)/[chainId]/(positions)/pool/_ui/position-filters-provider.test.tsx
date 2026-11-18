/** @vitest-environment jsdom */

import { Suspense, act } from 'react'
import { type Root, createRoot, hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { EvmChainId } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  PositionFiltersProvider,
  usePositionFilters,
} from './position-filters-provider'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const mocks = vi.hoisted(() => ({ search: '' }))

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(mocks.search),
}))

function Probe(): React.ReactNode {
  const {
    state: { tab },
    mutate: { setTab },
  } = usePositionFilters()

  return (
    <>
      <output>{tab}</output>
      {tab === 'v3' ? <div>Hide closed</div> : null}
      <button type="button" onClick={() => setTab(tab === 'v3' ? 'v2' : 'v3')}>
        Switch protocol
      </button>
    </>
  )
}

describe('PositionFiltersProvider', () => {
  let container: HTMLDivElement
  let root: Root | undefined

  beforeEach(() => {
    mocks.search = ''
    localStorage.clear()
    container = document.createElement('div')
    document.body.append(container)
    root = undefined
  })

  afterEach(() => {
    act(() => root?.unmount())
    container.remove()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('hydrates the default protocol before restoring the saved protocol', async () => {
    const page = (
      <PositionFiltersProvider chainId={EvmChainId.POLYGON}>
        <Probe />
      </PositionFiltersProvider>
    )
    container.innerHTML = renderToString(page)
    expect(container.querySelector('output')?.textContent).toBe('v3')
    localStorage.setItem('tab', JSON.stringify('v2'))
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onRecoverableError = vi.fn()

    await act(async () => {
      root = hydrateRoot(container, page, { onRecoverableError })
    })

    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    expect(container.querySelector('output')?.textContent).toBe('v2')
    expect(container.textContent).not.toContain('Hide closed')
    expect(localStorage.getItem('tab')).toBe(JSON.stringify('v2'))
  })

  it('uses the server default for consumers that hydrate after the provider', async () => {
    const hydration = Promise.withResolvers<void>()
    let shouldSuspend = false

    function DelayedProbe(): React.ReactNode {
      if (shouldSuspend) throw hydration.promise
      return <Probe />
    }

    const page = (
      <PositionFiltersProvider chainId={EvmChainId.POLYGON}>
        <Suspense fallback={<div>Loading positions</div>}>
          <DelayedProbe />
        </Suspense>
      </PositionFiltersProvider>
    )
    container.innerHTML = renderToString(page)
    localStorage.setItem('tab', JSON.stringify('v2'))
    shouldSuspend = true
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onRecoverableError = vi.fn()

    await act(async () => {
      root = hydrateRoot(container, page, { onRecoverableError })
    })
    expect(container.querySelector('output')?.textContent).toBe('v3')

    await act(async () => {
      shouldSuspend = false
      hydration.resolve()
    })

    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    expect(container.querySelector('output')?.textContent).toBe('v2')
  })

  it('persists protocol changes after mounting', async () => {
    localStorage.setItem('tab', JSON.stringify('v2'))
    root = createRoot(container)
    await act(async () => {
      root?.render(
        <PositionFiltersProvider chainId={EvmChainId.POLYGON}>
          <Probe />
        </PositionFiltersProvider>,
      )
    })
    expect(container.querySelector('output')?.textContent).toBe('v2')

    await act(async () => container.querySelector('button')?.click())

    expect(container.querySelector('output')?.textContent).toBe('v3')
    expect(container.textContent).toContain('Hide closed')
    expect(localStorage.getItem('tab')).toBe(JSON.stringify('v3'))
  })

  it('hydrates and persists the URL protocol over a different saved protocol', async () => {
    mocks.search = 'tab=v3'
    const page = (
      <PositionFiltersProvider chainId={EvmChainId.POLYGON}>
        <Probe />
      </PositionFiltersProvider>
    )
    container.innerHTML = renderToString(page)
    expect(container.querySelector('output')?.textContent).toBe('v3')
    localStorage.setItem('tab', JSON.stringify('v2'))
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onRecoverableError = vi.fn()

    await act(async () => {
      root = hydrateRoot(container, page, { onRecoverableError })
    })

    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    expect(container.querySelector('output')?.textContent).toBe('v3')
    expect(localStorage.getItem('tab')).toBe(JSON.stringify('v3'))
  })

  it('selects a valid protocol when the URL changes after mounting', async () => {
    mocks.search = 'tab=v2'
    root = createRoot(container)
    await act(async () => {
      root?.render(
        <PositionFiltersProvider chainId={EvmChainId.POLYGON}>
          <Probe />
        </PositionFiltersProvider>,
      )
    })
    expect(container.querySelector('output')?.textContent).toBe('v2')

    mocks.search = 'tab=v3'
    await act(async () => {
      root?.render(
        <PositionFiltersProvider chainId={EvmChainId.POLYGON}>
          <Probe />
        </PositionFiltersProvider>,
      )
    })

    expect(container.querySelector('output')?.textContent).toBe('v3')
    expect(localStorage.getItem('tab')).toBe(JSON.stringify('v3'))
  })

  it.each([
    { search: 'tab=invalid', chainId: EvmChainId.POLYGON },
    { search: 'tab=v3', chainId: EvmChainId.CELO },
  ])(
    'ignores $search when unsupported on chain $chainId',
    async ({ search, chainId }) => {
      mocks.search = search
      localStorage.setItem('tab', JSON.stringify('v2'))
      root = createRoot(container)
      await act(async () => {
        root?.render(
          <PositionFiltersProvider chainId={chainId}>
            <Probe />
          </PositionFiltersProvider>,
        )
      })

      expect(container.querySelector('output')?.textContent).toBe('v2')
      expect(localStorage.getItem('tab')).toBe(JSON.stringify('v2'))
    },
  )

  it('allows manual selection after applying the URL protocol', async () => {
    mocks.search = 'tab=v3'
    root = createRoot(container)
    await act(async () => {
      root?.render(
        <PositionFiltersProvider chainId={EvmChainId.POLYGON}>
          <Probe />
        </PositionFiltersProvider>,
      )
    })

    await act(async () => container.querySelector('button')?.click())
    await act(async () => {
      root?.render(
        <PositionFiltersProvider chainId={EvmChainId.POLYGON}>
          <Probe />
        </PositionFiltersProvider>,
      )
    })

    expect(container.querySelector('output')?.textContent).toBe('v2')
    expect(localStorage.getItem('tab')).toBe(JSON.stringify('v2'))
  })

  it('reapplies the URL protocol when navigating to another chain', async () => {
    mocks.search = 'tab=v3'
    root = createRoot(container)
    await act(async () => {
      root?.render(
        <PositionFiltersProvider chainId={EvmChainId.POLYGON}>
          <Probe />
        </PositionFiltersProvider>,
      )
    })
    await act(async () => container.querySelector('button')?.click())
    expect(container.querySelector('output')?.textContent).toBe('v2')

    await act(async () => {
      root?.render(
        <PositionFiltersProvider chainId={EvmChainId.ETHEREUM}>
          <Probe />
        </PositionFiltersProvider>,
      )
    })

    expect(container.querySelector('output')?.textContent).toBe('v3')
    expect(localStorage.getItem('tab')).toBe(JSON.stringify('v3'))
  })
})
