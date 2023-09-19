import { Chain } from '@sushiswap/chain'
import { ResolvedNotification } from '@sushiswap/dexie'
import { FC } from 'react'

import { ToastContent } from './ToastContent.js'

interface ToastFailed extends ResolvedNotification {
  onDismiss(): void
}

export const ToastFailed: FC<ToastFailed> = ({ href, type, chainId, txHash, onDismiss, summary }) => {
  const txUrl = href ? href : txHash ? Chain.from(chainId)?.getTxUrl(txHash) : ''
  return (
    <>
      <ToastContent href={txUrl} summary={summary} />
    </>
  )
}
