import { Button } from '@sushiswap/ui'
import { Wrapper } from '../swap/trade/wrapper'

export const Statistics = () => {
  return (
    <Wrapper className="flex flex-col gap-6 !p-5 border basis-1/3 border-accent">
      <StatisticsHeader />
      <StatisticsContent />
    </Wrapper>
  )
}

const StatisticsHeader = () => {
  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <span className="text-lg font-semibold">Statistics</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="rounded-xl border- !bg-[#00000005] dark:!bg-[#FFFFFF05]"
        >
          <span>V2</span>
        </Button>
        <Button
          variant="outline"
          className="rounded-xl border-dashed !bg-[#00000005] dark:!bg-[#FFFFFF05]"
        >
          <span>V3</span>
        </Button>
      </div>
    </div>
  )
}

const StatisticsContent = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground">TVL (7d%)</span>
        <div className="">
          <p className="text-[1.75rem] font-semibold">$3.3b</p>
          <p className="text-sm text-red-500">-1.2%</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground">Volume (7d%)</span>
        <div className="">
          <p className="text-[1.75rem] font-semibold">$23.62m </p>
          <p className="text-sm text-green-500">+1.69%</p>
        </div>
      </div>
    </div>
  )
}
