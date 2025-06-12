'use client'

import { Button } from '@sushiswap/ui'
import { type FC, useState } from 'react'

export const TokenCollapsedDescription: FC<{ description: string }> = ({
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="flex flex-col gap-2 items-start">
      <div
        className={`text-sm prose dark:!prose-invert prose-slate !min-w-full ${
          !isExpanded ? 'line-clamp-3' : ''
        }`}
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
      <Button
        variant="link"
        size="sm"
        className="text-blue-400 hover:text-blue-500 mt-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Show less' : 'Read more'}
      </Button>
    </div>
  )
}
