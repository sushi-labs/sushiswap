import { ResolvedNotification } from '@sushiswap/dexie'
import { FC } from 'react'
import { Chain } from 'sushi/chain'

import { ToastContent } from './ToastContent'

interface ToastFailed extends ResolvedNotification {
  onDismiss(): void
}

export const ToastFailed: FC<ToastFailed> = ({
  href,
  type: _type,
  chainId,
  txHash,
  onDismiss: _onDismiss,
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
