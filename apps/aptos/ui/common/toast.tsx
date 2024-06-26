import { TOAST_OPTIONS } from '@sushiswap/ui'
import { ToastButtons, ToastContent } from '@sushiswap/ui'
import React from 'react'
import { toast } from 'react-toastify'

interface Props {
  summery: string
  link?: string
  toastId: string
}

export const createToast = ({ summery, link = '', toastId }: Props) => {
  toast(
    <>
      <ToastContent summary={summery} href={link} />
      <ToastButtons onDismiss={() => toast.dismiss(toastId)} />
    </>,
    {
      ...TOAST_OPTIONS,
      toastId,
      autoClose: 5000,
    },
  )
}
