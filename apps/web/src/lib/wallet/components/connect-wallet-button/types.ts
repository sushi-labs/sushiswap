import type { WalletWithState } from 'src/lib/wallet/types'

export type ConnectWalletButtonProps = {
  wallet: WalletWithState
  onClick?: () => void
  onMutate?: () => void
  onSuccess?: (address: string) => void
  onError?: (error: Error | undefined) => void
  onSettled?: () => void
  asChild?: boolean
  children: React.ReactNode
}
