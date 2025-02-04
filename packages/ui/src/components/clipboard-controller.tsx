import { useCopyClipboard } from '@sushiswap/hooks'
import type React from 'react'
import type { FC } from 'react'

interface ClipboardControllerPayload {
  isCopied: boolean
  setCopied(toCopy: string): void
}

interface ClipboardControllerProps {
  hideTooltip?: boolean
  children: (payload: ClipboardControllerPayload) => React.ReactNode
}

export const ClipboardController: FC<ClipboardControllerProps> = ({
  children,
  hideTooltip = false,
}) => {
  const [isCopied, setCopied] = useCopyClipboard()

  if (!hideTooltip) {
    return (
      <div className="group relative">
        {children({ setCopied, isCopied })}
        <div className="left-0 right-0 absolute group-hover:flex hidden mt-1 justify-center">
          <span className="bg-gray-600 text-white px-2 py-0.5 rounded-xl whitespace-nowrap text-[10px]">
            {isCopied ? 'Copied!' : 'Copy'}
          </span>
        </div>
      </div>
    )
  }

  return <>{children({ setCopied, isCopied })}</>
}
