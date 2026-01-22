import { getDefaultConfig } from '@solana/connector'

export const connectorConfig = getDefaultConfig({
  appName: 'SushiSwap',
  appUrl:
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000',
  autoConnect: true,
  enableMobile: true,
})
