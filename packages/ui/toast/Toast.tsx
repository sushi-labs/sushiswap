import React, { ReactNode } from 'react'
import { toast, ToastOptions } from 'react-toastify'

import { ToastCompleted } from './ToastCompleted'
import { ToastFailed } from './ToastFailed'
import { ToastPending } from './ToastPending'

export const TOAST_OPTIONS: ToastOptions = {
  position: 'top-right',
  autoClose: false,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  closeButton: false,
  icon: false,
}

export interface NotificationData {
  summary: {
    pending: ReactNode | Array<ReactNode>
    completed: ReactNode | Array<ReactNode>
    failed: ReactNode | Array<ReactNode>
  }
  href: string
  txHash: string
  promise: Promise<any>
  onDismiss(): void
}

export const createToast = (props: Omit<NotificationData, 'onDismiss'>) => {
  const onDismiss = () => toast.dismiss(props.txHash)

  // Spawn new toasts based on promise result
  props.promise
    .then(() => {
      setTimeout(onDismiss, 3000)

      // Spawn success notification
      const toastId = `completed:${props.txHash}`
      toast(<ToastCompleted {...props} onDismiss={() => toast.dismiss(toastId)} />, {
        ...TOAST_OPTIONS,
        toastId,
        autoClose: 5000,
      })
    })
    .catch(() => {
      setTimeout(onDismiss, 3000)

      // Spawn error notification
      const toastId = `failed:${props.txHash}`
      toast(<ToastFailed {...props} onDismiss={() => toast.dismiss(toastId)} />, {
        ...TOAST_OPTIONS,
        toastId,
      })
    })

  return toast(<ToastPending {...props} onDismiss={onDismiss} />, {
    ...TOAST_OPTIONS,
    toastId: props.txHash,
  })
}
