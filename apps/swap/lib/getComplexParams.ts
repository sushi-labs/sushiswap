import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { Currency } from '@sushiswap/currency'
import { TradeType, TradeV1, TradeV2 } from '@sushiswap/exchange'
import { Percent } from '@sushiswap/math'
import { SUSHI_X_SWAP_ADDRESS } from 'config'

export type Complex = [
  {
    tokenIn: string
    pool: string
    native: boolean
    amount: BigNumberish
    data: string
  }[],
  {
    tokenIn: string
    pool: string
    balancePercentage: BigNumberish
    data: string
  }[],
  {
    token: string
    to: string
    unwrapBento: boolean
    minAmount: BigNumberish
  }[]
]

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // .50%

export function getBigNumber(value: number): BigNumber {
  const v = Math.abs(value)
  if (v < Number.MAX_SAFE_INTEGER) return BigNumber.from(Math.round(value))

  const exp = Math.floor(Math.log(v) / Math.LN2)
  console.assert(exp >= 51, 'Internal Error 314')
  const shift = exp - 51
  const mant = Math.round(v / Math.pow(2, shift))
  const res = BigNumber.from(mant).mul(BigNumber.from(2).pow(shift))
  return value > 0 ? res : res.mul(-1)
}

export const isTradeV1 = (
  trade:
    | TradeV1<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
    | TradeV2<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
) => trade instanceof TradeV1

export const isTradeV2 = (
  trade:
    | TradeV1<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
    | TradeV2<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
) => trade instanceof TradeV2

export const isExactInput = (trade: TradeV2<Currency, Currency, TradeType.EXACT_INPUT>) =>
  new Set(trade.route.legs.map((leg) => leg.tokenFrom.address)).size === trade.route.legs.length

export const isComplex = (trade: TradeV2<Currency, Currency, TradeType.EXACT_INPUT>) =>
  new Set(trade.route.legs.map((leg) => leg.tokenFrom.address)).size !== trade.route.legs.length

export const getComplexParams = (
  trade: TradeV2<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>,
  user: string,
  useBentoBox = false
) => {
  const initialPathCount = trade.route.legs.filter(
    (leg) => leg.tokenFrom.address === trade.inputAmount.currency.wrapped.address
  ).length
  return trade.route.legs.reduce<Complex>(
    ([initialPath, percentagePath, output], leg, i) => {
      const isInitialPath = leg.tokenFrom.address === trade.inputAmount.currency.wrapped.address
      if (isInitialPath) {
        return [
          [
            ...initialPath,
            {
              tokenIn: leg.tokenFrom.address,
              pool: leg.poolAddress,
              amount:
                initialPathCount > 1 && i === initialPathCount - 1
                  ? getBigNumber(trade.route.amountIn).sub(
                      initialPath.reduce((previousValue, currentValue) => previousValue.add(currentValue.amount), Zero)
                    )
                  : getBigNumber(trade.route.amountIn * leg.absolutePortion),
              native: false,
              data: defaultAbiCoder.encode(
                ['address', 'address', 'bool'],
                [leg.tokenFrom.address, SUSHI_X_SWAP_ADDRESS[trade.inputAmount.currency.chainId], false]
              ),
            },
          ],
          percentagePath,
          output,
        ]
      } else {
        return [
          initialPath,
          [
            ...percentagePath,
            {
              tokenIn: leg.tokenFrom.address,
              pool: leg.poolAddress,
              balancePercentage: getBigNumber(leg.swapPortion * 10 ** 8),
              data: defaultAbiCoder.encode(
                ['address', 'address', 'bool'],
                [leg.tokenFrom.address, SUSHI_X_SWAP_ADDRESS[trade.inputAmount.currency.chainId], false]
              ),
            },
          ],
          output,
        ]
      }
    },
    [
      [],
      [],
      [
        {
          token: trade.outputAmount.currency.wrapped.address,
          to:
            trade.outputAmount.currency.isNative && !useBentoBox
              ? SUSHI_X_SWAP_ADDRESS[trade.outputAmount.currency.chainId]
              : user,
          unwrapBento: !useBentoBox,
          minAmount: trade.minimumAmountOut(SWAP_DEFAULT_SLIPPAGE).quotient.toString(),
        },
      ],
    ]
  )
}
