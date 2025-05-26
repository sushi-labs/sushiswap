import { Dots } from '@sushiswap/ui'
import type { FC } from 'react'
import { EvmChain } from 'sushi/chain'

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
  description,
}) => {
  const txUrl = href
    ? href
    : txHash
      ? EvmChain.from(chainId)?.getTxUrl(txHash)
      : ''
  return (
    <>
      <ToastContent
        description={description}
        href={txUrl}
        summary={<Dots>{summary}</Dots>}
      />
    </>
  )
}
