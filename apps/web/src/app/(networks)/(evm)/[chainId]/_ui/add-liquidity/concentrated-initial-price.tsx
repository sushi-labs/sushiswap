import { Button, TextField } from '@sushiswap/ui'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useMarketPrice } from 'src/lib/hooks/react-query/liquidity/use-market-price'
import { Amount } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'

export const ConcentratedInitialPrice = ({
  token0,
  token1,
  startingPrice,
  onStartPriceInput,
}: {
  token0: EvmCurrency
  token1: EvmCurrency
  startingPrice: string
  onStartPriceInput: (value: string) => void
}) => {
  const spanRef = useRef<HTMLSpanElement>(null)
  const [inputWidth, setInputWidth] = useState(1)

  // biome-ignore lint/correctness/useExhaustiveDependencies: startingPrice not referenced but isneeded to re-calculate width
  useLayoutEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth
      setInputWidth(width + 28)
    }
  }, [startingPrice])

  const [rateDirection, setRateDirection] = useState<'token0' | 'token1'>(
    'token0',
  )
  const { data: marketPrice } = useMarketPrice({
    token0,
    token1,
    enabled: Boolean(token0 && token1),
  })

  const handleMarketPrice = useCallback(
    (_rateDirection: 'token0' | 'token1') => {
      if (_rateDirection === 'token0') {
        const amount = Amount.tryFromHuman(
          token0,
          marketPrice?.token0Per1 ?? '0',
        )
        onStartPriceInput(amount?.toString() ?? '0')
      } else {
        const amount = Amount.tryFromHuman(
          token1,
          marketPrice?.token1Per0 ?? '0',
        )
        onStartPriceInput(amount?.toString() ?? '0')
      }
    },
    [marketPrice, onStartPriceInput, token0, token1],
  )

  const isUsingMarketPrice = useMemo(() => {
    if (
      startingPrice ===
      (rateDirection === 'token0'
        ? marketPrice?.token0Per1
        : marketPrice?.token1Per0)
    ) {
      return true
    }
    return false
  }, [startingPrice, marketPrice, rateDirection])

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
              onClick={() => {
                setRateDirection('token0')
                handleMarketPrice('token0')
              }}
              className={
                rateDirection === 'token0'
                  ? '!bg-[#00000014] dark:!bg-[#ffffff14]'
                  : ''
              }
            >
              {token0?.symbol}
            </Button>
            <Button
              onClick={() => {
                setRateDirection('token1')
                handleMarketPrice('token1')
              }}
              variant="outline"
              size="xs"
              className={
                rateDirection === 'token1'
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
            <div className="text-sm text-slate-700 dark:text-pink-200 pl-[19px] whitespace-nowrap">
              {`${rateDirection === 'token0' ? token0?.symbol : token1?.symbol} per ${
                rateDirection === 'token0' ? token1?.symbol : token0?.symbol
              }`}
            </div>
          </div>
          <Button
            onClick={() => handleMarketPrice(rateDirection)}
            variant="ghost"
            disabled={
              !marketPrice?.token0Per1 ||
              !marketPrice?.token1Per0 ||
              isUsingMarketPrice
            }
            className="text-blue dark:text-skyblue font-semibold !text-base !pr-0 focus:!bg-transparent hover:!bg-transparent !h-[25px] !min-h-[25px]"
          >
            Market Price
          </Button>
        </div>
      </div>
    </div>
  )
}
