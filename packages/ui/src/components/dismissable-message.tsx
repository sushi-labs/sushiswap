'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import type { FC } from 'react'

import { Message, type MessageProps } from './message'

interface DismissableMessageProps extends MessageProps {
  storageKey: string
  showUntil: string // should be iso string
}

export const DismissableMessage: FC<DismissableMessageProps> = ({
  storageKey,
  showUntil,
  ...props
}) => {
  const [show, setShow] = useLocalStorage(storageKey, true)

  if (show && new Date() <= new Date(showUntil)) {
    return <Message {...props} onClose={() => setShow(false)} />
  }

  return <></>
}
