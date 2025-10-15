import { Button, TextField } from '@sushiswap/ui'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useMarketPrice } from 'src/lib/hooks/react-query/liquidity/use-market-price'
import { Amount, ZERO, withoutScientificNotation } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'

export const InitialPrice = ({
  token0,
  token1,
  initialPrice,
  setInitialPrice,
}: {
  token0: EvmCurrency
  token1: EvmCurrency
  initialPrice: {
    token0Per1: string | undefined
    token1Per0: string | undefined
  }
  setInitialPrice: ({
    token0Per1,
    token1Per0,
  }: {
    token0Per1: string | undefined
    token1Per0: string | undefined
  }) => void
}) => {
  const [rateDirection, setRateDirection] = useState<'token0' | 'token1'>(
    'token0',
  )
  const { data: marketPrice } = useMarketPrice({
    token0,
    token1,
    enabled: Boolean(token0 && token1),
  })
  const spanRef = useRef<HTMLSpanElement>(null)
  const [inputWidth, setInputWidth] = useState(1)

  // biome-ignore lint/correctness/useExhaustiveDependencies: startingPrice not referenced but isneeded to re-calculate width
  useLayoutEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth
      setInputWidth(width + 28)
    }
  }, [initialPrice])

  const isUsingMarketPrice = useMemo(() => {
    if (
      initialPrice?.token0Per1 === marketPrice?.token0Per1 &&
      initialPrice?.token1Per0 === marketPrice?.token1Per0
    ) {
      return true
    }
    return false
  }, [initialPrice, marketPrice])

  const handleMarketPrice = useCallback(() => {
    setInitialPrice({
      token0Per1: marketPrice?.token0Per1,
      token1Per0: marketPrice?.token1Per0,
    })
  }, [marketPrice, setInitialPrice])

  useEffect(() => {
    if (
      !initialPrice?.token0Per1 &&
      !initialPrice?.token1Per0 &&
      marketPrice?.token0Per1 &&
      marketPrice?.token1Per0
    ) {
      handleMarketPrice()
    }
  }, [initialPrice, marketPrice, handleMarketPrice])

  const handleInitialPrice = (value: string) => {
    if (rateDirection === 'token1') {
      const token1Per0 = Amount.tryFromHuman(token1, value)?.toSignificant(6)
      const token0Per1 = token1Per0
        ? Amount.tryFromHuman(
            token0,
            withoutScientificNotation(
              (1 / Number.parseFloat(token1Per0)).toString(),
            ) ?? '0',
          )?.toSignificant(6)
        : undefined
      setInitialPrice({ token0Per1, token1Per0 })
    } else {
      const token0Per1 = Amount.tryFromHuman(token0, value)?.toSignificant(6)
      const token1Per0 = token0Per1
        ? Amount.tryFromHuman(
            token1,
            withoutScientificNotation(
              (1 / Number.parseFloat(token0Per1)).toString(),
            ) ?? '0',
          )?.toSignificant(6)
        : undefined
      setInitialPrice({ token0Per1, token1Per0 })
    }
  }

  const value = useMemo(() => {
    return rateDirection === 'token0'
      ? initialPrice?.token0Per1
      : initialPrice?.token1Per0
  }, [initialPrice, rateDirection])

  return (
    <div className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-[#00000014] dark:border-[#FFFFFF14]">
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
              {token0.symbol}
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
              {token1.symbol}
            </Button>
          </div>
        </div>
        <div className="flex md:items-end justify-between flex-col md:flex-row gap-2">
          <div className="flex gap-2 items-end cursor-default">
            {/* <div className="dark:text-pink-100 text-3xl text-black">
							{rateDirection === "token0" ? initialPrice?.token0Per1 : initialPrice?.token1Per0}
						</div> */}
            <div className="relative inline-block">
              <TextField
                type="number"
                value={value || '0'}
                onValueChange={(value) => handleInitialPrice(value)}
                placeholder="0"
                style={{ width: `${inputWidth + 28}px` }}
                className="absolute top-0 left-0 !px-0 dark:text-pink-100 text-3xl text-black !bg-transparent dark:!bg-transparent"
              />
              <span
                ref={spanRef}
                className="invisible whitespace-pre text-3xl font-normal"
              >
                {value || '0'}
              </span>
            </div>
            <div className="text-sm text-slate-700 dark:text-pink-200 ">
              {rateDirection === 'token0'
                ? `${token0.symbol} per ${token1.symbol}`
                : `${token1?.symbol} per ${token0.symbol}`}
            </div>
          </div>
          <Button
            onClick={handleMarketPrice}
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
