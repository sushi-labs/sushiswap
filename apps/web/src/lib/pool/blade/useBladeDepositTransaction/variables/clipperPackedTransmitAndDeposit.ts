import type { ContractFunctionName } from 'viem'
import { parseUnits, zeroAddress } from 'viem'
import { clipperCommonPackedAbi } from '../../abi/clipperCommonPacked'
import { byte32, packAddressAndAmount, packRfqConfig } from '../../utils'
import type { DepositVariablesGetterArgs } from '../types'
import { clipperTransmitAndDeposit } from './clipperTransmitAndDeposit'

export function clipperPackedTransmitAndDeposit({
  deposit,
  amounts,
}: DepositVariablesGetterArgs) {
  const abi = clipperCommonPackedAbi
  const nativeAmount = amounts.find((amount) => amount.token.isNative)
  const lockTimeParam =
    'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0)
  const { v, r, s } = deposit.signature

  if (deposit.amount && deposit.token) {
    const mutability = 'payable' as const
    const functionName =
      'packedTransmitAndDepositOneAsset' as const satisfies ContractFunctionName<
        typeof abi,
        typeof mutability
      >

    const tokenAddress = nativeAmount ? zeroAddress : deposit.token
    const packedInput = packAddressAndAmount(deposit.amount, tokenAddress)
    const packedConfig = packRfqConfig(
      deposit.pool_tokens,
      deposit.good_until,
      lockTimeParam,
      v,
    )

    const variables = {
      address: deposit.clipper_exchange_address,
      abi,
      functionName,
      args: [packedInput, packedConfig, byte32(r), byte32(s)],
      ...(nativeAmount
        ? {
            value: parseUnits(nativeAmount.amount, nativeAmount.token.decimals),
          }
        : {}),
    }
    return variables
  }

  // For multi-asset deposits, use regular non-packed function since packed version
  // doesn't support multi-asset deposits in this context
  return clipperTransmitAndDeposit({ deposit, amounts })
}
