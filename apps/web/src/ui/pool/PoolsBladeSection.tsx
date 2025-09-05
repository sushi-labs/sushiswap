import { ChevronRightIcon } from '@heroicons/react-v1/solid'
import Image from 'next/image'

export const PoolsBladeSection = () => {
  return (
    <div className="flex flex-col gap-8 justify-between items-center border border-[#EBEBEB] dark:border-none md:p-4 rounded-xl bg-slate-50 dark:bg-transparent xl:gap-12 md:pl-12 xl:pl-12 md:flex-row">
      <div className="flex flex-col gap-12 w-full md:w-1/2 2xl:w-[37%]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col text-[1.75rem] leading-9 xl:!leading-10 font-bold text-center md:gap-2 md:leading-6 md:text-2xl xl:text-4xl md:text-left">
            <span>Forget APY</span>
            <span>Blade delivers ROI</span>
          </div>
          <p className="text-sm text-center xl:text-lg md:text-md text-muted-foreground md:text-left">
            Your yield is profit-based. Blade generates LP yields by making
            smart trades, not by charging fees while disguising your losses as
            "impermanent."
          </p>
          <div className="rounded-full xl:mt-4 flex mx-auto lg:mx-0 items-center gap-2 w-fit px-4 py-2 text-[#3D657C] dark:text-muted-foreground bg-[#3D657C0A] dark:bg-[#1E293B]">
            <span className="text-sm font-medium">
              How Blade Generates Superior APY?
            </span>
            <div className="rounded-full bg-[#22485D] p-1 w-[22px] aspect-1">
              <ChevronRightIcon className="text-[#F2F4F6] dark:text-inherit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
