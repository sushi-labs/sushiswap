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
// Open orders can be anywhere in the history, so they are scanned separately.
const OPEN_SCAN_PAGE_SIZE = 1000
const OPEN_SCAN_MAX_PAGES = 5

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
}: {
  chainId: CowLimitChainId
  owner: EvmAddress
  offset?: number
}): Promise<{ orders: CowOrder[]; nextOffset: number | undefined }> {
  // The orderbook cannot filter by app code, so skip other integrations' orders.
  for (let page = 0; page < HISTORY_MAX_SCANNED_PAGES; page++) {
    const raw = await getAccountOrders({
      chainId,
      owner,
      offset,
      limit: HISTORY_PAGE_SIZE,
    })
    const resolved = await Promise.all(
      raw.map((order) => withFullAppData(chainId, order)),
    )
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

// Every open order on the account, whichever app created it.
async function getOpenAccountOrders({
  chainId,
  owner,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress
}): Promise<CowOrder[]> {
  const open: CowOrder[] = []
  for (let page = 0; page < OPEN_SCAN_MAX_PAGES; page++) {
    const orders = await getAccountOrders({
      chainId,
      owner,
      offset: page * OPEN_SCAN_PAGE_SIZE,
      limit: OPEN_SCAN_PAGE_SIZE,
    })
    open.push(...orders.filter(isCowOrderOpen))
    if (orders.length < OPEN_SCAN_PAGE_SIZE) break
  }
  return open
}

// The account's open Sushi orders, however far back they were placed.
export async function getOpenCowOrders({
  chainId,
  owner,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress
}): Promise<CowOrder[]> {
  const open = await getOpenAccountOrders({ chainId, owner })
  const resolved = await Promise.all(
    open.map((order) => withFullAppData(chainId, order)),
  )
  return resolved.filter(
    (order): order is CowOrder => order !== undefined && isSushiCowOrder(order),
  )
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
  const orders = await getOpenAccountOrders({ chainId, owner })
  let total = 0n
  for (const order of orders) {
    if (
      isEvmAddressEqual(order.sellToken, sellToken) &&
      !excluded.has(order.uid.toLowerCase())
    )
      total += getRemainingSellAmount(order)
  }
  return total
}
