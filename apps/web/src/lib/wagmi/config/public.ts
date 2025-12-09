import type { Config, CreateConfigParameters } from '@wagmi/core'
// import type { PublicWagmiConnectors } from './production'
import { publicChains, publicTransports } from './viem'

export const publicWagmiConfig = {
  chains: publicChains,
  transports: publicTransports,
  batch: {
    multicall: {
      wait: 64,
    },
  },
} as const satisfies CreateConfigParameters

type _PublicWagmiConfig = Config<
  (typeof publicWagmiConfig)['chains'],
  (typeof publicWagmiConfig)['transports']
  // TODO: Properly type
  // PublicWagmiConnectors
>

// Speedup
export type PublicWagmiConfig = Omit<_PublicWagmiConfig, 'chains'> & {
  chains: [_PublicWagmiConfig['chains'][number]]
}
