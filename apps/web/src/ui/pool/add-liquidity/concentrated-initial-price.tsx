import { Button, TextField } from '@sushiswap/ui'
import { useLayoutEffect, useRef, useState } from 'react'
import type { Type } from 'sushi/currency'

export const ConcentratedInitialPrice = ({
  token0,
  token1,
  startingPrice,
  onStartPriceInput,
}: {
  token0: Type
  token1: Type
  startingPrice: string
  onStartPriceInput: (value: string) => void
}) => {
  const spanRef = useRef<HTMLSpanElement>(null)
  const [inputWidth, setInputWidth] = useState(1)

  // biome-ignore lint/correctness/useExhaustiveDependencies: startingPrice is a controlled input
  useLayoutEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth
      setInputWidth(width + 28) // +10 for padding
    }
  }, [startingPrice])
  const [rateDirection, setRateDirection] = useState<'token0' | 'token1'>(
    'token0',
  )

  return (
    <div className="w-full p-6 bg-gray-100 dark:bg-slate-900 rounded-xl border border-[#00000014] dark:border-[#FFFFFF14]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-slate-900 dark:text-pink-100">
            Initial Price
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="xs"
              onClick={() => setRateDirection('token1')}
              className={
                rateDirection === 'token1'
                  ? '!bg-[#00000014] dark:!bg-[#ffffff14]'
                  : ''
              }
            >
              {token0?.symbol}
            </Button>
            <Button
              onClick={() => setRateDirection('token0')}
              variant="outline"
              size="xs"
              className={
                rateDirection === 'token0'
                  ? '!bg-[#00000014] dark:!bg-[#ffffff14]'
                  : ''
              }
            >
              {token1?.symbol}
            </Button>
          </div>
        </div>
        <div className="flex md:items-end justify-between flex-col md:flex-row gap-2">
          <div className="flex gap-2 items-end">
            <div className="dark:text-pink-100 text-3xl text-black">
              {/* {rateDirection === 'token0' ? token0Per1 : token1Per0} */}
              <div className="relative inline-block">
                <TextField
                  type="number"
                  value={startingPrice}
                  onValueChange={(value) => onStartPriceInput(value)}
                  placeholder="0.0"
                  style={{ width: `${inputWidth}px` }}
                  className="absolute top-0 left-0 dark:!text-pink-100 text-3xl !text-black !bg-gray-100 dark:!bg-slate-900"
                />
                <span
                  ref={spanRef}
                  className="invisible whitespace-pre text-3xl font-normal"
                >
                  {startingPrice || '0.0'}
                </span>
              </div>
            </div>
            <div className="text-sm text-slate-700 dark:text-pink-200 pl-[19px]">
              {rateDirection === 'token0'
                ? `${token0?.symbol} per ${token1?.symbol}`
                : `${token1?.symbol} per ${token0?.symbol}`}
            </div>
          </div>
          <div className="text-blue dark:text-skyblue font-semibold text-base">
            Market Price
          </div>
        </div>
      </div>
    </div>
  )
}
