import type { ButtonProps } from '@sushiswap/ui'
import type { WalletWithState } from 'src/lib/wallet/types'

export type ConnectWalletButtonProps = ButtonProps & {
  wallet: WalletWithState
  onMutate?: () => void
  onSuccess?: (address: string) => void
  onError?: (error: Error | undefined) => void
  onSettled?: () => void
}
