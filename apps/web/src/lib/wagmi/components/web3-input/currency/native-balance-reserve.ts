import { EvmChainId } from 'sushi/evm'
import { isEvmChainId } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'
import { parseUnits } from 'viem'

const MAINNET_NATIVE_RESERVE = parseUnits('0.002', 18) // 0.002 native units
const EVM_NATIVE_RESERVE = parseUnits('0.00004', 18) // 0.00004 native units
const SOL_NATIVE_RESERVE = 10_000_000n // 0.01 SOL

export function getNativeBalanceReserve(
  chainId: EvmChainId | SvmChainId,
): bigint {
  if (chainId === EvmChainId.ETHEREUM) {
    return MAINNET_NATIVE_RESERVE
  }
  return isEvmChainId(chainId) ? EVM_NATIVE_RESERVE : SOL_NATIVE_RESERVE
}

export function getSpendableNativeBalance(
  balance: bigint,
  reserve: bigint,
): bigint {
  return balance > reserve ? balance - reserve : 0n
}
