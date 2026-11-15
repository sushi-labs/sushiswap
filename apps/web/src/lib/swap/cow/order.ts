import {
  AppDataSdk,
  BuyTokenDestination,
  COW_PROTOCOL_SETTLEMENT_CONTRACT_ADDRESS,
  COW_PROTOCOL_VAULT_RELAYER_ADDRESS,
  ContractsOrderKind,
  OrderBalance,
  OrderKind,
  OrderSigningUtils,
  OrderStatus,
  SellTokenSource,
  SigningScheme,
} from '@cowprotocol/cow-sdk'
import { ViemAdapter } from '@cowprotocol/sdk-viem-adapter'
import { type EvmAddress, isEvmAddressEqual } from 'sushi/evm'
import { http, type Hex, createPublicClient, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'
import * as z from 'zod'
import { getRemainingSellAmount } from './amounts'
import { COW_APP_CODE, type CowLimitChainId } from './chains'
import type { CowOrder, CowUnsignedOrder, PreparedCowOrder } from './schema'

export const COW_SETTLEMENT_ABI = parseAbi([
  'function invalidateOrder(bytes orderUid)',
  'function setPreSignature(bytes orderUid, bool signed)',
])

// The app-data SDK only uses its adapter for hashing; it never calls the RPC.
const APP_DATA_ADAPTER = new ViemAdapter({
  provider: createPublicClient({ chain: mainnet, transport: http() }),
})

// The SDK types its contract addresses as plain strings.
export function getCowSettlement(chainId: CowLimitChainId): EvmAddress {
  return COW_PROTOCOL_SETTLEMENT_CONTRACT_ADDRESS[chainId] as EvmAddress
}

export function getCowSpender(chainId: CowLimitChainId): EvmAddress {
  return COW_PROTOCOL_VAULT_RELAYER_ADDRESS[chainId] as EvmAddress
}

export function isCowOrderOpen(order: Pick<CowOrder, 'status'>): boolean {
  return (
    order.status === OrderStatus.OPEN ||
    order.status === OrderStatus.PRESIGNATURE_PENDING
  )
}

// Only ECDSA orders can be cancelled off-chain or replaced atomically.
export function isEcdsaCowOrder(
  order: Pick<CowOrder, 'signingScheme'>,
): boolean {
  return (
    order.signingScheme === SigningScheme.EIP712 ||
    order.signingScheme === SigningScheme.ETHSIGN
  )
}

const attributionSchema = z.object({
  appCode: z.literal(COW_APP_CODE),
  metadata: z.object({
    orderClass: z.object({ orderClass: z.literal('limit') }),
  }),
})

export function isSushiCowOrder(order: CowOrder): boolean {
  if (!order.fullAppData) return false
  try {
    return attributionSchema.safeParse(JSON.parse(order.fullAppData)).success
  } catch {
    return false
  }
}

// Edits keep the pair and recipient and replace only what is left of the order.
export function assertEditableCowOrder(order: CowOrder | undefined): CowOrder {
  if (!order || order.status !== OrderStatus.OPEN)
    throw new Error(
      'This order can no longer be edited. Check its latest status.',
    )
  if (order.receiver && !isEvmAddressEqual(order.receiver, order.owner))
    throw new Error('Orders with a different recipient cannot be edited here.')
  if (getRemainingSellAmount(order) === 0n)
    throw new Error('This order has filled completely.')
  return order
}

export async function prepareCowOrder({
  chainId,
  owner,
  sellToken,
  buyToken,
  sellAmount,
  buyAmount,
  validTo,
  replacedOrderUid,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress
  sellToken: EvmAddress
  buyToken: EvmAddress
  sellAmount: bigint
  buyAmount: bigint
  validTo: number
  replacedOrderUid?: string
}): Promise<PreparedCowOrder> {
  const now = Math.floor(Date.now() / 1000)
  if (validTo < now + 60 || validTo > now + 31_536_000) {
    throw new Error('Choose an expiry between one minute and one year from now')
  }
  const appData = new AppDataSdk(APP_DATA_ADAPTER)
  const document = await appData.generateAppDataDoc({
    appCode: COW_APP_CODE,
    environment: 'production',
    metadata: {
      orderClass: { orderClass: 'limit' },
      ...(replacedOrderUid ? { replacedOrder: { uid: replacedOrderUid } } : {}),
    },
  })
  const { appDataHex, appDataContent } = await appData.getAppDataInfo(document)
  const order: CowUnsignedOrder = {
    sellToken,
    buyToken,
    receiver: owner,
    sellAmount: sellAmount.toString(),
    buyAmount: buyAmount.toString(),
    validTo,
    appData: appDataHex as Hex,
    feeAmount: '0',
    kind: OrderKind.SELL,
    partiallyFillable: true,
    sellTokenBalance: SellTokenSource.ERC20,
    buyTokenBalance: BuyTokenDestination.ERC20,
  }
  const { orderId, orderDigest } = await OrderSigningUtils.generateOrderId(
    chainId,
    {
      ...order,
      kind: ContractsOrderKind.SELL,
      sellTokenBalance: OrderBalance.ERC20,
      buyTokenBalance: OrderBalance.ERC20,
    },
    { owner },
  )
  // The SDK types hashes and IDs as plain strings.
  return {
    chainId,
    owner,
    order,
    uid: orderId as Hex,
    digest: orderDigest as Hex,
    fullAppData: appDataContent,
  }
}
