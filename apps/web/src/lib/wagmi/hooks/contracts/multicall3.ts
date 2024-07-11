'use client'

import { publicWagmiConfig } from '@sushiswap/wagmi-config'
import { Address } from 'viem'

export type Multicall3ChainId =
  (typeof publicWagmiConfig)['chains'][number]['id']

export const MULTICALL_3_ADDRESS = publicWagmiConfig.chains.reduce(
  (acc, chain) => {
    acc[chain.id] = chain.contracts.multicall3.address
    return acc
  },
  {} as Record<Multicall3ChainId, Address>,
)
