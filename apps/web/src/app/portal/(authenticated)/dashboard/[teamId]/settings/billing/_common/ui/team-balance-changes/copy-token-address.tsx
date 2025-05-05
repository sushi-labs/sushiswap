'use client'

import { ClipboardDocumentIcon } from '@heroicons/react/24/solid'
import { ClipboardController } from '@sushiswap/ui'
import type { Address } from 'viem'

export function CopyTokenAddress({ address }: { address: Address }) {
  return (
    <ClipboardController>
      {({ setCopied }) => (
        <ClipboardDocumentIcon
          width={20}
          height={20}
          className="ml-1 cursor-pointer"
          onClick={() => setCopied(address)}
        />
      )}
    </ClipboardController>
  )
}
