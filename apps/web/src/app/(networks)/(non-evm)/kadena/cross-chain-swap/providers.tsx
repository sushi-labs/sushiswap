import { DerivedstateCrossChainSwapProvider } from './derivedstate-cross-chain-swap-provider'

export async function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DerivedstateCrossChainSwapProvider>
      {children}
    </DerivedstateCrossChainSwapProvider>
  )
}
