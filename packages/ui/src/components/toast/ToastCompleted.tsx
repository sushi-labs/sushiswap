import { ResolvedNotification } from '@sushiswap/dexie'
import { FC } from 'react'
import { Chain } from 'sushi/chain'

import { ToastContent } from './ToastContent'

interface ToastCompleted extends ResolvedNotification {
  onDismiss(): void
}

export const ToastCompleted: FC<ToastCompleted> = ({
  type,
  href,
  chainId,
  txHash,
  onDismiss,
  summary,
}) => {
  const txUrl = href
    ? href
    : txHash
    ? Chain.from(chainId)?.getTxUrl(txHash)
    : ''
  return (
    <>
      <ToastContent href={txUrl} summary={summary} />
    </>
  )
}
