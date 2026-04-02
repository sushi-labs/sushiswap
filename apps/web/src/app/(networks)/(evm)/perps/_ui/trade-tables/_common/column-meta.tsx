import { SkeletonText } from '@sushiswap/ui'

export const columnBodyMeta = {
  className: '!p-0 !pl-4 !h-[25px] !max-h-[25px] !text-xs',
  skeleton: (
    <>
      <div className="w-[80px]">
        <SkeletonText fontSize="lg" />
      </div>
    </>
  ),
}
