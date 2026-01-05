import type { ButtonProps } from '@sushiswap/ui'
import type { WalletWithState } from 'src/lib/wallet/types'

export type ConnectWalletButtonProps = Omit<ButtonProps, 'onClick'> & {
  wallet: WalletWithState
}
