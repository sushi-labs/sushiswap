import { Slot } from '@sushiswap/ui'
import { useSvmWalletContext } from 'src/lib/wallet/namespaces/svm/provider/svm-wallet-provider'
import type { ConnectWalletButtonProps } from './types'

export default function ConnectSvmWalletButton({
  wallet,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  asChild = false,
  children,
}: ConnectWalletButtonProps) {
  const Comp = asChild ? Slot : 'button'

  const { connect } = useSvmWalletContext()

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
