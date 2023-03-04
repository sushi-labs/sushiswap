import { defaultAbiCoder } from '@ethersproject/abi'
import { isAddress } from '@ethersproject/address'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { AddressZero, Zero } from '@ethersproject/constants'
import { TransactionRequest } from '@ethersproject/providers'
import { SushiSwapRouter, Trade, TradeType, Version } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Amount, Currency, Native } from '@sushiswap/currency'
import { calculateGasMargin } from '@sushiswap/gas'
import { Percent } from '@sushiswap/math'
import { getBigNumber, RouteStatus } from '@sushiswap/tines'
import { isZero } from '@sushiswap/validate'
import { getTridentRouterContractConfig, useBentoBoxTotal, useSendTransaction } from '@sushiswap/wagmi'
import { Dispatch, FC, ReactElement, SetStateAction, useCallback, useMemo } from 'react'
import { useAccount, useProvider, UserRejectedRequestError } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { approveMasterContractAction, batchAction, unwrapWETHAction } from '../lib/actions'
import { useTransactionDeadline, useRouters } from '../lib/hooks'
import { useNotifications, useSettings } from '../lib/state/storage'
import { useTrade } from './TradeProvider'

interface SwapCall {
  address: string
  calldata: string
  value: string
}

const KLIMA_FEE = Amount.fromRawAmount(Native.onChain(ChainId.POLYGON), '20000000000000000')
const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

interface TradeExecuteProvider {
  signature?: Signature
  onSuccess?(data: SendTransactionResult): void
  chainId: number | undefined
  approved: boolean | undefined
  children({ execute, isWritePending }: { execute: (() => void) | undefined; isWritePending: boolean }): ReactElement
}

