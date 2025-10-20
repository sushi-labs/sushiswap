import { SkeletonText, Toggle } from '@sushiswap/ui'
import { type Dispatch, type SetStateAction, useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { Amount, type Price } from 'sushi'
import type { EvmCurrency, EvmToken } from 'sushi/evm'

export const CurrentPrice = ({
  token0,
  token1,
  invert,
  setInvert,
  token0Price,
  token1Price,
  isLoading,
}: {
  token0: EvmCurrency
  token1: EvmCurrency
  invert: boolean
  setInvert: Dispatch<SetStateAction<boolean>>
  token0Price: Price<EvmToken, EvmToken> | undefined
  token1Price: Price<EvmToken, EvmToken> | undefined
  isLoading: boolean
}) => {
  const [_token0, _token1] = invert ? [token1, token0] : [token0, token1]

  const fiatAmounts = useMemo(
    () => [Amount.tryFromHuman(token0, '1'), Amount.tryFromHuman(token1, '1')],
    [token0, token1],
  )

  const fiatAmountsAsNumber = useTokenAmountDollarValues({
    chainId: _token0.chainId,
    amounts: fiatAmounts,
  })

  return (
    <div className="flex-col flex md:flex-row justify-center items-center md:justify-between gap-2 w-full">
      <div className="flex whitespace-nowrap font-medium text-sm">
        <div>Current Price </div>
        {isLoading || !token0 || !token1 ? (
          <SkeletonText fontSize="xs" />
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="flex items-baseline gap-1.5">
              : 1 {_token0.symbol} ={' '}
              {invert
                ? token1Price?.toSignificant(6)
                : token0Price?.toSignificant(6)}{' '}
              {_token1.symbol}
              <span>(${fiatAmountsAsNumber[invert ? 1 : 0].toFixed(2)})</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-1">
        <Toggle
          variant="outline"
          onPressedChange={() => setInvert((prev) => !prev)}
          pressed={invert}
          size="xs"
          className="w-fit"
        >
          {invert ? _token0?.symbol : _token1?.symbol}
        </Toggle>
        <Toggle
          variant="outline"
          onPressedChange={() => setInvert((prev) => !prev)}
          pressed={!invert}
          size="xs"
          className="w-fit"
        >
          {invert ? _token1?.symbol : _token0?.symbol}
        </Toggle>
      </div>
    </div>
  )
}
