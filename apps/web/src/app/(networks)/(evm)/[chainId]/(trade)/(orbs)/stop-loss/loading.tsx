import { Container, SkeletonBox } from '@sushiswap/ui'
import { OrbsBanner } from '../_ui/orbs-banner'

export default function SwapStopLossLoading() {
  return (
    <Container maxWidth="xl">
      <div className="flex flex-col gap-4 p-4 md:px-12 md:py-6 bg-secondary rounded-3xl border-accent border">
        <div className="flex gap-2">
          <SkeletonBox className="shrink-0 h-[36px] w-[61px] rounded-xl" />
          <SkeletonBox className="shrink-0 h-[36px] w-[56px] rounded-xl" />
          <SkeletonBox className="shrink-0 h-[36px] w-[54px] rounded-xl" />
          <SkeletonBox className="shrink-0 h-[36px] w-[136px] rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <SkeletonBox className="w-full h-[157px] rounded-xl" />
            <div className="flex flex-col gap-[10px]">
              <SkeletonBox className="w-full h-[142px] rounded-xl" />
              <SkeletonBox className="w-full h-[142px] rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end gap-2 py-1">
            <SkeletonBox className="w-[69px] h-[28px] rounded-xl" />
            <SkeletonBox className="w-[80px] h-[28px] rounded-xl" />
            <SkeletonBox className="w-[87px] h-[28px] rounded-xl" />
            <SkeletonBox className="w-[73px] h-[28px] rounded-xl" />
          </div>
        </div>
        <SkeletonBox className="w-full h-[52px] rounded-xl" />
        <SkeletonBox className="w-full h-[52px] rounded-xl" />
        <OrbsBanner />
      </div>
    </Container>
  )
}
