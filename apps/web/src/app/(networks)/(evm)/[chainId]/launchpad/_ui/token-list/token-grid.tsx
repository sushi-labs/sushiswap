import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useMediaQuery } from '@sushiswap/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { isRobinhoodStockToken } from 'src/lib/robinhood/stock-tokens'
import { useRobinhoodStockTokens } from 'src/lib/robinhood/use-robinhood-stock-tokens'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../../types'
import { CollectionStateCard } from '../_common/state-card'
import { TokenCard, TokenCardSkeleton } from './token-card'

const GRID_CLASS_NAME =
  'relative grid grid-cols-1 gap-4 [&>*]:min-w-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

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
  const motionAllowed = useMediaQuery({
    query: '(prefers-reduced-motion: no-preference)',
  })

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
      <AnimatePresence initial={false} mode="popLayout">
        {tokens?.map((token) => (
          <motion.div
            key={token.id}
            layout={motionAllowed ? 'position' : false}
            initial={
              motionAllowed
                ? { opacity: 0, x: -48, y: -48, rotate: -6, scale: 0.94 }
                : false
            }
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
            transition={
              motionAllowed
                ? {
                    type: 'spring',
                    stiffness: 360,
                    damping: 28,
                    opacity: { duration: 0.2 },
                  }
                : { duration: 0 }
            }
            // Stop visible motion immediately if the preference changes mid-flight.
            className="min-w-0 motion-reduce:!transform-none motion-reduce:!opacity-100"
          >
            <TokenCard
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
          </motion.div>
        ))}
      </AnimatePresence>
      {isFetchingNextPage
        ? TOKEN_CARD_SKELETONS.slice(0, 4).map((skeleton) => (
            <TokenCardSkeleton key={`next-${skeleton}`} />
          ))
        : null}
    </div>
  )
}
