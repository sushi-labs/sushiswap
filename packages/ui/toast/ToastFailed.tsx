import { XCircleIcon } from '@heroicons/react/outline'
import { FC } from 'react'

import { NotificationData } from './index'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

export const ToastFailed: FC<NotificationData> = ({ href, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<XCircleIcon width={18} height={18} className="text-red" />}
        title="Transaction Failed"
        summary={summary.failed}
      />
      <ToastButtons href={href} onDismiss={onDismiss} />
    </>
  )
}
