/** @vitest-environment jsdom */

import { getLaunchpadTokens } from '@sushiswap/graph-client/data-api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { EvmChainId, type LaunchpadV2ChainId } from 'sushi/evm'
import { expect, it, vi } from 'vitest'
import { EMPTY_LAUNCHPAD_TOKEN_CONNECTION } from './launchpad-query-fallbacks'
import { useLaunchpadTokens } from './use-launchpad-tokens'

vi.mock('@sushiswap/graph-client/data-api', () => ({
  getLaunchpadTokens: vi.fn(),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it('requests and caches discovery separately for each selected chain', async () => {
  vi.mocked(getLaunchpadTokens).mockResolvedValue(
    EMPTY_LAUNCHPAD_TOKEN_CONNECTION,
  )
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const container = document.createElement('div')
  const root = createRoot(container)

  function Discovery({ chainId }: { chainId: LaunchpadV2ChainId }) {
    useLaunchpadTokens({ chainId, first: 20 })
    return null
  }

  try {
    for (const chainId of [EvmChainId.ROBINHOOD, EvmChainId.ARC] as const) {
      await act(async () => {
        root.render(
          <QueryClientProvider client={client}>
            <Discovery chainId={chainId} />
          </QueryClientProvider>,
        )
      })
      await vi.waitFor(() => {
        expect(getLaunchpadTokens).toHaveBeenLastCalledWith({
          input: { chainId, first: 20 },
        })
        expect(
          client.getQueryData(['launchpad', 'tokens', { chainId, first: 20 }]),
        ).toBeDefined()
      })
    }
    expect(getLaunchpadTokens).toHaveBeenCalledTimes(2)
  } finally {
    act(() => root.unmount())
    client.clear()
  }
})
