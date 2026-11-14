import {
  type BuyTokenDestination,
  type OrderKind,
  OrderStatus,
  type SellTokenSource,
  SigningScheme,
} from '@cowprotocol/cow-sdk'
import { type EvmAddress, evmAddress } from 'sushi/evm'
import type { Hex } from 'viem'
import * as z from 'zod'
import type { CowLimitChainId } from './chains'

// The orderbook SDK passes API responses through unchecked and types every
// address, hash and amount as `string`; these schemas check and narrow them.
const hexSchema = z.templateLiteral(['0x', z.string()])

export const cowOrderSchema = z.object({
  uid: hexSchema,
  owner: evmAddress(),
  sellToken: evmAddress(),
  buyToken: evmAddress(),
  receiver: evmAddress().nullish(),
  sellAmount: z.string(),
  buyAmount: z.string(),
  executedSellAmountBeforeFees: z.string(),
  executedSellAmount: z.string(),
  executedBuyAmount: z.string(),
  validTo: z.number(),
  creationDate: z.string(),
  status: z.enum(OrderStatus),
  signingScheme: z.enum(SigningScheme),
  fullAppData: z.string().nullish(),
  appData: hexSchema,
})
export type CowOrder = z.infer<typeof cowOrderSchema>

export const cowTradeSchema = z.object({
  sellAmount: z.string(),
  buyAmount: z.string(),
  txHash: hexSchema.nullable(),
  logIndex: z.number(),
})
export type CowTrade = z.infer<typeof cowTradeSchema>

// A type alias, not an interface, so it satisfies viem's typed-data message.
export type CowUnsignedOrder = {
  sellToken: EvmAddress
  buyToken: EvmAddress
  receiver: EvmAddress
  sellAmount: string
  buyAmount: string
  validTo: number
  appData: Hex
  feeAmount: '0'
  kind: OrderKind.SELL
  partiallyFillable: true
  sellTokenBalance: SellTokenSource.ERC20
  buyTokenBalance: BuyTokenDestination.ERC20
}

export interface PreparedCowOrder {
  chainId: CowLimitChainId
  owner: EvmAddress
  order: CowUnsignedOrder
  uid: Hex
  digest: Hex
  fullAppData: string
}
