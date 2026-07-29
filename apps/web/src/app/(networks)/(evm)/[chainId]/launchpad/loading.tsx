import { Container, SkeletonBox } from '@sushiswap/ui'

export default function LaunchpadLoading() {
  return (
    <Container maxWidth="7xl" className="w-full px-4 py-10 sm:py-14">
      <div className="space-y-4">
        <SkeletonBox className="h-5 w-28 rounded-lg" />
        <SkeletonBox className="h-11 w-full max-w-xl rounded-xl" />
        <SkeletonBox className="h-6 w-full max-w-2xl rounded-lg" />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonBox key={index} className="h-[245px] rounded-xl" />
        ))}
      </div>
    </Container>
  )
}
