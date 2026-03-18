import { Slot } from '@sushiswap/ui'
import { useStellarWalletContext } from '../../namespaces/stellar/provider/stellar-wallet-provider'
import type { DisconnectWalletButtonProps } from './types'

export default function DisconnectStellarWalletButton({
  onMutate,
  onSuccess,
  onError,
  onSettled,
  asChild = false,
  children,
}: DisconnectWalletButtonProps) {
  const Comp = asChild ? Slot : 'button'

  const { disconnect } = useStellarWalletContext()

  const onClick = async () => {
    onMutate?.()
    try {
      await disconnect()
      onSuccess?.()
    } catch (error) {
      onError?.(error as Error)
    } finally {
      onSettled?.()
    }
  }

  return <Comp onClick={onClick}>{children}</Comp>
}
