import type { IsEqualMultiple } from 'src/types/utils'
import type {
  Abi,
  AbiStateMutability,
  ContractFunctionArgs,
  ContractFunctionName,
} from 'viem'

export type AssertEqualContractFunctionArgs<
  T extends readonly Abi[],
  M extends AbiStateMutability,
  F extends ContractFunctionName<T[number], M>,
> = IsEqualMultiple<{
  readonly [K in keyof T]: ContractFunctionArgs<T[K], M, F>
}>
