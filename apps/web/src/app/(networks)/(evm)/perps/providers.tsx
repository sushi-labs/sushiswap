'use client'

import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <CheckerProvider>{children}</CheckerProvider>
}
