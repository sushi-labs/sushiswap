import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../types'
import { QuickBuyProvider } from './quick-buy'
import { CollectionStateCard } from './state-card'
import { TokenCard, TokenCardSkeleton } from './token-card'

const TOKEN_CARD_SKELETONS = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelth',
] as const

export function TokenGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-3 [&>*]:min-w-0 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6"
      aria-label="Loading launches"
      aria-busy="true"
    >
      {TOKEN_CARD_SKELETONS.slice(0, count).map((skeleton) => (
        <TokenCardSkeleton key={skeleton} />
      ))}
    </div>
  )
}

export function TokenGrid({
  tokens,
  sortBy,
  manage,
  isFetchingNextPage = false,
}: {
  tokens: LaunchpadToken[]
  sortBy?: LaunchpadTokenSortField
  manage?: boolean
  isFetchingNextPage?: boolean
}) {
  const [firstToken] = tokens

  if (!firstToken) {
    return (
      <CollectionStateCard
        icon={
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/[0.05] text-perps-muted-50">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </span>
        }
        title="No launches found"
        description="Try another name, symbol, token address, or creator."
      />
    )
  }

  return (
    <QuickBuyProvider chainId={firstToken.chainId}>
      <div className="grid grid-cols-1 gap-3 [&>*]:min-w-0 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
        {tokens.map((token) => (
          <TokenCard
            key={token.id}
            token={token}
            sortBy={sortBy}
            manage={manage}
          />
        ))}
        {isFetchingNextPage
          ? TOKEN_CARD_SKELETONS.slice(0, 4).map((skeleton) => (
              <TokenCardSkeleton key={`next-${skeleton}`} />
            ))
          : null}
      </div>
    </QuickBuyProvider>
  )
}
