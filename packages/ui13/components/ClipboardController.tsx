import { useCopyClipboard } from '@sushiswap/hooks'
import React, { FC } from 'react'

interface ClipboardControllerPayload {
  isCopied: boolean
  setCopied(toCopy: string): void
}

interface ClipboardControllerProps {
  children: (payload: ClipboardControllerPayload) => React.ReactNode
}

export const ClipboardController: FC<ClipboardControllerProps> = ({ children }) => {
  const [isCopied, setCopied] = useCopyClipboard()
  return <>{children({ setCopied, isCopied })}</>
}
