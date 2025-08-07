import type { Config, createConfig } from '@wagmi/core'
import { publicChains, publicTransports } from './viem'

export const publicWagmiConfig = {
  chains: publicChains,
  transports: publicTransports,
  batch: {
    multicall: {
      wait: 64,
    },
  },
} as const satisfies Parameters<typeof createConfig>[0]

export type PublicWagmiConfig = Config<
  (typeof publicWagmiConfig)['chains'],
  (typeof publicWagmiConfig)['transports']
>
