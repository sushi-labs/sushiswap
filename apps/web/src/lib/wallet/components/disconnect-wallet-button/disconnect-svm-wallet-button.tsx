import { Slot } from '@sushiswap/ui'
import { useSvmWalletContext } from 'src/lib/wallet/namespaces/svm/provider/svm-wallet-provider'
import type { DisconnectWalletButtonProps } from './types'

export default function DisconnectSvmWalletButton({
  onMutate,
  onSuccess,
  onError,
  onSettled,
  asChild = false,
  children,
}: DisconnectWalletButtonProps) {
  const Comp = asChild ? Slot : 'button'

  const { disconnect } = useSvmWalletContext()

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
