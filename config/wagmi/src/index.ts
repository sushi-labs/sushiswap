import { createConfig } from '@wagmi/core'
import { publicChains, publicTransports } from 'sushi/config'

export const publicWagmiConfig = {
  chains: publicChains,
  transports: publicTransports,
} as const satisfies Parameters<typeof createConfig>[0]

export type PublicWagmiConfig = ReturnType<
  typeof createConfig<
    (typeof publicWagmiConfig)['chains'],
    (typeof publicWagmiConfig)['transports']
  >
>
