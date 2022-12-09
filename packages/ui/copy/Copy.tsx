import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/outline'
import { useCopyClipboard } from '@sushiswap/hooks'
import classNames from 'classnames'
import React, { FC } from 'react'

interface CopyHelperProps {
  className?: string
  toCopy: string
  children?: React.ReactNode
}

const CopyHelper: FC<CopyHelperProps> = ({ className, toCopy, children }) => {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <div className={classNames(className)} onClick={() => setCopied(toCopy)}>
      {isCopied && (
        <div className="flex items-center gap-1 cursor-pointer">
          {children}
          <CheckIcon width={16} height={16} />
        </div>
      )}

      {!isCopied && (
        <div className="flex items-center gap-1 cursor-pointer">
          {children}
          <DocumentDuplicateIcon width={16} height={16} />
        </div>
      )}
    </div>
  )
}

export default CopyHelper
