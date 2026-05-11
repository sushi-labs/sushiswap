import { SkeletonText } from '@sushiswap/ui'

export const columnBodyMeta = {
  className: '!p-0 !pl-2 !h-[25px] !max-h-[25px] !text-xs',
  skeleton: (
    <>
      <div className="w-[80px]">
        <SkeletonText fontSize="lg" />
      </div>
    </>
  ),
}

export const tableRowClassName =
  'bg-gradient-to-r from-[#EDF0F3]/[0.05] to-transparent to-[15%] border-b-perps-background'
