import { Message, classNames } from '@sushiswap/ui'
import type { FC } from 'react'

interface CrossChainSwapChainUnsupportedMessageProps {
  className?: string
  walletName: string | undefined
}

export const CrossChainSwapChainUnsupportedMessage: FC<
  CrossChainSwapChainUnsupportedMessageProps
> = ({ className, walletName }) => {
  return (
    <Message size="sm" className={classNames('!p-4', className)}>
      {walletName ?? 'The connected'} wallet does not support the selected
      destination network. Please choose a different network.
    </Message>
  )
}
