import { Message, classNames } from '@sushiswap/ui'

interface CrossChainSwapChainUnsupportedMessageProps {
  className?: string
  walletName: string | undefined
}

export function CrossChainSwapChainUnsupportedMessage({
  className,
  walletName,
}: CrossChainSwapChainUnsupportedMessageProps) {
  return (
    <Message size="sm" className={classNames('!p-4', className)}>
      {walletName ?? 'The connected'} wallet does not support the selected
      destination network. Please choose a different network.
    </Message>
  )
}
