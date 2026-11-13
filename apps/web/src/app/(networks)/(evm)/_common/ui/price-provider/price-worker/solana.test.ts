import { SVM_USDC, SvmChainId, WSOL } from 'sushi/svm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createChainState } from './chain-state'
import { createSolanaRequestHandlers, isPriceRequestChainState } from './solana'
import type { WorkerChainState } from './types'

const mint0 = WSOL[SvmChainId.SOLANA].address
const mint1 = SVM_USDC[SvmChainId.SOLANA].address
const fetchPrices = vi.fn<typeof fetch>()

function createRequests(): {
  chainState: WorkerChainState<SvmChainId>
  queueSolanaRequests: ReturnType<
    typeof createSolanaRequestHandlers
  >['queueSolanaRequests']
} {
  const chainState = createChainState(SvmChainId.SOLANA)
  if (!isPriceRequestChainState(chainState)) {
    throw new Error('Expected Solana request state')
  }

  const { queueSolanaRequests } = createSolanaRequestHandlers({
    dataApiHost: 'https://prices.test',
    sendMessage: vi.fn(),
    updatePriceData(oldPriceData, newPriceMap) {
      for (const [address, price] of newPriceMap) {
        oldPriceData.set(address, price)
      }
    },
  })

  return { chainState, queueSolanaRequests }
}

describe('Solana price worker requests', () => {
  beforeEach(() => {
    fetchPrices.mockReset()
    vi.stubGlobal('fetch', fetchPrices)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('does not request a mint whose price is already cached', () => {
    const { chainState, queueSolanaRequests } = createRequests()
    chainState.priceMap.set(mint0, 150)

    queueSolanaRequests(chainState, [mint0, mint0])

    expect(fetchPrices).not.toHaveBeenCalled()
    expect(chainState.request?.pending.size).toBe(0)
    expect(chainState.request?.processing).toBe(false)
  })

  it.each([true, false])(
    'does not request a mint again when a duplicate arrives during its fetch (price returned: %s)',
    async (hasPrice) => {
      const { chainState, queueSolanaRequests } = createRequests()
      const response = Promise.withResolvers<Response>()
      const prices = hasPrice ? { [mint0]: 150 } : {}
      fetchPrices
        .mockReturnValueOnce(response.promise)
        .mockImplementation(async () => Response.json(prices))

      queueSolanaRequests(chainState, [mint0])
      await vi.waitFor(() => expect(fetchPrices).toHaveBeenCalledTimes(1))

      queueSolanaRequests(chainState, [mint0])
      response.resolve(Response.json(prices))
      await vi.waitFor(() => expect(chainState.request?.processing).toBe(false))

      expect(chainState.priceMap.get(mint0)).toBe(hasPrice ? 150 : undefined)
      expect(fetchPrices).toHaveBeenCalledTimes(1)
    },
  )

  it('allows a later request to retry a mint after its previous fetch failed', async () => {
    const { chainState, queueSolanaRequests } = createRequests()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchPrices
      .mockResolvedValueOnce(Response.json({}, { status: 503 }))
      .mockResolvedValueOnce(Response.json({ [mint0]: 150 }))

    queueSolanaRequests(chainState, [mint0])
    await vi.waitFor(() => expect(chainState.request?.processing).toBe(false))

    expect(fetchPrices).toHaveBeenCalledTimes(1)
    expect(chainState.isError).toBe(true)
    expect(chainState.priceMap.has(mint0)).toBe(false)

    queueSolanaRequests(chainState, [mint0])
    await vi.waitFor(() => expect(chainState.request?.processing).toBe(false))

    expect(fetchPrices).toHaveBeenCalledTimes(2)
    expect(chainState.priceMap.get(mint0)).toBe(150)
    expect(chainState.isError).toBe(false)
  })

  it('requests a distinct mint queued while another mint is being fetched', async () => {
    const { chainState, queueSolanaRequests } = createRequests()
    const response = Promise.withResolvers<Response>()
    fetchPrices
      .mockReturnValueOnce(response.promise)
      .mockImplementation(async () => Response.json({ [mint1]: 1 }))

    queueSolanaRequests(chainState, [mint0])
    await vi.waitFor(() => expect(fetchPrices).toHaveBeenCalledTimes(1))

    queueSolanaRequests(chainState, [mint1])
    response.resolve(Response.json({ [mint0]: 150 }))
    await vi.waitFor(() => expect(chainState.request?.processing).toBe(false))

    expect(fetchPrices).toHaveBeenCalledTimes(2)
    expect(fetchPrices.mock.calls.map(([, init]) => init?.body)).toEqual([
      JSON.stringify({ addresses: [mint0] }),
      JSON.stringify({ addresses: [mint1] }),
    ])
    expect(chainState.priceMap.get(mint0)).toBe(150)
    expect(chainState.priceMap.get(mint1)).toBe(1)
  })
})
