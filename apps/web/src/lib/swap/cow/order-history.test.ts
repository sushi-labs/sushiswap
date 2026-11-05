import { keccak256, stringToHex } from 'viem'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCowOrdersPage, getOpenCowSellAmount } from './order-history'
import { getCowApi, getCowOrder } from './orderbook'
import { historyOrder, owner, token0, token1 } from './test-fixtures'

afterEach(() => vi.restoreAllMocks())

describe('CoW order history', () => {
  it('does not treat an API outage as a missing order', async () => {
    vi.spyOn(getCowApi(1), 'getOrder').mockRejectedValue(new Error('offline'))
    await expect(getCowOrder(1, 'order')).rejects.toThrow('offline')
  })
  it('scans past other integrations and skips unregistered app-data without hiding Sushi orders', async () => {
    const order = await historyOrder()
    const otherMetadata = JSON.stringify({ appCode: 'Another integration' })
    const other = {
      ...order,
      appData: keccak256(stringToHex(otherMetadata)),
      fullAppData: otherMetadata,
    }
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (input) => {
        const url = new URL(String(input))
        if (url.pathname.includes('/app_data/'))
          return Response.json({}, { status: 404 })
        return Response.json(
          url.searchParams.get('offset') === '0'
            ? Array.from({ length: 50 }, () => other)
            : [{ ...other, fullAppData: undefined }, order],
        )
      })
    const page = await getCowOrdersPage({ chainId: 1, owner: owner.address })
    expect(page.orders.map((item) => item.uid)).toEqual([order.uid])
    expect(page.nextOffset).toBeUndefined()
    expect(fetch).toHaveBeenCalledTimes(3)
  })
  it('sums the remaining amounts of every open order selling the same token', async () => {
    const order = await historyOrder()
    const orders = [
      order,
      { ...order, uid: `0x${'01'.repeat(56)}`, status: 'presignaturePending' },
      { ...order, uid: `0x${'02'.repeat(56)}`, status: 'fulfilled' },
      { ...order, uid: `0x${'03'.repeat(56)}`, sellToken: token1 },
      { ...order, uid: `0x${'04'.repeat(56)}`, fullAppData: '{}' },
    ]
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
      Response.json(orders),
    )
    // Orders from any app share the allowance; the replaced order is excluded.
    expect(
      await getOpenCowSellAmount({
        chainId: 1,
        owner: owner.address,
        sellToken: token0,
        excludedUids: [`0x${'01'.repeat(56)}`],
      }),
    ).toBe(1500000n)
  })
})
