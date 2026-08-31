'use server'

import { fetchCrossmintOrdersPage } from '../crossmint-orders'
import type { CrossmintOrdersPage, ListCrossmintOrdersInput } from '../types'

export async function listCrossmintOrders(
  input: ListCrossmintOrdersInput,
): Promise<CrossmintOrdersPage> {
  return fetchCrossmintOrdersPage(input)
}
