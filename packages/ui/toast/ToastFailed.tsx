import { XCircleIcon } from '@heroicons/react/outline'
import { Chain } from '@sushiswap/chain'
import { FC } from 'react'

import { NotificationData } from './index'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

interface ToastFailed extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastFailed: FC<ToastFailed> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<XCircleIcon width={18} height={18} className="text-red" />}
        title="Transaction Failed"
        summary={summary.failed}
      />
      <ToastButtons href={href ? href : Chain.from(chainId).getTxUrl(txHash)} onDismiss={onDismiss} />
    </>
  )
}
