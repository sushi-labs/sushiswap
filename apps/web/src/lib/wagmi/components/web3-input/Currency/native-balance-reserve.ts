import type { EvmChainId } from 'sushi/evm'
import { isEvmChainId } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'

const EVM_NATIVE_RESERVE = 2n * 10n ** 15n // 0.002 native units
const SOL_NATIVE_RESERVE = 10_000_000n // 0.01 SOL

export function getNativeBalanceReserve(
  chainId: EvmChainId | SvmChainId,
): bigint {
  return isEvmChainId(chainId) ? EVM_NATIVE_RESERVE : SOL_NATIVE_RESERVE
}

export function getSpendableNativeBalance(
  balance: bigint,
  reserve: bigint,
): bigint {
  return balance > reserve ? balance - reserve : 0n
}
