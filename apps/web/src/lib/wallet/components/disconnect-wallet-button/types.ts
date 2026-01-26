import type { WalletNamespace } from 'src/lib/wallet/types'

export type DisconnectWalletButtonProps = {
  namespace: WalletNamespace
  onMutate?: () => void
  onSuccess?: () => void
  onError?: (error: Error | undefined) => void
  onSettled?: () => void
  asChild?: boolean
  children: React.ReactNode
}
