import type { KvmChainId } from 'sushi/kvm'
import type { EthereumChainId } from '~kadena/_common/ui/General/x-chain-token-selector'
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
