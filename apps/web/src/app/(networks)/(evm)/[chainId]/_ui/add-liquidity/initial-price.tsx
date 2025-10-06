import { Button } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { Amount, type Type, tryParseAmount } from 'sushi/currency'

export const InitialPrice = ({
  token0,
  token1,
  input0,
  input1,
}: {
  token0: Type
  token1: Type
  input0: string
  input1: string
}) => {
  const [rateDirection, setRateDirection] = useState<'token0' | 'token1'>(
    'token0',
  )

  const [token0Input, token1Input] = useMemo(() => {
    if (!token0 || !token1) {
      return [undefined, undefined]
    }

    return [
      tryParseAmount(input0, token0) || Amount.fromRawAmount(token0, 0),
      tryParseAmount(input1, token1) || Amount.fromRawAmount(token1, 0),
    ]
  }, [input0, input1, token0, token1])

  const [token1Per0, token0Per1] = useMemo(() => {
    if (
      !token0Input ||
      !token1Input ||
      token0Input?.equalTo(0) ||
      token1Input?.equalTo(0)
    ) {
      return [0, 0]
    }

    const token1Per0 = token1Input
      .divide(token0Input)
      .multiply(10n ** BigInt(token0.decimals))
      .toSignificant(6)

    const token0Per1 = token0Input
      .divide(token1Input)
      .multiply(10n ** BigInt(token1.decimals))
      .toSignificant(6)

    return [token1Per0, token0Per1]
  }, [token0Input, token1Input, token0, token1])

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
          <div className="flex gap-2 items-end">
            <div className="dark:text-pink-100 text-3xl text-black">
              {rateDirection === 'token0' ? token0Per1 : token1Per0}
            </div>
            <div className="text-sm text-slate-700 dark:text-pink-200">
              {rateDirection === 'token0'
                ? `${token0.symbol} per ${token1.symbol}`
                : `${token1?.symbol} per ${token0.symbol}`}
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
