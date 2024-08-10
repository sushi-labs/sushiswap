import { createConfig } from '@wagmi/core'
import { publicChains, publicTransports } from 'sushi/config'

export const config = createConfig({
  chains: publicChains,
  transports: publicTransports,
  batch: {
    multicall: {
      wait: 64,
    },
  },
} as const satisfies Parameters<typeof createConfig>[0])
