import { getClientTrade } from '../actions'
import { useQuery } from '@tanstack/react-query'
import { usePools } from '../../pools'
import { useFeeData, useProvider } from 'wagmi'
import { ChainId } from '@sushiswap/chain'
import { Amount, Currency, Native, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { SushiSwapRouter, Trade, TradeType, Version } from '@sushiswap/amm'
import { usePrice, UseTradeParams } from '@sushiswap/react-query'
import { Percent } from '@sushiswap/math'
import { useTransactionDeadline } from '../../utils'
import { BigNumber, BigNumberish, Contract } from 'ethers'
import { getBigNumber } from '@sushiswap/tines'
import {
  getSushiSwapKlimaRouterContractConfig,
  getSushiSwapRouterContractConfig,
  getTridentRouterContractConfig,
} from '../../../../hooks'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { AddressZero, Zero } from '@ethersproject/constants'
import { getContract } from 'wagmi/actions'
import { isUniswapV2Router02ChainId } from '@sushiswap/sushiswap'
import { isTridentRouterChainId } from '@sushiswap/trident'
import { useBentoboxTotals } from '../../bentobox'
import { approveMasterContractAction, batchAction, unwrapWETHAction } from '../actions/contractActions'
import { Signature } from '@ethersproject/bytes'

const KLIMA_FEE = Amount.fromRawAmount(Native.onChain(ChainId.POLYGON), '20000000000000000')

interface UseClientTrade extends UseTradeParams {
  signature: Signature | undefined
}

export const useClientTrade = (variables: UseClientTrade) => {
  const { chainId, fromToken, toToken, slippagePercentage, carbonOffset, amount, enabled, recipient, signature } =
    variables

  const { data: pools } = usePools({ chainId, currencyA: fromToken, currencyB: toToken, enabled })
  const { data: feeData } = useFeeData({ chainId, enabled })
  const { data: price } = usePrice({ chainId, address: WNATIVE_ADDRESS[chainId] })
  const { data: deadline } = useTransactionDeadline({ chainId, enabled })
  const { data: rebases } = useBentoboxTotals({ chainId, currencies: [fromToken, toToken], enabled })

  return useQuery({
    queryKey: [
      'useClientTrade',
      {
        chainId,
        currencyA: fromToken,
        currencyB: toToken,
        amount,
        slippagePercentage,
        recipient,
        pools,
      },
    ],
    queryFn: async () => {
      const isOffset = chainId === ChainId.POLYGON && carbonOffset
      const slippage = new Percent(Math.floor(+slippagePercentage * 100), 10_000)
      const trade = await getClientTrade({
        chainId,
        amount,
        fromToken,
        toToken,
        tradeType: TradeType.EXACT_INPUT,
        pools,
        feeData,
        rebases,
      })

      let contract
      let writeArgs
      let functionName = ''
      let value = ''
      let sushiSwapRouter: Contract | undefined = undefined
      let tridentRouter: Contract | undefined = undefined
      let klimaRouter: Contract | undefined = undefined

      if (isUniswapV2Router02ChainId(chainId)) sushiSwapRouter = getContract(getSushiSwapRouterContractConfig(chainId))
      if (isTridentRouterChainId(chainId)) tridentRouter = getContract(getTridentRouterContractConfig(chainId))
      if (isOffset) klimaRouter = getContract(getSushiSwapKlimaRouterContractConfig(chainId))

      // REPLACE WITH RP CODE
      if (trade && recipient) {
        if (trade.isV1() && sushiSwapRouter) {
          if (!deadline) return

          const { methodName, args } = SushiSwapRouter.swapCallParameters(
            trade as Trade<Currency, Currency, TradeType, Version.V1>,
            {
              feeOnTransfer: false,
              allowedSlippage: slippage,
              recipient,
              deadline: deadline.toNumber(),
            }
          )

          if (trade.inputAmount.currency.isNative) {
            value = isOffset ? trade.inputAmount.add(KLIMA_FEE).toHex() : trade.inputAmount.toHex()
          } else if (isOffset) {
            value = KLIMA_FEE.toHex()
          }

          contract = isOffset && klimaRouter ? klimaRouter : sushiSwapRouter
          functionName = methodName
          writeArgs = args
        } else if (tridentRouter && trade.isV2()) {
          const [inputCurrencyRebase, outputCurrencyRebase] = rebases || [undefined, undefined]
          if (!tridentRouter || !inputCurrencyRebase || !outputCurrencyRebase) return

          const actions = [approveMasterContractAction({ router: tridentRouter, signature })]

          if (trade.isSinglePool()) {
            actions.push(
              tridentRouter.interface.encodeFunctionData('exactInputSingleWithNativeToken', [
                {
                  tokenIn: trade.inputAmount.currency.isNative
                    ? AddressZero
                    : trade.inputAmount.currency.wrapped.address,
                  amountIn: BigNumber.from(trade.inputAmount.quotient.toString()),
                  amountOutMinimum: BigNumber.from(
                    trade.minimumAmountOut(slippage).toShare(outputCurrencyRebase).quotient.toString()
                  ),
                  pool: trade.route.legs[0].poolAddress,
                  data: defaultAbiCoder.encode(
                    ['address', 'address', 'bool'],
                    [
                      trade.route.legs[0].tokenFrom.address,
                      trade.outputAmount.currency.isNative ? tridentRouter.address : recipient,
                      true,
                    ]
                  ),
                },
              ])
            )
          } else if (trade.isSingle()) {
            actions.push(
              tridentRouter.interface.encodeFunctionData('exactInputWithNativeToken', [
                {
                  tokenIn: trade.inputAmount.currency.isNative
                    ? AddressZero
                    : trade.inputAmount.currency.wrapped.address,
                  amountIn: BigNumber.from(trade.inputAmount.quotient.toString()),
                  amountOutMinimum: BigNumber.from(
                    trade.minimumAmountOut(slippage).toShare(outputCurrencyRebase).quotient.toString()
                  ),
                  path: trade.route.legs.map((leg, i) => {
                    const isLastLeg = i === trade.route.legs.length - 1
                    return {
                      pool: leg.poolAddress,
                      data: defaultAbiCoder.encode(
                        ['address', 'address', 'bool'],
                        [
                          leg.tokenFrom.address,
                          isLastLeg
                            ? trade.outputAmount.currency.isNative
                              ? tridentRouter?.address
                              : recipient
                            : trade.route.legs[i + 1].poolAddress,
                          isLastLeg,
                        ]
                      ),
                    }
                  }),
                },
              ])
            )
          } else if (trade.isComplex()) {
            // complex trade
            const initialPathCount = trade.route.legs.filter(
              (leg) => leg.tokenFrom.address === trade.inputAmount.currency.wrapped.address
            ).length

            const [initialPath, percentagePath, output] = trade.route.legs.reduce<
              [
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
            >(
              ([initialPath, percentagePath, output], leg, i) => {
                const isInitialPath = leg.tokenFrom.address === trade.inputAmount.currency.wrapped.address
                if (isInitialPath) {
                  return [
                    [
                      ...initialPath,
                      {
                        tokenIn: trade.inputAmount.currency.isNative ? AddressZero : leg.tokenFrom.address,
                        pool: leg.poolAddress,
                        amount:
                          initialPathCount > 1 && i === initialPathCount - 1
                            ? BigNumber.from(trade.inputAmount.quotient.toString()).sub(
                                initialPath.reduce(
                                  (previousValue, currentValue) => previousValue.add(currentValue.amount),
                                  Zero
                                )
                              )
                            : BigNumber.from(trade.inputAmount.quotient.toString())
                                .mul(Math.round(leg.absolutePortion * 1e6))
                                .div(1e6),
                        native: true,
                        data: defaultAbiCoder.encode(
                          ['address', 'address', 'bool'],
                          [
                            leg.tokenFrom.address,
                            getTridentRouterContractConfig(trade.inputAmount.currency.chainId).address,
                            false,
                          ]
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
                          [
                            leg.tokenFrom.address,
                            getTridentRouterContractConfig(trade.inputAmount.currency.chainId).address,
                            false,
                          ]
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
                    to: trade.outputAmount.currency.isNative ? tridentRouter.address : recipient,
                    unwrapBento: true,
                    minAmount: trade?.minimumAmountOut(slippage)?.toShare(outputCurrencyRebase).quotient.toString(),
                  },
                ],
              ]
            )
            actions.push(
              tridentRouter.interface.encodeFunctionData('complexPath', [{ initialPath, percentagePath, output }])
            )
          }

          if (trade.inputAmount.currency.isNative) {
            value = trade.inputAmount.toHex()
          }
          if (trade.outputAmount.currency.isNative) {
            // unwrap
            actions.push(
              unwrapWETHAction({
                router: tridentRouter,
                recipient: recipient,
              })
            )
          }

          contract = tridentRouter
          functionName = 'multicall'
          writeArgs = batchAction({
            contract: tridentRouter,
            actions,
            encode: false,
          })
        }

        if (functionName && writeArgs && contract) {
          return {
            address: contract.address,
            abi: contract.interface,
            swapPrice: trade.executionPrice,
            priceImpact: trade.priceImpact,
            amountIn: trade.inputAmount,
            amountOut: trade.outputAmount,
            minAmountOut: trade.minimumAmountOut(slippage),
            gasSpent: price
              ? Amount.fromRawAmount(Native.onChain(chainId), trade.route.gasSpent * 1e9)
                  .multiply(price.asFraction)
                  .toSignificant(4)
              : undefined,
            route: trade.route,
            functionName,
            writeArgs,
            overrides: { value },
          }
        }
      }

      return {
        abi: undefined,
        address: undefined,
        swapPrice: undefined,
        priceImpact: undefined,
        amountIn: undefined,
        amountOut: undefined,
        minAmountOut: undefined,
        gasSpent: undefined,
        writeArgs: undefined,
        route: undefined,
        functionName: 'processRoute',
        overrides: undefined,
      }
    },
    refetchInterval: 10000,
    enabled,
  })
}
