import { type EvmAddress, weth9Abi_deposit } from 'sushi/evm'
import { type Hex, encodeFunctionData } from 'viem'
import type { CowLimitChainId } from './chains'
import { COW_SETTLEMENT_ABI, getCowSettlement } from './order'

export interface CowTransactionRequest {
  to: EvmAddress
  data: Hex
  value?: bigint
}

export function getCowPresignTransaction(
  chainId: CowLimitChainId,
  uid: Hex,
): CowTransactionRequest {
  return {
    to: getCowSettlement(chainId),
    data: encodeFunctionData({
      abi: COW_SETTLEMENT_ABI,
      functionName: 'setPreSignature',
      args: [uid, true],
    }),
  }
}

export function getCowInvalidateTransaction(
  chainId: CowLimitChainId,
  uid: Hex,
): CowTransactionRequest {
  return {
    to: getCowSettlement(chainId),
    data: encodeFunctionData({
      abi: COW_SETTLEMENT_ABI,
      functionName: 'invalidateOrder',
      args: [uid],
    }),
  }
}

export function getCowWrapTransaction(
  wrappedNative: EvmAddress,
  value: bigint,
): CowTransactionRequest {
  return {
    to: wrappedNative,
    value,
    data: encodeFunctionData({
      abi: weth9Abi_deposit,
      functionName: 'deposit',
    }),
  }
}
