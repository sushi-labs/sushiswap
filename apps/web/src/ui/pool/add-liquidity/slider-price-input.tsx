import { Slider } from '@sushiswap/ui'
import type { FC } from 'react'

interface SliderPriceInputProps {
  id?: string
  value: [number, number]
  onUserInput(val: number[]): void
  price?: number
}

export const SliderPriceInput: FC<SliderPriceInputProps> = ({
  id,
  value,
  onUserInput,
  price,
}) => {
  const fivePercentOfPrice = price ? price * 0.05 : 0.05 // Default to 0.05 if price is undefined
  return (
    <div className="w-full relative">
      <div className="absolute left-1/2 z-10 -translate-x-1/2 w-[0.5px] border border-dashed top-0 h-full" />
      <Slider
        id={id}
        value={value}
        onValueChange={(val) => {
          onUserInput(val)
        }}
        min={price ? price / 2 : 0}
        max={price ? price * 1.5 : 1}
        step={fivePercentOfPrice}
        className="w-full !bg-[#0000001A] dark:!bg-[#FFFFFF14] rounded-full h-[22px]"
        trackClassName="!bg-[#0000001A] dark:!bg-[#FFFFFF14] rounded-full h-[22px]"
        thumbClassName="!bg-blue dark:!bg-skyblue h-7 w-7 border border-4 !border-slate-200 dark:!border-slate-750"
        rangeClassName="!bg-[#4217FF14] dark:!bg-[#3DB1FF14] rounded-full"
      />
    </div>
  )
}
