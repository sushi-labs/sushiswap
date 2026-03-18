import { Slot } from '@sushiswap/ui'
import { useStellarWalletContext } from '../../namespaces/stellar/provider/stellar-wallet-provider'
import type { ConnectWalletButtonProps } from './types'

export default function ConnectStellarWalletButton({
  wallet,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  asChild = false,
  children,
}: ConnectWalletButtonProps) {
  const Comp = asChild ? Slot : 'button'

  const { connect } = useStellarWalletContext()

  const onClick = async () => {
    onMutate?.()
    try {
      await connect(wallet, onSuccess)
    } catch (error) {
      onError?.(error as Error)
    } finally {
      onSettled?.()
    }
  }

  return <Comp onClick={onClick}>{children}</Comp>
}
