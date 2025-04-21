'use client'

import { classNames } from '@sushiswap/ui'
import { useEffect, useState } from 'react'

type Message = {
  type: 'error' | 'success'
  message: string
}

interface useCollapsibleMessage {
  successTimeout?: number
  defaultMessage?: Message | null
}

export function useCollapsibleMessage({
  successTimeout,
}: useCollapsibleMessage = {}) {
  const [message, setMessage] = useState<Message | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (successTimeout && message?.type === 'success') {
      timeout = setTimeout(() => setMessage(null), successTimeout || 2000)
    }

    return () => clearTimeout(timeout)
  }, [message, successTimeout])

  return { setMessage, message }
}

interface CollapsibleMessage {
  message: Message | null
}

export function CollapsibleMessage({ message }: CollapsibleMessage) {
  return (
    <div
      className={classNames(
        message?.type === 'success' && 'text-green-500',
        message?.type === 'error' && 'text-red-500',
        'w-full text-center font-medium pt-4',
      )}
    >
      {message?.message || ''}
    </div>
  )
}
