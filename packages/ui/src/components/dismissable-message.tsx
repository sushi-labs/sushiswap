'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import { FC } from 'react'

import { Message, type MessageProps } from '..'

interface DismissableMessageProps extends MessageProps {
  storageKey: string
  showUntil: Date
}

export const DismissableMessage: FC<DismissableMessageProps> = ({ storageKey, showUntil, ...props }) => {
  const [show, setShow] = useLocalStorage(storageKey, true)

  if (show && new Date() <= showUntil) {
    return <Message {...props} onClose={() => setShow(false)} />
  }

  return <></>
}
