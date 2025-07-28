import { ChevronRightIcon } from '@heroicons/react-v1/solid'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import Image from 'next/image'

export const PoolsBladeSection = () => {
  return (
    <div className="flex flex-col gap-8 justify-between items-center xl:gap-12 md:pl-8 xl:pl-12 md:flex-row">
      <div className="flex flex-col gap-12 w-full md:w-1/2 xl:w-[36%]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col text-[1.75rem] leading-9 xl:leading-9 font-bold text-center md:gap-2 md:leading-6 md:text-2xl xl:text-4xl md:text-left">
            <span>Forget APY</span>
            <span>Blade delivers ROI</span>
          </div>
          <p className="text-sm text-center xl:text-lg md:text-md text-muted-foreground md:text-left">
            Your yield is profit-based. Blade generates LP yields by making
            smart trades, not by charging fees while disguising your losses as
            "impermanent."
          </p>
          <div className="rounded-full flex items-center gap-2 w-fit px-4 py-2 text-muted-foreground bg-[#F4F5F6] dark:bg-[#1E293B]">
            <span className="text-sm font-medium">
              How Blade Generates Superior APY?
            </span>
            <div className="rounded-full bg-[#22485D] p-1 w-[22px] aspect-1">
              <ChevronRightIcon />
            </div>
          </div>
        </div>
      </div>
      <Image
        src="/blade-chart-dark.png"
        alt="blade-chart"
        width={607}
        height={429}
        loader={({ src }) => src}
        className="hidden w-1/2 md:block"
      />
      <div className="relative md:hidden">
        <Image
          src="/blades.svg"
          alt="blade-chart"
          width={315}
          height={241}
          loader={({ src }) => src}
          className="w-full"
        />

        <div className=" !bg-[#00000024] w-[39%] min-h-[32.5%] absolute bottom-[45%] right-[38px] !p-[2.5vw] !backdrop-blur-md dark:!bg-[#00000024] flex flex-col justify-between gap-2 border dark:border-[#FFFFFF14] rounded-xl">
          <div className="rounded-[1.25rem] font-medium px-2 py-1 bg-[#7883F41A] w-fit text-[#7883F4] text-[2.5vw]">
            Blade’s Yield
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[4.5vw] font-semibold text-slate-900 dark:text-slate-100">
              $724.23{' '}
            </span>
            <span className="text-[2.5vw] text-[#6B727F]">Jun 22, 2024</span>
          </div>
        </div>

        <div className="!bg-[#00000024] w-[39%] min-h-[32.5%] absolute bottom-[9%] right-[38px] !p-[2.5vw] !backdrop-blur-md dark:!bg-[#00000024] flex flex-col justify-between gap-2 border dark:border-[#FFFFFF14] rounded-xl">
          <div className="rounded-[1.25rem] font-medium px-2 py-1 bg-[#FF007A1A] w-fit text-[#FF007A] text-[2.5vw]">
            Uniswap's Yield
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[4.5vw] font-semibold text-slate-900 dark:text-slate-100">
              $453.67{' '}
            </span>
            <span className="text-[2.5vw] text-[#6B727F]">Jun 22, 2024</span>
          </div>
        </div>
      </div>
    </div>
  )
}
