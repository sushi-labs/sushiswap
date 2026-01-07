import { Slot } from '@sushiswap/ui'
import { useEvmWalletContext } from 'src/lib/wallet/namespaces/evm/provider/evm-wallet-provider'
import type { ConnectWalletButtonProps } from './types'

export default function ConnectEvmWalletButton({
  wallet,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  asChild = false,
  children,
}: ConnectWalletButtonProps) {
  const Comp = asChild ? Slot : 'button'

  const { connect } = useEvmWalletContext()

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
