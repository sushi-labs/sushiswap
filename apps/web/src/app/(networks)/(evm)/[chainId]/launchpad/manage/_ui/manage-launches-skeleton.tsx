import { Container, SkeletonBox } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { TokenGridSkeleton } from '../../_ui/token-grid'

export function ManageLaunchesSkeleton() {
  return (
    <div aria-label="Loading your launches" aria-busy="true">
      <Container maxWidth="7xl" className="w-full px-4 py-10 sm:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-2xl">
            <SkeletonBox className="h-9 w-48 rounded-lg sm:h-10" />
            <SkeletonBox className="mt-3 h-4 w-full max-w-xl rounded-sm" />
            <SkeletonBox className="mt-2 h-4 w-4/5 max-w-lg rounded-sm" />
          </div>
          <SkeletonBox className="h-11 w-36 shrink-0 rounded-xl" />
        </div>

        <PerpsCard
          className="mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          fullWidth
        >
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-10 w-10 shrink-0 rounded-xl" />
            <div>
              <SkeletonBox className="h-3 w-24 rounded-sm" />
              <SkeletonBox className="mt-2 h-4 w-32 rounded-sm" />
            </div>
          </div>
          <SkeletonBox className="h-8 w-28 rounded-lg" />
        </PerpsCard>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {['launches', 'tvl'].map((metric) => (
            <PerpsCard key={metric} className="p-4" fullWidth>
              <SkeletonBox className="h-3 w-20 rounded-sm" />
              <SkeletonBox className="mt-2 h-6 w-24 rounded-md" />
            </PerpsCard>
          ))}
        </div>
      </Container>

      <section className="border-t border-white/[0.04] py-10">
        <Container maxWidth="7xl" className="w-full px-4">
          <SkeletonBox className="h-7 w-32 rounded-md" />
          <SkeletonBox className="mt-2 h-4 w-full max-w-md rounded-sm" />
          <div className="mt-6">
            <TokenGridSkeleton />
          </div>
        </Container>
      </section>
    </div>
  )
}
