import { Button, Loader } from '@sushiswap/ui'
import { useEffect, useRef } from 'react'

export interface TokenPaginationProps {
  hasNextPage: boolean
  isFetching: boolean
  isFetchingNextPage: boolean
  isFetchNextPageError: boolean
  onLoadMore: () => void
}

export function TokenPagination({
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  isFetchNextPageError,
  onLoadMore,
}: TokenPaginationProps): React.ReactElement | null {
  const sentinel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = sentinel.current
    if (!element || !hasNextPage || isFetching || isFetchNextPageError) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      onLoadMore()
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [hasNextPage, isFetching, isFetchNextPageError, onLoadMore])

  if (!hasNextPage) return null

  return (
    <div
      ref={sentinel}
      className="flex min-h-16 items-center justify-center gap-3 py-4 text-sm text-perps-muted-50"
    >
      {isFetchingNextPage ? (
        <span role="status" className="flex items-center gap-2">
          <Loader width={16} height={16} /> Loading more launches…
        </span>
      ) : (
        <>
          {isFetchNextPageError && (
            <span>More launches could not be loaded.</span>
          )}
          <Button
            variant="perps-secondary"
            size="sm"
            disabled={isFetching}
            onClick={onLoadMore}
          >
            {isFetchNextPageError ? 'Try again' : 'Load more'}
          </Button>
        </>
      )}
    </div>
  )
}
