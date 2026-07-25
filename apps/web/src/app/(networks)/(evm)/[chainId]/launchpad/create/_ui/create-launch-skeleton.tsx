import { Container, SkeletonBox } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'

const STEP_SKELETONS = ['details', 'pool', 'review'] as const

function FieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <SkeletonBox className="h-4 w-24 rounded-sm" />
      <SkeletonBox className="mt-2 h-10 w-full rounded-lg" />
    </div>
  )
}

function SectionHeadingSkeleton() {
  return (
    <div>
      <SkeletonBox className="h-6 w-36 rounded-md" />
      <SkeletonBox className="mt-2 h-4 w-full max-w-md rounded-sm" />
    </div>
  )
}

export function CreateLaunchSkeleton() {
  return (
    <Container
      maxWidth="5xl"
      className="w-full px-4 py-10 sm:py-14"
      aria-busy="true"
      aria-label="Loading create token form"
    >
      <span className="sr-only">Loading create token form</span>

      <div className="max-w-2xl">
        <SkeletonBox className="h-9 w-64 rounded-lg sm:h-10 sm:w-80" />
        <div className="mt-3 space-y-2">
          <SkeletonBox className="h-4 w-full rounded-sm" />
          <SkeletonBox className="h-4 w-5/6 rounded-sm" />
        </div>
      </div>

      <div className="mt-7">
        <PerpsCard className="grid grid-cols-3 gap-2 p-2" fullWidth>
          {STEP_SKELETONS.map((step) => (
            <div
              key={step}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl px-2"
            >
              <SkeletonBox className="h-5 w-5 shrink-0 rounded-full" />
              <SkeletonBox className="hidden h-4 w-20 rounded-sm sm:block" />
            </div>
          ))}
        </PerpsCard>
      </div>

      <div className="mt-6">
        <PerpsCard className="p-5 sm:p-7" fullWidth>
          <div className="space-y-5">
            <SectionHeadingSkeleton />

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton />
            </div>

            <div className="grid gap-3 rounded-xl bg-white/[0.04] p-4 sm:grid-cols-2">
              <div>
                <SkeletonBox className="h-3 w-20 rounded-sm" />
                <SkeletonBox className="mt-2 h-5 w-10 rounded-sm" />
              </div>
              <div>
                <SkeletonBox className="h-3 w-16 rounded-sm" />
                <SkeletonBox className="mt-2 h-5 w-8 rounded-sm" />
              </div>
            </div>
          </div>

          <div className="my-8 border-t border-white/[0.06]" />

          <div className="space-y-5">
            <SectionHeadingSkeleton />

            <SkeletonBox className="h-28 w-full rounded-xl" />

            <div>
              <SkeletonBox className="h-4 w-24 rounded-sm" />
              <SkeletonBox className="mt-2 h-24 w-full rounded-lg" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
          </div>

          <div className="mt-7 flex justify-end">
            <SkeletonBox className="h-11 w-52 rounded-xl" />
          </div>
        </PerpsCard>
      </div>
    </Container>
  )
}
