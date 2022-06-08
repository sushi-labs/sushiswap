import { CheckCircleIcon } from '@heroicons/react/outline'
import { FC } from 'react'

import { Toast } from './index'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

export const ToastCompleted: FC<Toast> = ({ href, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<CheckCircleIcon width={18} height={18} className="text-green" />}
        title="Transaction Completed"
        summary={summary.completed}
      />
      <ToastButtons href={href} onDismiss={onDismiss} />
    </>
  )
}
