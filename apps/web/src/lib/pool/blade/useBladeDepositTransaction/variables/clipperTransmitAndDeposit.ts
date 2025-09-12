import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import type { AssertEqualContractFunctionArgs } from 'src/types/viem'
import type { ContractFunctionName } from 'viem'
import { parseUnits, zeroAddress } from 'viem'
import type { WriteContractVariables } from 'wagmi/query'
import type { clipperCaravelExchangeAbi } from '../../abi/clipperCaravelExchange'
import type { clipperCommonPackedAbi } from '../../abi/clipperCommonPacked'
import type { clipperDirectExchangeV0Abi } from '../../abi/clipperDirectExchangeV0'
import { clipperDirectExchangeV1Abi } from '../../abi/clipperDirectExchangeV1'
import type { DepositVariablesGetterArgs } from '../types'

export function clipperTransmitAndDeposit({
  deposit,
  amounts,
}: DepositVariablesGetterArgs) {
  const abi = clipperDirectExchangeV1Abi
  const nativeAmount = amounts.find((amount) => amount.token.isNative)

  if (deposit.amount && deposit.token) {
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
          [
            typeof clipperCommonPackedAbi,
            typeof clipperDirectExchangeV1Abi,
            typeof clipperCaravelExchangeAbi,
          ],
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
          [
            typeof clipperCommonPackedAbi,
            typeof clipperDirectExchangeV1Abi,
            typeof clipperCaravelExchangeAbi,
          ],
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
        [
          typeof clipperCommonPackedAbi,
          typeof clipperDirectExchangeV1Abi,
          typeof clipperCaravelExchangeAbi,
        ],
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
        [
          typeof clipperCommonPackedAbi,
          typeof clipperDirectExchangeV0Abi,
          typeof clipperDirectExchangeV1Abi,
          typeof clipperCaravelExchangeAbi,
        ],
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
      ],
    }
    return variables
  }
}
