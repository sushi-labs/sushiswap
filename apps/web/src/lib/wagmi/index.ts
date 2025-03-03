import type { PublicWagmiConfig } from './config/public'

declare module 'wagmi' {
  interface Register {
    config: PublicWagmiConfig
  }
}
