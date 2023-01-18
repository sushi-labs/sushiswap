import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Chain } from '@sushiswap/chain'
import { FC } from 'react'

import { NotificationData } from './index'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

interface ToastCompleted extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastCompleted: FC<ToastCompleted> = ({ type, href, chainId, txHash, onDismiss, summary }) => {
  const txUrl = href ? href : Chain.from(chainId)?.getTxUrl(txHash) ?? ''
  return (
    <>
      <ToastContent href={txUrl} summary={summary.completed} />
      <ToastButtons href={txUrl} onDismiss={onDismiss} />
    </>
  )
}
