/** @vitest-environment jsdom */

import {
  QueryClient,
  QueryClientProvider,
  notifyManager,
} from '@tanstack/react-query'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useValueTransferCatalog } from './use-value-transfer-catalog'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root
let container: HTMLDivElement
let client: QueryClient
const fetchCatalog = vi.fn<typeof fetch>()

function Harness({ enabled }: { enabled?: boolean }): null {
  useValueTransferCatalog(enabled)
  return null
}

function renderCatalog(enabled?: boolean): void {
  act(() =>
    root.render(
      <QueryClientProvider client={client}>
        <Harness enabled={enabled} />
      </QueryClientProvider>,
    ),
  )
}

beforeEach(() => {
  fetchCatalog
    .mockReset()
    .mockImplementation(async (url) =>
      Response.json(
        String(url).endsWith('/chains') ? { chains: [] } : { tokens: [] },
      ),
    )
  vi.stubGlobal('fetch', fetchCatalog)
  notifyManager.setNotifyFunction((callback) => act(callback))
  client = new QueryClient({
    defaultOptions: { queries: { gcTime: 0 } },
  })
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  client.clear()
  container.remove()
  vi.unstubAllGlobals()
  notifyManager.setNotifyFunction((callback) => callback())
})

it('waits until enabled and stops background refetches when disabled', async () => {
  renderCatalog(false)
  expect(fetchCatalog).not.toHaveBeenCalled()
  expect(client.getQueryState(['value-transfer-catalog'])?.fetchStatus).toBe(
    'idle',
  )

  renderCatalog(true)
  await vi.waitFor(() =>
    expect(client.getQueryState(['value-transfer-catalog'])?.status).toBe(
      'success',
    ),
  )
  expect(fetchCatalog.mock.calls.map(([url]) => url)).toEqual([
    '/api/cross-chain/value-transfer/chains',
    '/api/cross-chain/value-transfer/tokens',
  ])

  renderCatalog(false)
  await act(() =>
    client.invalidateQueries({ queryKey: ['value-transfer-catalog'] }),
  )
  expect(fetchCatalog).toHaveBeenCalledTimes(2)
})

it('preserves eager loading for existing callers that omit enabled', async () => {
  renderCatalog()
  await vi.waitFor(() => expect(fetchCatalog).toHaveBeenCalledTimes(2))
})
