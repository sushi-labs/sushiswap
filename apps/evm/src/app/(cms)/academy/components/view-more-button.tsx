'use client'

import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { Button } from '@sushiswap/ui'
import Link from 'next/link'

export function ViewMoreButton({
  includeFilters,
  className,
}: { includeFilters?: boolean; className?: string }) {
  const href =
    includeFilters && typeof window !== 'undefined'
      ? `/academy/explore${window.location.search || ''}`
      : '/academy/explore'

  return (
    <Link href={href}>
      <Button
        icon={PlusCircleIcon}
        iconProps={{ fill: '#3B7EF6' }}
        variant="secondary"
        className={className}
      >
        View More
      </Button>
    </Link>
  )
}
