import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import type { AssertEqualContractFunctionArgs } from 'src/types/viem'
import type { ContractFunctionName } from 'viem'
import { zeroAddress } from 'viem'
import type { WriteContractVariables } from 'wagmi/query'
import { bladeApproximateExchangeAbi } from '../../abi/bladeApproximateExchange'
import type { bladeVerifiedExchangeAbi } from '../../abi/bladeVerifiedExchange'
import type { WithdrawVariablesGetterArgs } from '../types'

export function bladeWithdraw({
  withdraw,
  token,
  poolTokenAmountToBurn,
  poolAddress,
}: WithdrawVariablesGetterArgs) {
  const abi = bladeApproximateExchangeAbi

  if (withdraw && token) {
    if (!withdraw.extra_data) {
      throw new Error(
        'Extra data is required for blade single asset withdrawal',
      )
    }

    // Single asset withdrawal
    const mutability = 'nonpayable' as const
    const functionName =
      'withdrawSingleAsset' as const satisfies ContractFunctionName<
        typeof abi,
        typeof mutability
      >

    const args: AssertEqualContractFunctionArgs<
      [typeof bladeApproximateExchangeAbi, typeof bladeVerifiedExchangeAbi],
      typeof mutability,
      typeof functionName
    > = [
      withdraw.token_holder_address,
      BigInt(withdraw.pool_token_amount_to_burn),
      token.isNative ? zeroAddress : withdraw.asset_address,
      BigInt(withdraw.asset_amount),
      BigInt(withdraw.good_until),
      withdraw.signature,
      withdraw.extra_data,
    ]
    const variables: WriteContractVariables<
      typeof abi,
      typeof functionName,
      AssertEqualContractFunctionArgs<
        [typeof bladeApproximateExchangeAbi, typeof bladeVerifiedExchangeAbi],
        typeof mutability,
        typeof functionName
      >,
      PublicWagmiConfig,
      PublicWagmiConfig['chains'][number]['id']
    > = {
      address: poolAddress,
      abi,
      functionName,
      args,
    }
    return variables
  }

  // Multi-asset withdrawal
  const mutability = 'nonpayable' as const
  const functionName = 'burnToWithdraw' as const satisfies ContractFunctionName<
    typeof abi,
    typeof mutability
  >

  const variables: WriteContractVariables<
    typeof abi,
    typeof functionName,
    AssertEqualContractFunctionArgs<
      [typeof bladeApproximateExchangeAbi, typeof bladeVerifiedExchangeAbi],
      typeof mutability,
      typeof functionName
    >,
    PublicWagmiConfig,
    PublicWagmiConfig['chains'][number]['id']
  > = {
    address: poolAddress,
    abi,
    functionName,
    args: [BigInt(poolTokenAmountToBurn)],
  }
  return variables
}
