import type { FC } from 'react'
import { EvmChain } from 'sushi/chain'

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
  description,
}) => {
  const txUrl = href
    ? href
    : txHash
      ? EvmChain.from(chainId)?.getTxUrl(txHash)
      : ''
  return (
    <>
      <ToastContent description={description} href={txUrl} summary={summary} />
    </>
  )
}
