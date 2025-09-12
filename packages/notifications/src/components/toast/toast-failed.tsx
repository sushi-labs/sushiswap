import type { FC } from 'react'
import { getChainById } from 'sushi'

import type { ResolvedNotification } from '../../types'
import { ToastContent } from './toast-content'

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
      ? getChainById(chainId).getTransactionUrl(txHash as `0x${string}`)
      : ''
  return (
    <>
      <ToastContent href={txUrl} summary={summary} />
    </>
  )
}
