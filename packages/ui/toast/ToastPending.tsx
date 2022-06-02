import { FC } from 'react'

import { HalfCircleIcon } from '..'
import { Toast } from './index'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

export const ToastPending: FC<Toast> = ({ href, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<HalfCircleIcon width={18} height={18} className="text-blue" />}
        title="Transaction Pending"
        summary={summary.pending}
      />
      <ToastButtons href={href} onDismiss={onDismiss} />
    </>
  )
}
