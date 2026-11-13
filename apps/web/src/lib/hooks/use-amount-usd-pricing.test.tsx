/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { Provider } from 'src/app/(networks)/(evm)/_common/ui/price-provider/price-provider/types'
import { Amount } from 'sushi'
import { type SvmAddress, SvmChainId, SvmNative } from 'sushi/svm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAmountUsd } from './use-amount-usd'

const mocks = vi.hoisted(() => ({ usePriceProvider: vi.fn() }))

vi.mock(
  'src/app/(networks)/(evm)/_common/ui/price-provider/price-provider/price-provider',
  () => ({ usePriceProvider: mocks.usePriceProvider }),
)

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const solana = SvmNative.fromChainId(SvmChainId.SOLANA)
const mutations = {
  incrementChainId: vi.fn(),
  decrementChainId: vi.fn(),
  requestPrices: vi.fn(),
}
let root: Root
let container: HTMLDivElement
let prices: Map<SvmAddress, number>
let result: ReturnType<typeof useAmountUsd> | undefined

function Probe(props: Parameters<typeof useAmountUsd>[0]): null {
  result = useAmountUsd(props)
  return null
}

async function renderAmount(amount: bigint, enabled = true): Promise<void> {
  await act(async () => {
    root.render(<Probe amount={new Amount(solana, amount)} enabled={enabled} />)
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  result = undefined
  prices = new Map()
  mocks.usePriceProvider.mockReturnValue({
    state: {
      ready: true,
      chains: new Map([
        [
          SvmChainId.SOLANA,
          {
            chainId: SvmChainId.SOLANA,
            priceMap: prices,
            lastModified: 0,
            isLoading: false,
            isUpdating: false,
            isError: false,
          },
        ],
      ]),
    },
    mutate: mutations,
  } satisfies Provider<SvmChainId>)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
})

describe('amount USD pricing integration', () => {
  it('does not request or subscribe to a missing Solana price when disabled', async () => {
    await renderAmount(1_000_000_000n, false)

    expect(result).toEqual({ data: undefined, isLoading: false })
    expect(mutations.requestPrices).not.toHaveBeenCalled()
    expect(mutations.incrementChainId).not.toHaveBeenCalled()
    expect(mutations.decrementChainId).not.toHaveBeenCalled()
  })

  it('values an enabled amount from the cached price without requesting it', async () => {
    prices.set(solana.wrap().address, 150)

    await renderAmount(2_000_000_000n)

    expect(result).toEqual({ data: 300, isLoading: false })
    expect(mutations.requestPrices).not.toHaveBeenCalled()
    expect(mutations.incrementChainId.mock.calls).toEqual([[SvmChainId.SOLANA]])
  })

  it('requests a missing price once across same-token amount changes', async () => {
    await renderAmount(1_000_000_000n)
    await renderAmount(2_000_000_000n)
    await renderAmount(3_000_000_000n)

    expect(result).toEqual({ data: undefined, isLoading: false })
    expect(mutations.requestPrices.mock.calls).toEqual([
      [SvmChainId.SOLANA, [solana.wrap().address]],
    ])
    expect(mutations.incrementChainId).toHaveBeenCalledTimes(1)
    expect(mutations.decrementChainId).not.toHaveBeenCalled()
  })
})
