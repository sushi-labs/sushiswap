import { type createConfig } from '@wagmi/core'
import { publicTransports, publicChains } from 'sushi/config'

export const publicWagmiConfig = {
  chains: publicChains,
  transports: publicTransports,
} as const satisfies Parameters<typeof createConfig>[0]
