'use client'

import { ClipboardDocumentIcon } from '@heroicons/react/24/solid'
import { ClipboardController } from '@sushiswap/ui'

export function CopyButton({ value }: { value: string }) {
  return (
    <ClipboardController>
      {({ setCopied }) => (
        <ClipboardDocumentIcon
          width={20}
          height={20}
          className="ml-1 cursor-pointer"
          onClick={() => setCopied(value)}
        />
      )}
    </ClipboardController>
  )
}
