import { type EvmAddress, isEvmAddressEqual } from 'sushi/evm'
import * as z from 'zod'
import { getRemainingSellAmount } from './amounts'
import type { CowLimitChainId } from './chains'
import { isCowNotFoundError } from './errors'
import { isCowOrderOpen, isSushiCowOrder } from './order'
import { getCowApi } from './orderbook'
import { type CowOrder, cowOrderSchema } from './schema'

const HISTORY_PAGE_SIZE = 50
// Bounds a single history request; "Load more" continues from the next offset.
const HISTORY_MAX_SCANNED_PAGES = 5
const ALLOWANCE_PAGE_SIZE = 1000
const ALLOWANCE_MAX_PAGES = 5

async function getAccountOrders({
  chainId,
  owner,
  offset,
  limit,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress
  offset: number
  limit: number
}): Promise<CowOrder[]> {
  return z
    .array(cowOrderSchema)
    .parse(await getCowApi(chainId).getOrders({ owner, offset, limit }))
}

async function withFullAppData(
  chainId: CowLimitChainId,
  order: CowOrder,
): Promise<CowOrder | undefined> {
  if (order.fullAppData) return order
  try {
    const { fullAppData } = await getCowApi(chainId).getAppData(order.appData)
    return { ...order, fullAppData }
  } catch (error) {
    // Older orders can use an unregistered app-data hash. An outage is
    // still an error; a missing document simply cannot identify Sushi.
    if (isCowNotFoundError(error)) return undefined
    throw error
  }
}

export async function getCowOrdersPage({
  chainId,
  owner,
  offset = 0,
  signal,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress
  offset?: number
  signal?: AbortSignal
}): Promise<{ orders: CowOrder[]; nextOffset: number | undefined }> {
  // The orderbook cannot filter by app code, so skip other integrations' orders.
  for (let page = 0; page < HISTORY_MAX_SCANNED_PAGES; page++) {
    signal?.throwIfAborted()
    const raw = await getAccountOrders({
      chainId,
      owner,
      offset,
      limit: HISTORY_PAGE_SIZE,
    })
    const resolved = await Promise.all(
      raw.map((order) => withFullAppData(chainId, order)),
    )
    signal?.throwIfAborted()
    const orders = resolved.filter(
      (order): order is CowOrder =>
        order !== undefined && isSushiCowOrder(order),
    )
    offset += raw.length
    const nextOffset = raw.length === HISTORY_PAGE_SIZE ? offset : undefined
    if (orders.length || nextOffset === undefined) return { orders, nextOffset }
  }
  return { orders: [], nextOffset: offset }
}

// Every open order shares the vault relayer allowance, whichever app created it.
export async function getOpenCowSellAmount({
  chainId,
  owner,
  sellToken,
  excludedUids,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress
  sellToken: EvmAddress
  excludedUids: string[]
}): Promise<bigint> {
  const excluded = new Set(excludedUids.map((uid) => uid.toLowerCase()))
  let total = 0n
  for (let page = 0; page < ALLOWANCE_MAX_PAGES; page++) {
    const orders = await getAccountOrders({
      chainId,
      owner,
      offset: page * ALLOWANCE_PAGE_SIZE,
      limit: ALLOWANCE_PAGE_SIZE,
    })
    for (const order of orders) {
      if (
        isCowOrderOpen(order) &&
        isEvmAddressEqual(order.sellToken, sellToken) &&
        !excluded.has(order.uid.toLowerCase())
      )
        total += getRemainingSellAmount(order)
    }
    if (orders.length < ALLOWANCE_PAGE_SIZE) break
  }
  return total
}
