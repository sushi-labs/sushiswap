import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import type { AssertEqualContractFunctionArgs } from 'src/types/viem'
import type { ContractFunctionName } from 'viem'
import { parseUnits, zeroAddress } from 'viem'
import type { WriteContractVariables } from 'wagmi/query'
import { bladeApproximateExchangeAbi } from '../../abi/bladeApproximateExchange'
import type { bladeVerifiedExchangeAbi } from '../../abi/bladeVerifiedExchange'
import type { DepositVariablesGetterArgs } from '../types'

export function bladeTransmitAndDeposit({
  deposit,
  amounts,
}: DepositVariablesGetterArgs) {
  if (!deposit.extra_data) {
    throw new Error('Extra data is required for blade deposits')
  }

  const abi = bladeApproximateExchangeAbi
  const nativeAmount = amounts.find((amount) => amount.token.isNative)

  if ('amount' in deposit) {
    const tokenAddress = nativeAmount ? zeroAddress : deposit.token
    if (nativeAmount) {
      const mutability = 'payable' as const
      const functionName =
        'depositSingleAsset' as const satisfies ContractFunctionName<
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
        address: deposit.clipper_exchange_address,
        abi,
        functionName,
        args: [
          deposit.sender,
          tokenAddress,
          BigInt(deposit.amount),
          BigInt(
            'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
          ),
          BigInt(deposit.pool_tokens),
          BigInt(deposit.good_until),
          deposit.signature,
          deposit.extra_data,
        ],
        value: parseUnits(nativeAmount.amount, nativeAmount.token.decimals),
      }
      return variables
    } else {
      const mutability = 'nonpayable' as const
      const functionName =
        'transmitAndDepositSingleAsset' as const satisfies ContractFunctionName<
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
        address: deposit.clipper_exchange_address,
        abi,
        functionName,
        args: [
          tokenAddress,
          BigInt(deposit.amount),
          BigInt(
            'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
          ),
          BigInt(deposit.pool_tokens),
          BigInt(deposit.good_until),
          deposit.signature,
          deposit.extra_data,
        ],
      }
      return variables
    }
  }

  if (nativeAmount) {
    const mutability = 'payable' as const
    const functionName = 'deposit' as const satisfies ContractFunctionName<
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
      address: deposit.clipper_exchange_address,
      abi,
      functionName,
      args: [
        deposit.sender,
        deposit.deposit_amounts.map((amount) => BigInt(amount)),
        BigInt(
          'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
        ),
        BigInt(deposit.pool_tokens),
        BigInt(deposit.good_until),
        deposit.signature,
        deposit.extra_data,
      ] as const,
      value: parseUnits(nativeAmount.amount, nativeAmount.token.decimals),
    }
    return variables
  } else {
    const mutability = 'nonpayable' as const
    const functionName =
      'transmitAndDeposit' as const satisfies ContractFunctionName<
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
      address: deposit.clipper_exchange_address,
      abi,
      functionName,
      args: [
        deposit.deposit_amounts.map((amount) => BigInt(amount)),
        BigInt(
          'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
        ),
        BigInt(deposit.pool_tokens),
        BigInt(deposit.good_until),
        deposit.signature,
        deposit.extra_data,
      ],
    }
    return variables
  }
}
