import {
  EcdsaSigningScheme,
  OrderBookApi,
  OrderQuoteSideKindSell,
  PriceQuality,
  SigningScheme,
} from '@cowprotocol/cow-sdk'
import type { EvmAddress } from 'sushi/evm'
import { type Hex, zeroAddress } from 'viem'
import * as z from 'zod'
import type { CowLimitChainId } from './chains'
import { isCowNotFoundError } from './errors'
import { assertEditableCowOrder } from './order'
import {
  type CowOrder,
  type CowTrade,
  type PreparedCowOrder,
  cowOrderSchema,
  cowTradeSchema,
} from './schema'

const apis = new Map<CowLimitChainId, OrderBookApi>()

export function getCowApi(chainId: CowLimitChainId): OrderBookApi {
  let api = apis.get(chainId)
  if (!api) {
    api = new OrderBookApi({ chainId })
    apis.set(chainId, api)
  }
  return api
}

export async function getCowOrder(
  chainId: CowLimitChainId,
  uid: string,
): Promise<CowOrder | undefined> {
  try {
    return cowOrderSchema.parse(await getCowApi(chainId).getOrder(uid))
  } catch (error) {
    if (isCowNotFoundError(error)) return undefined
    throw error
  }
}

export async function getCowTrades(
  chainId: CowLimitChainId,
  uid: string,
): Promise<CowTrade[]> {
  return z
    .array(cowTradeSchema)
    .parse(await getCowApi(chainId).getTrades({ orderUid: uid, limit: 1000 }))
}

const quoteSchema = z.object({
  quote: z.object({
    sellAmount: z.string(),
    buyAmount: z.string(),
    feeAmount: z.string(),
  }),
})
export type CowQuote = z.infer<typeof quoteSchema>

export async function getCowQuote({
  chainId,
  owner = zeroAddress,
  sellToken,
  buyToken,
  sellAmount,
  signingScheme = SigningScheme.EIP712,
}: {
  chainId: CowLimitChainId
  owner?: EvmAddress
  sellToken: EvmAddress
  buyToken: EvmAddress
  sellAmount: string
  signingScheme?: SigningScheme
}): Promise<CowQuote> {
  return quoteSchema.parse(
    await getCowApi(chainId).getQuote({
      sellToken,
      buyToken,
      sellAmountBeforeFee: sellAmount,
      from: owner,
      receiver: owner,
      kind: OrderQuoteSideKindSell.SELL,
      signingScheme,
      priceQuality: PriceQuality.OPTIMAL,
    }),
  )
}

export async function postCowOrder(
  prepared: PreparedCowOrder,
  signature: Hex,
  signingScheme: SigningScheme,
): Promise<void> {
  await getCowApi(prepared.chainId).sendOrder({
    ...prepared.order,
    from: prepared.owner,
    appData: prepared.fullAppData,
    appDataHash: prepared.order.appData,
    signature,
    signingScheme,
    fullBalanceCheck: true,
  })
}

export async function postCowCancellation(
  chainId: CowLimitChainId,
  uid: Hex,
  signature: Hex,
): Promise<void> {
  await getCowApi(chainId).sendSignedOrderCancellations({
    orderUids: [uid],
    signature,
    signingScheme: EcdsaSigningScheme.EIP712,
  })
}

export async function getEditableCowOrder(
  chainId: CowLimitChainId,
  uid: string,
): Promise<CowOrder> {
  return assertEditableCowOrder(await getCowOrder(chainId, uid))
}
