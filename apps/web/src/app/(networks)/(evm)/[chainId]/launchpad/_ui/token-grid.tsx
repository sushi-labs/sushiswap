import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { isRobinhoodStockToken } from 'src/lib/robinhood/stock-tokens'
import { useRobinhoodStockTokens } from 'src/lib/robinhood/use-robinhood-stock-tokens'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../types'
import { CollectionStateCard } from './state-card'
import { TokenCard, TokenCardSkeleton } from './token-card'

const GRID_CLASS_NAME =
  'grid grid-cols-1 gap-4 [&>*]:min-w-0 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

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
      className={GRID_CLASS_NAME}
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
  const { data: stockTokens } = useRobinhoodStockTokens()

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
    <div className={GRID_CLASS_NAME}>
      {tokens.map((token) => (
        <TokenCard
          key={token.id}
          token={token}
          sortBy={sortBy}
          manage={manage}
          isStockPair={isRobinhoodStockToken(
            {
              chainId: token.chainId,
              address: token.pool.quoteToken.address,
            },
            stockTokens,
          )}
        />
      ))}
      {isFetchingNextPage
        ? TOKEN_CARD_SKELETONS.slice(0, 4).map((skeleton) => (
            <TokenCardSkeleton key={`next-${skeleton}`} />
          ))
        : null}
    </div>
  )
}
