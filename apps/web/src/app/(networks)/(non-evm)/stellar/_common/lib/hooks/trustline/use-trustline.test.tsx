/** @vitest-environment jsdom */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import {
  type StellarAccountAddress,
  StellarChainId,
  StellarToken,
} from 'sushi/stellar'
import { expect, it, vi } from 'vitest'
import { useNeedsTrustlines } from './use-trustline'

const mocks = vi.hoisted(() => ({
  checkTrustlineRequired: vi.fn(),
  hasTrustline: vi.fn(),
}))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
}))
vi.mock('src/lib/wallet/namespaces/stellar/config', () => ({
  getStellarWalletKit: vi.fn(),
}))
vi.mock('@sushiswap/notifications', () => ({
  createErrorToast: vi.fn(),
  createInfoToast: vi.fn(),
  createSuccessToast: vi.fn(),
}))
vi.mock('~evm/_common/ui/balance-provider/use-stellar-balances', () => ({
  invalidateStellarBalances: vi.fn(),
}))
vi.mock('../../soroban/trustline-helpers', () => ({
  checkTrustlineRequired: mocks.checkTrustlineRequired,
  hasTrustline: mocks.hasTrustline,
  createTrustline: vi.fn(),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it('requires the canonical USDE trustline even when the account already trusts the display symbol USDe', async () => {
  const issuer: StellarAccountAddress =
    'GDJ5BNU5NN6NQ54D7OX6NQTUYNBZ42CAT33QGM5BIQ2QIYADAC5ICH47'
  const token = new StellarToken({
    chainId: StellarChainId.STELLAR,
    address: 'CCNOV6XVI2O5BSTA3232GIRUQULDEBV7IWGKM6QKI6II5OIIQTU24JJN',
    decimals: 7,
    symbol: 'USDe',
    name: 'USDe',
  })
  const trustedAssetCodes = new Set(['USDe'])
  mocks.checkTrustlineRequired.mockResolvedValue({
    required: true,
    assetCode: 'USDE',
    issuer,
  })
  mocks.hasTrustline.mockImplementation(
    async (_account: StellarAccountAddress, assetCode: string) =>
      trustedAssetCodes.has(assetCode),
  )

  vi.useFakeTimers()
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const container = document.createElement('div')
  const root = createRoot(container)
  let result: ReturnType<typeof useNeedsTrustlines> | undefined
  function Harness(): null {
    result = useNeedsTrustlines([token])
    return null
  }

  try {
    await act(async () => {
      root.render(
        <QueryClientProvider client={client}>
          <Harness />
        </QueryClientProvider>,
      )
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })
    expect(mocks.hasTrustline).toHaveBeenCalledWith(
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
      'USDE',
      issuer,
    )
    expect(result?.results).toEqual([
      { needsTrustline: true, assetCode: 'USDE', issuer },
    ])

    trustedAssetCodes.add('USDE')
    await act(async () => {
      await result?.refetch()
      await vi.advanceTimersByTimeAsync(1)
    })
    expect(result?.results).toEqual([
      { needsTrustline: false, assetCode: 'USDE', issuer },
    ])
  } finally {
    act(() => root.unmount())
    client.clear()
    vi.useRealTimers()
  }
})
