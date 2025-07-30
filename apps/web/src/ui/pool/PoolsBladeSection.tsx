import { ChevronRightIcon } from '@heroicons/react-v1/solid'
import Image from 'next/image'

export const PoolsBladeSection = () => {
  return (
    <div className="flex flex-col gap-8 justify-between items-center border border-[#EBEBEB] dark:border-none p-4 rounded-xl bg-slate-50 dark:bg-transparent xl:gap-12 md:pl-12 xl:pl-12 md:flex-row">
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
      <Image
        src="/blade-chart-dark.png"
        alt="blade-chart"
        width={607}
        height={429}
        loader={({ src }) => src}
        className="hidden dark:md:block relative left-[33.66] min-[1230px]:left-[36.66]"
      />

      <Image
        src="/blade-chart-light.png"
        alt="blade-chart"
        width={607}
        height={429}
        loader={({ src }) => src}
        className="hidden relative lg:pb-6 left-[33.66] min-[1230px]:left-[36.66] md:block dark:hidden"
      />

      <div className="relative w-full md:hidden">
        <Image
          src="/blade-chart-mobile.svg"
          alt="blade-chart"
          width={315}
          height={241}
          loader={({ src }) => src}
          className="w-full"
        />

        <div className=" !bg-[#FFFFFF66] w-[39%] min-h-[32.5%] absolute bottom-[45%] right-[38px] !p-[2.5vw] !backdrop-blur-md dark:!bg-[#00000024] flex flex-col justify-between gap-2 border dark:border-[#FFFFFF14] rounded-xl">
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

        <div className="!bg-[#FFFFFF66] w-[39%] min-h-[32.5%] absolute bottom-[9%] right-[38px] !p-[2.5vw] !backdrop-blur-md dark:!bg-[#00000024] flex flex-col justify-between gap-2 border dark:border-[#FFFFFF14] rounded-xl">
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
