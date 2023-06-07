'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { log } from 'next-axiom'

export default function SwapError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    log.error('SwapError', error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        type="button"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
