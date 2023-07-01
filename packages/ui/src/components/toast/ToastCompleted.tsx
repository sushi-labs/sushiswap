import { Chain } from '@sushiswap/chain'
import { FC } from 'react'

import { ToastContent } from './ToastContent'
import { ResolvedNotification } from '@sushiswap/dexie'

interface ToastCompleted extends ResolvedNotification {
  onDismiss(): void
}

export const ToastCompleted: FC<ToastCompleted> = ({ type, href, chainId, txHash, onDismiss, summary }) => {
  const txUrl = href ? href : txHash ? Chain.from(chainId)?.getTxUrl(txHash) : ''
  return (
    <>
      <ToastContent href={txUrl} summary={summary} />
    </>
  )
}
