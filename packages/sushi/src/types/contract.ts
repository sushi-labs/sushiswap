import type { Abi, ContractFunctionConfig } from 'viem'

export type Contract<TAbi extends Abi = []> = Omit<
  ContractFunctionConfig<TAbi>,
  'functionName' | 'args'
>
