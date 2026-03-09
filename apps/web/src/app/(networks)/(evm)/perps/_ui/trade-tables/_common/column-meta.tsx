import { SkeletonText } from '@sushiswap/ui'

export const columnBodyMeta = {
  className: '!p-2 !pl-4 !h-[40px] !max-h-[40px] !text-xs',
  skeleton: (
    <>
      <div className="w-[80px]">
        <SkeletonText fontSize="lg" />
      </div>
    </>
  ),
}
