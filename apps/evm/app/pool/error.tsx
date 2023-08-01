'use client'

import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Button, typographyVariants } from '@sushiswap/ui'
import Link from 'next/link'

export default function Error({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-8 text-center">
        <h2 className={typographyVariants({ variant: 'h1', className: 'max-w-lg font-semibold' })}>{error.message}</h2>
        <div className="flex justify-center gap-8">
          <Button variant="link" size="xl" asChild icon={ChevronRightIcon} iconPosition="end">
            <Link href="/pool">Swap any token</Link>
          </Button>
          <Button variant="link" size="xl" asChild icon={ChevronRightIcon} iconPosition="end">
            <Link href="/pool">See a list of our pools</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
