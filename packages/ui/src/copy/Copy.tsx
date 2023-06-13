import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { useCopyClipboard } from '@sushiswap/hooks'
import classNames from 'classnames'
import React, { FC } from 'react'

export interface CopyHelperProps {
  className?: string
  toCopy: string
  children?: React.ReactNode | ((isCopied: boolean) => React.ReactNode)
  hideIcon?: boolean
}

/**
 * @deprecated
 */
export const CopyHelper: FC<CopyHelperProps> = ({ className, toCopy, hideIcon = false, children }) => {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <div className={classNames(className)} onClick={() => setCopied(toCopy)}>
      {isCopied && (
        <div className="flex items-center gap-1 cursor-pointer">
          {typeof children === 'function' ? children(isCopied) : children}
          {!hideIcon && <CheckIcon width={16} height={16} />}
        </div>
      )}

      {!isCopied && (
        <div className="flex items-center gap-1 cursor-pointer">
          {typeof children === 'function' ? children(isCopied) : children}
          {!hideIcon && <DocumentDuplicateIcon width={16} height={16} />}
        </div>
      )}
    </div>
  )
}

export default CopyHelper
