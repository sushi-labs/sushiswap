import { PublicWagmiConfig } from '@sushiswap/wagmi-config'

declare module 'wagmi' {
  interface Register {
    config: PublicWagmiConfig
  }
}
