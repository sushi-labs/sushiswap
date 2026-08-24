import { Container, SkeletonBox, SkeletonCircle } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'

export function ManageTokenPageSkeleton() {
  return (
    <Container
      maxWidth="6xl"
      className="w-full px-4 py-10 sm:py-14"
      aria-label="Loading launch management"
      aria-busy="true"
    >
      <SkeletonBox className="h-5 w-40 rounded-sm" />

      <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <SkeletonCircle radius={64} />
          <div>
            <SkeletonBox className="h-9 w-64 max-w-[60vw] rounded-lg" />
            <SkeletonBox className="mt-2 h-4 w-32 rounded-sm" />
          </div>
        </div>
        <SkeletonBox className="h-10 w-40 rounded-xl" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <PerpsCard className="p-5 sm:p-7" fullWidth>
          <SkeletonBox className="h-6 w-32 rounded-md" />
          <SkeletonBox className="mt-3 h-4 w-full max-w-lg rounded-sm" />
          <SkeletonBox className="mt-2 h-4 w-4/5 max-w-md rounded-sm" />
          <SkeletonBox className="mt-6 h-32 w-full rounded-xl" />
          <div className="mt-6 space-y-5">
            <SkeletonBox className="h-24 w-full rounded-lg" />
            <SkeletonBox className="h-10 w-full rounded-lg" />
            <SkeletonBox className="h-10 w-full rounded-lg" />
            <SkeletonBox className="h-10 w-full rounded-lg" />
          </div>
          <div className="mt-7 flex justify-end">
            <SkeletonBox className="h-10 w-52 rounded-xl" />
          </div>
        </PerpsCard>

        <div className="space-y-5">
          <PerpsCard className="p-5" fullWidth>
            <SkeletonBox className="h-6 w-28 rounded-md" />
            <div className="mt-5 space-y-4">
              {['creator', 'factory', 'pool', 'fees'].map((item) => (
                <div key={item} className="flex justify-between gap-4">
                  <SkeletonBox className="h-4 w-20 rounded-sm" />
                  <SkeletonBox className="h-4 w-28 rounded-sm" />
                </div>
              ))}
            </div>
          </PerpsCard>
          <PerpsCard className="p-5" fullWidth>
            <SkeletonBox className="h-6 w-36 rounded-md" />
            <SkeletonBox className="mt-3 h-4 w-full rounded-sm" />
            <SkeletonBox className="mt-5 h-10 w-full rounded-xl" />
          </PerpsCard>
        </div>
      </div>
    </Container>
  )
}
