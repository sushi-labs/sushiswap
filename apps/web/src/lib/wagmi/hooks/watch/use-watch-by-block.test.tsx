/** @vitest-environment jsdom */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { EvmChainId } from 'sushi/evm'
import { expect, it, vi } from 'vitest'
import { useWatchByBlock } from './use-watch-by-block'

const state = vi.hoisted(() => ({ blockNumber: 100n }))
vi.mock('wagmi', () => ({
  useBlockNumber: () => ({ data: state.blockNumber }),
}))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it('invalidates only on new blocks or changed query keys, not equivalent keys on rerender', () => {
  const client = new QueryClient()
  const invalidate = vi.spyOn(client, 'invalidateQueries')
  const root = createRoot(document.createElement('div'))
  function Probe({ vault = 'vault-a' }: { vault?: string }) {
    useWatchByBlock({
      chainId: EvmChainId.ROBINHOOD,
      key: ['readContracts', { vault }],
    })
    return null
  }
  function render(vault?: string) {
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <Probe vault={vault} />
        </QueryClientProvider>,
      ),
    )
  }
  try {
    render()
    expect(invalidate).toHaveBeenCalledTimes(1)
    render()
    render()
    expect(invalidate).toHaveBeenCalledTimes(1)
    state.blockNumber = 101n
    render()
    expect(invalidate).toHaveBeenCalledTimes(2)
    render('vault-b')
    expect(invalidate).toHaveBeenCalledTimes(3)
  } finally {
    act(() => root.unmount())
    client.clear()
    state.blockNumber = 100n
  }
})
