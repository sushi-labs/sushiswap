import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import type { AssertEqualContractFunctionArgs } from 'src/types/viem'
import type { ContractFunctionName } from 'viem'
import { parseUnits, zeroAddress } from 'viem'
import type { WriteContractVariables } from 'wagmi/query'
import { bladeVerifiedExchangeAbi } from '../../abi/bladeVerifiedExchange'
import { byte32, packAddressAndAmount, packRfqConfig } from '../../utils'
import type { DepositVariablesGetterArgs } from '../types'
import { bladeTransmitAndDeposit } from './bladeTransmitAndDeposit'

export function bladePackedTransmitAndDeposit({
  deposit,
  amounts,
}: DepositVariablesGetterArgs) {
  if (!deposit.extra_data) {
    throw new Error('Extra data is required for blade deposits')
  }

  const abi = bladeVerifiedExchangeAbi
  const nativeAmount = amounts.find((amount) => amount.token.isNative)
  const lockTimeParam =
    'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0)
  const { v, r, s } = deposit.signature

  // Handle single asset deposits using packed format
  if (deposit.amount && deposit.token) {
    const tokenAddress = nativeAmount ? zeroAddress : deposit.token
    const mutability = 'payable' as const
    const functionName =
      'packedTransmitAndDepositSingleAsset' as const satisfies ContractFunctionName<
        typeof abi,
        typeof mutability
      >

    const packedInput = packAddressAndAmount(deposit.amount, tokenAddress)
    const packedConfig = packRfqConfig(
      deposit.pool_tokens,
      deposit.good_until,
      lockTimeParam,
      v,
    )

    const variables: WriteContractVariables<
      typeof abi,
      typeof functionName,
      AssertEqualContractFunctionArgs<
        [typeof bladeVerifiedExchangeAbi],
        typeof mutability,
        typeof functionName
      >,
      PublicWagmiConfig,
      PublicWagmiConfig['chains'][number]['id']
    > = {
      address: deposit.clipper_exchange_address,
      abi,
      functionName,
      args: [
        packedInput,
        packedConfig,
        byte32(r),
        byte32(s),
        deposit.extra_data,
      ],
      ...(nativeAmount
        ? {
            value: parseUnits(nativeAmount.amount, nativeAmount.token.decimals),
          }
        : {}),
    }
    return variables
  }

  // For multi-asset deposits, use regular blade function
  return bladeTransmitAndDeposit({ deposit, amounts })
}
