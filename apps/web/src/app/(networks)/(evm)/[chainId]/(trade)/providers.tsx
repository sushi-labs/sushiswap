'use client'

import { useSkaleEuropaFaucet } from 'src/lib/hooks/api/use-skale-europa-faucet'
import { CheckerProvider } from 'src/lib/wagmi/systems/checker/provider'

export function Providers({ children }: { children: React.ReactNode }) {
  useSkaleEuropaFaucet()
  return <CheckerProvider>{children}</CheckerProvider>
}
