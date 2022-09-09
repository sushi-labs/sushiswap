import { FC } from 'react'

import { Loader, NotificationData } from '..'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

export const ToastPending: FC<NotificationData> = ({ href, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<Loader width={18} height={18} className="text-blue" />}
        title="Transaction Pending"
        summary={summary.pending}
      />
      <ToastButtons href={href} onDismiss={onDismiss} />
    </>
  )
}
