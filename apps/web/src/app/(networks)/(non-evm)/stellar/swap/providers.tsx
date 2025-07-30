import { SwapProvider } from '~stellar/_common/ui/Swap/SwapProvider'

export async function Providers({ children }: { children: React.ReactNode }) {
  return <SwapProvider>{children}</SwapProvider>
}
