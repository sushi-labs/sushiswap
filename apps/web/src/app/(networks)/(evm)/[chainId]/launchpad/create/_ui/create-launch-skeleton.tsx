import { Container, SkeletonBox } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'

const STEP_SKELETONS = ['details', 'pool', 'review'] as const

function FieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <SkeletonBox className="h-3.5 w-24 rounded-sm" />
      <SkeletonBox className="mt-2 h-10 w-full rounded-lg" />
    </div>
  )
}

function DescriptionLineSkeleton({
  className,
  widthClassName,
}: {
  className?: string
  widthClassName: string
}) {
  return (
    <div className={`flex h-5 items-center ${className ?? ''}`}>
      <SkeletonBox className={`h-3.5 rounded-sm ${widthClassName}`} />
    </div>
  )
}

function SectionHeadingSkeleton({
  variant,
}: {
  variant: 'identity' | 'project'
}) {
  return (
    <div className="flex flex-col space-y-1.5">
      <SkeletonBox className="h-[18px] w-36 rounded-md" />
      <div>
        <DescriptionLineSkeleton widthClassName="w-full" />
        {variant === 'identity' ? (
          <DescriptionLineSkeleton
            className="hidden md:flex"
            widthClassName="w-3/4"
          />
        ) : (
          <>
            <DescriptionLineSkeleton widthClassName="w-4/5" />
            <DescriptionLineSkeleton
              className="hidden md:flex lg:hidden"
              widthClassName="w-2/3"
            />
          </>
        )}
      </div>
    </div>
  )
}

function FormSectionSkeleton({
  children,
  variant,
}: {
  children: ReactNode
  variant: 'identity' | 'project'
}) {
  return (
    <div className="grid grid-cols-3 gap-x-10 py-2 lg:gap-x-[56px]">
      <div className="col-span-3 py-4 md:col-span-1">
        <SectionHeadingSkeleton variant={variant} />
      </div>
      <div className="col-span-3 space-y-6 py-4 md:col-span-2">{children}</div>
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
        <div className="mt-3 h-[84px] sm:h-14">
          <div className="flex h-7 items-center">
            <SkeletonBox className="h-4 w-full rounded-sm" />
          </div>
          <div className="flex h-7 items-center">
            <SkeletonBox className="h-4 w-11/12 rounded-sm" />
          </div>
          <div className="flex h-7 items-center sm:hidden">
            <SkeletonBox className="h-4 w-2/3 rounded-sm" />
          </div>
        </div>
      </div>

      <div className="mt-7">
        <PerpsCard className="grid grid-cols-3 gap-2 p-2" fullWidth>
          {STEP_SKELETONS.map((step) => (
            <div
              key={step}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl px-2"
            >
              <SkeletonBox className="h-5 w-5 shrink-0" />
              <SkeletonBox className="hidden h-4 w-20 rounded-sm sm:block" />
            </div>
          ))}
        </PerpsCard>
      </div>

      <div className="mt-6">
        <PerpsCard className="p-5 sm:p-7" fullWidth>
          <FormSectionSkeleton variant="identity">
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton />
            </div>

            <div className="grid h-[76px] grid-cols-2 gap-3 rounded-xl bg-white/[0.04] p-4">
              <div>
                <SkeletonBox className="h-4 w-20 rounded-sm" />
                <SkeletonBox className="mt-1 h-6 w-10 rounded-sm" />
              </div>
              <div>
                <SkeletonBox className="h-4 w-16 rounded-sm" />
                <SkeletonBox className="mt-1 h-6 w-8 rounded-sm" />
              </div>
            </div>
          </FormSectionSkeleton>

          <div className="my-3 border-t border-white/[0.06]" />

          <FormSectionSkeleton variant="project">
            <SkeletonBox className="h-[130px] w-full rounded-xl lg:h-[114px]" />

            <div className="h-[126px]">
              <SkeletonBox className="h-3.5 w-24 rounded-sm" />
              <SkeletonBox className="mt-2 h-[98px] w-full rounded-lg" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
          </FormSectionSkeleton>

          <div className="mt-7 flex justify-end">
            <SkeletonBox className="h-11 w-[209px] rounded-xl" />
          </div>
        </PerpsCard>
      </div>
    </Container>
  )
}
