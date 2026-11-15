import { SigningScheme } from '@cowprotocol/cow-sdk'
import { type EvmAddress, EvmChainId, EvmToken } from 'sushi/evm'
import { privateKeyToAccount } from 'viem/accounts'
import type { CowLimitChainId } from './chains'
import { prepareCowOrder } from './order'
import { type CowOrder, type PreparedCowOrder, cowOrderSchema } from './schema'

export const owner = privateKeyToAccount(
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)
export const token0: EvmAddress = '0x0000000000000000000000000000000000000010'
export const token1: EvmAddress = '0x0000000000000000000000000000000000000020'

export function preparedOrder(
  chainId: CowLimitChainId = 1,
): Promise<PreparedCowOrder> {
  return prepareCowOrder({
    chainId,
    owner: owner.address,
    sellToken: token0,
    buyToken: token1,
    sellAmount: 1000000n,
    buyAmount: 2000000000000000000n,
    validTo: Math.floor(Date.now() / 1000) + 604800,
  })
}

// An open Sushi order with a quarter already filled.
export async function historyOrder(): Promise<CowOrder> {
  const prepared = await preparedOrder()
  return cowOrderSchema.parse({
    ...prepared.order,
    uid: prepared.uid,
    owner: prepared.owner,
    fullAppData: prepared.fullAppData,
    status: 'open',
    signingScheme: SigningScheme.EIP712,
    creationDate: new Date().toISOString(),
    executedSellAmount: '250000',
    executedSellAmountBeforeFees: '250000',
    executedBuyAmount: '500000000000000000',
  })
}

export function token(decimals: number, address = token0): EvmToken {
  return new EvmToken({
    chainId: EvmChainId.ETHEREUM,
    address,
    decimals,
    symbol: `T${decimals}`,
    name: `Token ${decimals}`,
  })
}
