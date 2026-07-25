import { Container, SkeletonBox } from '@sushiswap/ui'

export default function TokenDetailLoading() {
  return (
    <Container maxWidth="7xl" className="w-full space-y-5 px-4 py-10">
      <SkeletonBox className="h-20 w-full max-w-lg rounded-xl" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <SkeletonBox className="h-[470px] rounded-xl" />
        <SkeletonBox className="h-[470px] rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonBox key={index} className="h-24 rounded-xl" />
        ))}
      </div>
    </Container>
  )
}
