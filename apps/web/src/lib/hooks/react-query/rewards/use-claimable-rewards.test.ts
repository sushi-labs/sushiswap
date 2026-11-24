import { EvmChainId, type MerklChainId } from 'sushi/evm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useClaimableRewards } from './use-claimable-rewards'

const useQuery = vi.hoisted(() =>
  vi.fn<
    (options: {
      queryKey: readonly unknown[]
      queryFn(): Promise<unknown>
    }) => void
  >(),
)
vi.mock('@tanstack/react-query', () => ({ useQuery }))

const account = '0x0000000000000000000000000000000000000001'
const { POLYGON, BASE } = EvmChainId
const fetchRewards = vi.fn<typeof fetch>()

function query(chainIds?: MerklChainId[]) {
  useClaimableRewards({ account, chainIds })
  return useQuery.mock.lastCall![0]
}

beforeEach(() => {
  vi.stubGlobal('window', { location: { origin: 'http://localhost' } })
  vi.stubGlobal('fetch', fetchRewards)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetAllMocks()
})

it('returns an empty result for a successful empty response', async () => {
  fetchRewards.mockResolvedValueOnce(Response.json([]))
  await expect(query([POLYGON]).queryFn()).resolves.toEqual({})
})

it('reports an error when all requested chains fail', async () => {
  fetchRewards.mockResolvedValueOnce(Response.json([], { status: 503 }))
  fetchRewards.mockRejectedValueOnce(new Error('Network unavailable'))
  await expect(query([POLYGON, BASE]).queryFn()).rejects.toThrow('HTTP 503')
})

it('retains successful chain rewards when another chain fails', async () => {
  fetchRewards.mockRejectedValueOnce(new Error('Network unavailable'))
  fetchRewards.mockResolvedValueOnce(
    Response.json([
      {
        chain: { id: BASE },
        rewards: [
          {
            root: '0x01',
            recipient: account,
            amount: '10',
            claimed: '2',
            pending: '0',
            proofs: [],
            token: {
              address: account,
              chainId: BASE,
              symbol: 'TEST',
              decimals: 0,
              price: 1,
            },
          },
        ],
      },
    ]),
  )
  await expect(query([POLYGON, BASE]).queryFn()).resolves.toMatchObject({
    [BASE]: { totalRewardsUSD: 8 },
  })
})

it('uses separate cache keys for different chain selections', () => {
  const polygon = query([POLYGON]).queryKey
  expect(polygon).not.toEqual(query([BASE]).queryKey)
  expect(polygon).not.toEqual(query().queryKey)
})
