import type { Address } from '@wagmi/core'
import type { Abi, ContractFunctionConfig } from 'viem'

export type CurrencyId = Address | 'ETH' | 'WETH' | 'USDC' | 'DAI' | 'USDT' | 'WBTC' | 'WETH9'

export type HexString = `0x${string}`

export type Id = `0x${string}_${number}`

export type NumberStringToNumber<T extends string> = T extends `${infer Result extends number}` ? Result : never

export type Contract<TAbi extends Abi = []> = Omit<ContractFunctionConfig<TAbi>, 'functionName' | 'args'>
