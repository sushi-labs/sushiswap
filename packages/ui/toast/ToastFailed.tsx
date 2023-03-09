import { Chain } from '@sushiswap/chain'
import { FC } from 'react'

import { NotificationData } from './index'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

interface ToastFailed extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastFailed: FC<ToastFailed> = ({ href, type, chainId, txHash, onDismiss, summary }) => {
  const txUrl = href ? href : Chain.from(chainId)?.getTxUrl(txHash) ?? ''
  return (
    <>
      <ToastContent href={txUrl} summary={summary.failed} />
      <ToastButtons href={txUrl} onDismiss={onDismiss} />
    </>
  )
}
