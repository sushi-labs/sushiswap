'use client'

import { Button, classNames, typographyVariants } from '@sushiswap/ui'
import Link from 'next/link'

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <div className="space-y-6 flex flex-col items-center">
      <span className="flex flex-col space-y-2 items-center">
        <span className={typographyVariants({ variant: 'h1' })}>
          An error has occured
        </span>
        <span className={typographyVariants({ variant: 'h2' })}>
          {error.message}
        </span>
      </span>
      <Link href="/portal">
        <Button>Go Home</Button>
      </Link>
    </div>
  )
}
