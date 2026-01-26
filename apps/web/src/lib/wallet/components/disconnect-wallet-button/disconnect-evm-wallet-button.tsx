import { Slot } from '@sushiswap/ui'
import { useEvmWalletContext } from 'src/lib/wallet/namespaces/evm/provider/evm-wallet-provider'
import type { DisconnectWalletButtonProps } from './types'

export default function DisconnectEvmWalletButton({
  onMutate,
  onSuccess,
  onError,
  onSettled,
  asChild = false,
  children,
}: DisconnectWalletButtonProps) {
  const Comp = asChild ? Slot : 'button'

  const { disconnect } = useEvmWalletContext()

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
