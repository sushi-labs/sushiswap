import { EvmChainId, USDC, isEvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import { isSvmChainId } from 'sushi/svm'
import { parseUnits } from 'viem'

const MAINNET_NATIVE_RESERVE = parseUnits('0.002', 18) // 0.002 native units
const EVM_NATIVE_RESERVE = parseUnits('0.00004', 18) // 0.00004 native units
const SOL_NATIVE_RESERVE = 10_000_000n // 0.01 SOL
// Fixed Max buffer, not a transaction fee estimate. Arc's native and ERC-20
// USDC interfaces share the same balance, with 18 and 6 decimals respectively.
const ARC_USDC_RESERVE = '0.01'

export function getNativeBalanceReserve(
  chainId: EvmChainId | SvmChainId,
): bigint {
  if (chainId === EvmChainId.ARC) {
    return parseUnits(ARC_USDC_RESERVE, 18)
  }
  if (chainId === EvmChainId.ETHEREUM) {
    return MAINNET_NATIVE_RESERVE
  }
  return isEvmChainId(chainId) ? EVM_NATIVE_RESERVE : SOL_NATIVE_RESERVE
}

export function getGasBalanceReserve(
  currency: CurrencyFor<EvmChainId | SvmChainId | StellarChainId>,
): bigint {
  if (
    currency.chainId === EvmChainId.ARC &&
    currency.type === 'token' &&
    currency.address.toLowerCase() ===
      USDC[EvmChainId.ARC].address.toLowerCase()
  ) {
    return parseUnits(ARC_USDC_RESERVE, currency.decimals)
  }

  if (
    currency.type === 'native' &&
    (isEvmChainId(currency.chainId) || isSvmChainId(currency.chainId))
  ) {
    return getNativeBalanceReserve(currency.chainId)
  }

  return 0n
}

export function getSpendableNativeBalance(
  balance: bigint,
  reserve: bigint,
): bigint {
  return balance > reserve ? balance - reserve : 0n
}
