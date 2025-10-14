import { Button } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { Amount, Fraction, ZERO } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'

export const InitialPrice = ({
  token0,
  token1,
  input0,
  input1,
  setMarketPrice,
}: {
  token0: EvmCurrency
  token1: EvmCurrency
  input0: string
  input1: string
  setMarketPrice: () => void
}) => {
  const [rateDirection, setRateDirection] = useState<'token0' | 'token1'>(
    'token0',
  )

  const [token0Input, token1Input] = useMemo(() => {
    if (!token0 || !token1) {
      return [undefined, undefined]
    }

    return [
      Amount.tryFromHuman(token0, input0) || Amount.tryFromHuman(token0, '0'),
      Amount.tryFromHuman(token1, input1) || Amount.tryFromHuman(token1, '0'),
    ]
  }, [input0, input1, token0, token1])

  const [token1Per0, token0Per1] = useMemo(() => {
    if (
      !token0Input ||
      !token1Input ||
      token0Input?.eq(ZERO) ||
      token1Input?.eq(ZERO)
    ) {
      return [0, 0]
    }
    const token0Human = token0Input.toString()
    const token1Human = token1Input.toString()

    const token1Per0 = Amount.tryFromHuman(
      token1,
      Number.parseFloat(token1Human) / Number.parseFloat(token0Human),
    )?.toSignificant(6)

    const token0Per1 = Amount.tryFromHuman(
      token0,
      Number.parseFloat(token0Human) / Number.parseFloat(token1Human),
    )?.toSignificant(6)

    return [token1Per0, token0Per1]
  }, [token0Input, token1Input, token0, token1])

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
            <div className="dark:text-pink-100 text-3xl text-black">
              {rateDirection === 'token0' ? token0Per1 : token1Per0}
            </div>
            <div className="text-sm text-slate-700 dark:text-pink-200">
              {rateDirection === 'token0'
                ? `${token0.symbol} per ${token1.symbol}`
                : `${token1?.symbol} per ${token0.symbol}`}
            </div>
          </div>
          <Button
            onClick={setMarketPrice}
            variant="ghost"
            className="text-blue dark:text-skyblue font-semibold !text-base !pr-0 focus:!bg-transparent hover:!bg-transparent !h-[25px] !min-h-[25px]"
          >
            Market Price
          </Button>
        </div>
      </div>
    </div>
  )
}
