import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import type { AssertEqualContractFunctionArgs } from 'src/types/viem'
import type { ContractFunctionName } from 'viem'
import { zeroAddress } from 'viem'
import type { WriteContractVariables } from 'wagmi/query'
import type { clipperCaravelExchangeAbi } from '../../abi/clipperCaravelExchange'
import type { clipperCommonPackedAbi } from '../../abi/clipperCommonPacked'
import type { clipperDirectExchangeV0Abi } from '../../abi/clipperDirectExchangeV0'
import { clipperDirectExchangeV1Abi } from '../../abi/clipperDirectExchangeV1'
import type { WithdrawVariablesGetterArgs } from '../types'

export function clipperWithdraw({
  withdraw,
  token,
  poolTokenAmountToBurn,
  poolAddress,
}: WithdrawVariablesGetterArgs) {
  const abi = clipperDirectExchangeV1Abi

  if (withdraw && token) {
    // Single asset withdrawal
    const mutability = 'nonpayable' as const
    const functionName =
      'withdrawSingleAsset' as const satisfies ContractFunctionName<
        typeof abi,
        typeof mutability
      >

    const args: AssertEqualContractFunctionArgs<
      [
        typeof clipperCaravelExchangeAbi,
        typeof clipperCommonPackedAbi,
        typeof clipperDirectExchangeV1Abi,
      ],
      typeof mutability,
      typeof functionName
    > = [
      withdraw.token_holder_address,
      BigInt(withdraw.pool_token_amount_to_burn),
      token.isNative ? zeroAddress : withdraw.asset_address,
      BigInt(withdraw.asset_amount),
      BigInt(withdraw.good_until),
      withdraw.signature,
    ]
    const variables: WriteContractVariables<
      typeof abi,
      typeof functionName,
      typeof args,
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
      [
        typeof clipperDirectExchangeV1Abi,
        typeof clipperCaravelExchangeAbi,
        typeof clipperCommonPackedAbi,
        typeof clipperDirectExchangeV0Abi,
      ],
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
