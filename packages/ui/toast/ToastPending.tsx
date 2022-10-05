import { Chain } from '@sushiswap/chain'
import { FC } from 'react'

import { Loader, NotificationData } from '..'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

interface ToastPending extends NotificationData {
  onDismiss(): void
}

export const ToastPending: FC<ToastPending> = ({ chainId, txHash, onDismiss, summary }) => {
  console.log({ chainId })
  return (
    <>
      <ToastContent
        icon={<Loader width={18} height={18} className="text-blue" />}
        title="Transaction Pending"
        summary={summary.pending}
      />
      <ToastButtons href={Chain.from(chainId).getTxUrl(txHash)} onDismiss={onDismiss} />
    </>
  )
}
