/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  STELLAR_USDC,
  STELLAR_XLM,
  type StellarAccountAddress,
  StellarChainId,
} from 'sushi/stellar'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Trustline, Trustlines } from './trustline'

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  retry: vi.fn(),
  create: vi.fn(),
  submit: vi.fn(),
}))
vi.mock('~stellar/_common/lib/hooks/trustline/use-trustline', () => ({
  useNeedsTrustlines: mocks.query,
}))
vi.mock('~stellar/_common/ui/trustline/create-trustline-button', () => ({
  CreateTrustlineButton: ({
    tokens,
  }: { tokens: { code: string; issuer: StellarAccountAddress }[] }) => (
    <button type="button" onClick={() => mocks.create(tokens)}>
      Create trustline
    </button>
  ),
}))

const xlm = STELLAR_XLM[StellarChainId.STELLAR]
const usdc = STELLAR_USDC[StellarChainId.STELLAR]
const ready = { needsTrustline: false, issuer: null }
let container: HTMLDivElement
let root: Root
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

beforeEach(() => {
  vi.clearAllMocks()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

it('blocks submission through loading, failure, and missing trustlines, then permits it after resolution', () => {
  function render(
    results: {
      needsTrustline: boolean
      issuer: StellarAccountAddress | null
    }[],
    isLoading = false,
    isError = false,
  ): void {
    mocks.query.mockReturnValue({
      results,
      isLoading,
      isError,
      refetch: mocks.retry,
    })
    act(() =>
      root.render(
        <Trustlines tokens={[xlm, undefined, usdc]}>
          <button type="button" onClick={mocks.submit}>
            Submit
          </button>
        </Trustlines>,
      ),
    )
  }
  function click(): void {
    act(() => container.querySelector('button')?.click())
  }

  render([], true)
  click()
  expect(container.textContent).toContain('Checking trustlines')
  expect(mocks.submit).not.toHaveBeenCalled()
  render([], false, true)
  click()
  expect(mocks.retry).toHaveBeenCalledOnce()
  expect(mocks.submit).not.toHaveBeenCalled()
  render([ready, { needsTrustline: true, issuer: usdc.issuer ?? null }])
  click()
  expect(mocks.create).toHaveBeenCalledWith([
    { code: usdc.symbol, issuer: usdc.issuer },
  ])
  expect(mocks.submit).not.toHaveBeenCalled()
  expect(mocks.query).toHaveBeenLastCalledWith([xlm, usdc])
  render([ready, ready])
  click()
  expect(mocks.submit).toHaveBeenCalledOnce()
})

it('uses the same check for a single swap output token', () => {
  mocks.query.mockReturnValue({
    results: [ready],
    isLoading: false,
    isError: false,
  })
  act(() =>
    root.render(
      <Trustline token={usdc}>
        <button type="button">Swap</button>
      </Trustline>,
    ),
  )
  expect(mocks.query).toHaveBeenLastCalledWith([usdc])
  expect(container.textContent).toBe('Swap')
})