export const TradeExecuteProvider: FC<TradeExecuteProvider> = ({
  chainId,
  signature,
  onSuccess,
  approved,
  children,
}) => {
  const { address: account } = useAccount()
  const { trade } = useTrade()
  const provider = useProvider({ chainId })

  const [, { createNotification }] = useNotifications(account)
  const deadline = useTransactionDeadline(chainId, approved)
  const inputCurrencyRebase = useBentoBoxTotal(chainId, trade?.inputAmount.currency)
  const outputCurrencyRebase = useBentoBoxTotal(chainId, trade?.outputAmount.currency)
  const [sushiSwapRouter, tridentRouter, sushiSwapKlimaRouter] = useRouters(chainId)
  const [{ slippageTolerance, carbonOffset }] = useSettings()

  const allowedSlippage = useMemo(
    () => (slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : SWAP_DEFAULT_SLIPPAGE),
    [slippageTolerance]
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      console.log('Prepare function called wtih setRequest', setRequest)

      // console.log({
      //   trade,
      //   account,
      //   chainId,
      //   deadline,
      //   approved,
      //   sushiSwapRouter,
      //   isV1: trade?.isV1(),
      //   isV2: trade?.isV2(),
      //   isComplex: trade?.isComplex(),
      //   isSingle: trade?.isSingle(),
      //   isNotFound: trade?.isNotFound(),
      // })
      if (!trade || !account || !chainId || !deadline || !approved) return
      try {
        let call: SwapCall | null = null
        let value = '0x0'

        if (trade.isV1()) {
          if (!sushiSwapRouter || !deadline) return
          const swapCallParameters = SushiSwapRouter.swapCallParameters(
            trade as Trade<Currency, Currency, TradeType, Version.V1>,
            {
              feeOnTransfer: false,
              allowedSlippage,
              // TODO: custom recipient
              recipient: account,
              deadline: deadline.toNumber(),
            }
          )

          const { methodName, args } = swapCallParameters

          const shouldCarbonOffset = chainId === ChainId.POLYGON && carbonOffset

          if (trade.inputAmount.currency.isNative) {
            value = shouldCarbonOffset ? trade.inputAmount.add(KLIMA_FEE).toHex() : trade.inputAmount.toHex()
          } else if (shouldCarbonOffset) {
            value = KLIMA_FEE.toHex()
          }

          call = {
            address:
              shouldCarbonOffset && sushiSwapKlimaRouter ? sushiSwapKlimaRouter.address : sushiSwapRouter.address,
            calldata: sushiSwapRouter.interface.encodeFunctionData(methodName, args),
            value,
          }
        } else if (tridentRouter && trade.isV2()) {
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
                    trade.minimumAmountOut(allowedSlippage).toShare(outputCurrencyRebase).quotient.toString()
                  ),
                  pool: trade.route.legs[0].poolAddress,
                  data: defaultAbiCoder.encode(
                    ['address', 'address', 'bool'],
                    [
                      trade.route.legs[0].tokenFrom.address,
                      trade.outputAmount.currency.isNative ? tridentRouter.address : account,
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
                    trade.minimumAmountOut(allowedSlippage).toShare(outputCurrencyRebase).quotient.toString()
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
                              ? tridentRouter.address
                              : account
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
                    to: trade.outputAmount.currency.isNative ? tridentRouter.address : account,
                    unwrapBento: true,
                    minAmount: trade
                      ?.minimumAmountOut(allowedSlippage)
                      ?.toShare(outputCurrencyRebase)
                      .quotient.toString(),
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
                recipient: account,
              })
            )
          }

          call = {
            address: tridentRouter.address,
            calldata: batchAction({
              contract: tridentRouter,
              actions,
            }),
            value,
          }
        }

        if (!call) {
          console.log('No call...')
        }

        if (call) {
          if (!isAddress(call.address)) new Error('call address has to be an address')
          if (call.address === AddressZero) new Error('call address cannot be zero')

          const tx =
            !value || isZero(value)
              ? { from: account, to: call.address, data: call.calldata }
              : {
                  from: account,
                  to: call.address,
                  data: call.calldata,
                  value,
                }

          console.log({ call, tx })

          const estimatedCall = await provider
            .estimateGas(tx)
            .then((gasEstimate) => {
              return {
                call,
                gasEstimate,
              }
            })
            .catch((gasError) => {
              console.debug('Gas estimate failed, trying eth_call to extract error', call)

              return provider
                .call(tx)
                .then((result) => {
                  console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                  return {
                    call,
                    error: new Error('Unexpected issue with estimating the gas. Please try again.'),
                  }
                })
                .catch((callError) => {
                  console.debug('Call threw error', call, callError)
                  return {
                    call,
                    error: new Error(callError),
                    // error: new Error(swapErrorToUserReadableMessage(callError)),
                  }
                })
            })

          console.log('About to actually setRequest with...', {
            ...tx,
            ...('gasEstimate' in estimatedCall ? { gasLimit: calculateGasMargin(estimatedCall.gasEstimate) } : {}),
          })

          setRequest({
            ...tx,
            ...('gasEstimate' in estimatedCall ? { gasLimit: calculateGasMargin(estimatedCall.gasEstimate) } : {}),
          })
        }
      } catch (e: unknown) {
        if (e instanceof UserRejectedRequestError) return
        console.error(e)
      }
    },
    [
      account,
      allowedSlippage,
      approved,
      carbonOffset,
      chainId,
      deadline,
      inputCurrencyRebase,
      outputCurrencyRebase,
      provider,
      signature,
      sushiSwapKlimaRouter,
      sushiSwapRouter,
      trade,
      tridentRouter,
    ]
  )

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!trade || !chainId || !data) return

      const ts = new Date().getTime()
      // data: SendTransactionResult | undefined, error: Error | null

      createNotification({
        type: 'swap',
        chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Swapping ${trade.inputAmount.toSignificant(6)} ${
            trade.inputAmount.currency.symbol
          } for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol}`,
          completed: `Successfully swapped ${trade.inputAmount.toSignificant(6)} ${
            trade.inputAmount.currency.symbol
          } for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol}`,
          failed: `Something went wrong when trying to swap ${trade.inputAmount.currency.symbol} for ${trade.outputAmount.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, trade]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    onSettled,
    prepare,
    enabled:
      trade && (trade.route.status === RouteStatus.Success || trade.route.status === RouteStatus.Partial) && approved,
    onSuccess,
  })

  console.log({
    sendTransaction,
    enabled:
      trade && (trade.route.status === RouteStatus.Success || trade.route.status === RouteStatus.Partial) && approved,
  })

  return children({ execute: sendTransaction, isWritePending })
}
