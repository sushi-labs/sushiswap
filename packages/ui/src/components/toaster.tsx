'use client'

import { useToast } from './use-toast'
import {
  ToastClose,
  ToastDescription,
  Toastnew,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toastnew'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toastnew key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toastnew>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
