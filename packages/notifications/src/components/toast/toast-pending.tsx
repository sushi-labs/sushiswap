import { Dots } from '@sushiswap/ui'
import type { FC } from 'react'
import { getChainById } from 'sushi'

import type { ResolvedNotification } from '../../types'
import { ToastContent } from './toast-content'

interface ToastPending extends ResolvedNotification {
  onDismiss(): void
}

export const ToastPending: FC<ToastPending> = ({
  type: _type,
  href,
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
      <ToastContent href={txUrl} summary={<Dots>{summary}</Dots>} />
    </>
  )
}
