'use client' // Error components must be Client Components

import {
  Button,
  Container,
  classNames,
  typographyVariants,
} from '@sushiswap/ui'

export default function SwapError({
  reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="animate-slide">
      <h1
        className={classNames(
          typographyVariants({ variant: 'h1' }),
          'mx-auto text-center p-4',
        )}
      >
        Something went wrong!
      </h1>
      <Container maxWidth="lg" className="px-4">
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </Button>
        </div>
      </Container>
    </div>
  )
}
