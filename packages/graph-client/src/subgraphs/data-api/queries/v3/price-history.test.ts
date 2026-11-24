import { EvmChainId } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { request } from '../../../../lib/request.js'
import { getV3PoolPriceHistory } from './price-history.js'

vi.mock('../../../../lib/request.js', () => ({ request: vi.fn() }))

const address = '0x00000000000000000000000000000000000000AB'
const now = Date.parse('2026-11-23T12:30:00Z') / 1000
const day = 86_400
const requestMock = vi.mocked(request)

describe('getV3PoolPriceHistory', () => {
  beforeEach(() => {
    requestMock.mockReset()
    vi.spyOn(Date, 'now').mockReturnValue(now * 1000)
  })
  afterEach(() => vi.restoreAllMocks())

  it('opens a quiet window with the last known price and orders its hourly closes', async () => {
    const noon = now - 1800
    requestMock.mockResolvedValueOnce({
      previous: [{ timestamp: noon - 2 * day, price: '10' }],
      buckets: [
        { timestamp: noon, price: '30' },
        { timestamp: noon - 7200, price: '20' },
      ],
    })
    await expect(
      getV3PoolPriceHistory({
        chainId: EvmChainId.ARBITRUM,
        address,
        period: '1D',
      }),
    ).resolves.toEqual([
      { timestamp: now - day, price: 10 },
      { timestamp: noon - 7200, price: 10 },
      { timestamp: noon - 3600, price: 20 },
      { timestamp: noon, price: 20 },
      { timestamp: now, price: 30 },
    ])
    expect(requestMock.mock.calls[0]?.[0]).toMatchObject({
      document: expect.stringContaining('poolHourDatas'),
      variables: { pool: address.toLowerCase(), opening: true },
    })
  })

  it('extends a trailing quiet stretch only through indexed history', async () => {
    const noon = now - 1800
    requestMock.mockResolvedValueOnce({
      _meta: { block: { timestamp: now - day } },
      previous: [],
      buckets: [{ timestamp: noon - 2 * day, price: '10' }],
    })
    await expect(
      getV3PoolPriceHistory({
        chainId: EvmChainId.ARBITRUM,
        address,
        period: '1W',
      }),
    ).resolves.toEqual([
      { timestamp: noon - 2 * day + 3600, price: 10 },
      { timestamp: noon - day, price: 10 },
    ])
  })

  it('does not carry a stale price into a window the indexer has not reached', async () => {
    requestMock.mockResolvedValueOnce({
      _meta: { block: { timestamp: now - 2 * day } },
      previous: [{ timestamp: now - 3 * day, price: '10' }],
      buckets: [],
    })
    await expect(
      getV3PoolPriceHistory({
        chainId: EvmChainId.ARBITRUM,
        address,
        period: '1D',
      }),
    ).resolves.toEqual([])
  })

  it('paginates all daily prices by exclusive timestamp, including the oldest page', async () => {
    const lastDay = Math.floor(now / day) * day
    const buckets = Array.from({ length: 1000 }, (_, i) => ({
      timestamp: lastDay - i * day,
      price: '2',
    }))
    requestMock.mockResolvedValueOnce({ buckets }).mockResolvedValueOnce({
      buckets: [{ timestamp: lastDay - 1000 * day, price: '1' }],
    })
    const points = await getV3PoolPriceHistory({
      chainId: EvmChainId.ARBITRUM,
      address,
      period: 'ALL',
    })
    expect(points).toHaveLength(1001)
    expect(points[0]).toEqual({ timestamp: lastDay - 999 * day, price: 1 })
    expect(points.at(-1)).toEqual({ timestamp: now, price: 2 })
    expect(requestMock.mock.calls[1]?.[0]).toMatchObject({
      document: expect.stringContaining('poolDayDatas'),
      variables: { from: 0, to: buckets.at(-1)?.timestamp, opening: false },
    })
  })

  it('prices reduced-subgraph samples from the first swap using both token decimals', async () => {
    const firstSwap = now - 2
    const sqrtPriceX96 = String(2n * (1n << 96n))
    requestMock
      .mockResolvedValueOnce({
        swaps: [
          {
            timestamp: String(firstSwap),
            pool: { token0: { decimals: '6' }, token1: { decimals: '18' } },
          },
        ],
      })
      .mockResolvedValueOnce({
        p0: [{ sqrtPriceX96 }],
        p1: [{ sqrtPriceX96 }],
        p2: [{ sqrtPriceX96 }],
      })
    const points = await getV3PoolPriceHistory({
      chainId: EvmChainId.ROBINHOOD,
      address,
      period: 'ALL',
    })
    expect(points).toEqual([
      { timestamp: firstSwap, price: 4e-12 },
      { timestamp: firstSwap + 1, price: 4e-12 },
      { timestamp: now, price: 4e-12 },
    ])
    expect(requestMock).toHaveBeenCalledTimes(2)
    expect(requestMock.mock.calls[1]?.[0].document).toContain(
      `timestamp_lte: "${firstSwap}"`,
    )
  })
})
