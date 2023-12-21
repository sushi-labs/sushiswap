import type { MarketId } from '@sushiswap/bonds-sdk'
import { type getBondFromSubgraph } from '../../../api/bonds/bond'
import { EVM_APP_BASE_URL } from '../../../constants'
import { get } from '../../../functions'
import { type BondApiSchema } from './schema'

export { type BondApiSchema }
export type Bond = NonNullable<Awaited<ReturnType<typeof getBondFromSubgraph>>>
export type GetBondArgs = { marketId: MarketId }

export const getBondUrl = (args: GetBondArgs) => {
  return `${EVM_APP_BASE_URL}/bonds/api/v1/bonds/${args.marketId}`
}

export const getBond = async (args: GetBondArgs): Promise<Bond> => {
  return get(getBondUrl(args))
}
