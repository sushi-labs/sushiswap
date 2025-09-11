import { Message, classNames } from '@sushiswap/ui'
import type { FC } from 'react'

interface SlippageWarningProps {
  className?: string
}

export const SlippageWarning: FC<SlippageWarningProps> = ({ className }) => {
  return (
    <Message
      variant="destructive"
      size="sm"
      className={classNames('!p-4', className)}
    >
      To reduce the risk of being front-run, decrease your settings. If slippage
      exceeds 20%, it might make your transaction less profitable.
    </Message>
  )
}
