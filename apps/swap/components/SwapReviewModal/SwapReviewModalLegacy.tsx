import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { SushiSwapRouter } from '@sushiswap/exchange'
import { Percent } from '@sushiswap/math'
import { Button, Dots } from '@sushiswap/ui'
import { isZero } from '@sushiswap/validate'
import {
  Approve,
  calculateGasMargin,
  getSushiSwapRouterContractConfig,
  getTridentRouterContractConfig,
  useBentoBoxTotal,
  useSushiSwapRouterContract,
  useTridentRouterContract,
} from '@sushiswap/wagmi'
import { approveMasterContractAction, batchAction, unwrapWETHAction } from 'lib/actions'
import { toHex } from 'lib/functions'
import { useTransactionDeadline } from 'lib/hooks'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { ProviderRpcError, useAccount, useProvider, UserRejectedRequestError, useSendTransaction } from 'wagmi'

import { useNotifications, useSettings } from '../../lib/state/storage'
import { useTrade } from '../TradeProvider'
import { SwapReviewModalBase } from './SwapReviewModalBase'

interface SwapReviewModalLegacy {
  chainId: ChainId
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

interface SwapCall {
  address: string
  calldata: string
  value: string
}

interface SwapCallEstimate {
  call: SwapCall
}

export interface SuccessfulCall extends SwapCallEstimate {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall extends SwapCallEstimate {
  call: SwapCall
  error: Error
}

export const SwapReviewModalLegacy: FC<SwapReviewModalLegacy> = ({ chainId, children }) => {
  const { trade } = useTrade()
  const { address: account } = useAccount()
  const provider = useProvider({ chainId })
  const [, { createNotification }] = useNotifications(account)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({
    chainId,
    onSuccess: () => setOpen(false),
  })
  const [signature, setSignature] = useState<Signature>()
  const sushiSwapRouter = useSushiSwapRouterContract(chainId)
  const tridentRouter = useTridentRouterContract(chainId)
  const deadline = useTransactionDeadline(chainId)

  const inputCurrencyRebase = useBentoBoxTotal(chainId, trade?.inputAmount.currency)
  const outputCurrencyRebase = useBentoBoxTotal(chainId, trade?.outputAmount.currency)

  const [{ slippageTolerance }] = useSettings()

  const allowedSlippage = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const execute = useCallback(async () => {
    try {
      if (!trade || !account || !inputCurrencyRebase || !outputCurrencyRebase) return

      let call: SwapCall | null = null
      let value = '0x0'

      if (trade.isV1()) {
        const swapCallParameters = SushiSwapRouter.swapCallParameters(trade, {
          feeOnTransfer: false,
          allowedSlippage,
          // TODO: custom recipient
          recipient: account,
          deadline: deadline.toNumber(),
        })

        const { methodName, args } = swapCallParameters

        value = swapCallParameters.value

        call = {
          address: sushiSwapRouter.address,
          calldata: sushiSwapRouter.interface.encodeFunctionData(methodName, args),
          value,
        }
      } else if (trade.isV2()) {
        const actions = [approveMasterContractAction({ router: tridentRouter, signature })]

        if (trade.isSinglePool()) {
          actions.push(
            tridentRouter.interface.encodeFunctionData('exactInputSingleWithNativeToken', [
              {
                tokenIn: trade.inputAmount.currency.isNative ? AddressZero : trade.inputAmount.currency.wrapped.address,
                amountIn: BigNumber.from(trade.inputAmount.toShare(inputCurrencyRebase).quotient.toString()),
                amountOutMinimum: BigNumber.from(
                  trade.minimumAmountOut(allowedSlippage).toShare(outputCurrencyRebase).quotient.toString()
                ),
                pool: trade.route.legs[0].poolAddress,
                data: defaultAbiCoder.encode(
                  ['address', 'address', 'bool'],
                  [trade.route.legs[0].tokenFrom.address, account, true]
                ),
              },
            ])
          )
        } else if (trade.isSingle()) {
          actions.push(
            tridentRouter.interface.encodeFunctionData('exactInputWithNativeToken', [
              {
                tokenIn: trade.inputAmount.currency.isNative ? AddressZero : trade.inputAmount.currency.wrapped.address,
                amountIn: BigNumber.from(trade.inputAmount.toShare(inputCurrencyRebase).quotient.toString()),
                amountOutMinimum: BigNumber.from(
                  trade.minimumAmountOut(allowedSlippage).toShare(outputCurrencyRebase).quotient.toString()
                ),
                path: trade.route.legs.map((leg, i) => {
                  const isLastLeg = i === trade.route.legs.length - 1
                  return {
                    pool: leg.poolAddress,
                    data: defaultAbiCoder.encode(
                      ['address', 'address', 'bool'],
                      [leg.tokenFrom.address, isLastLeg ? account : trade.route.legs[i + 1].poolAddress, isLastLeg]
                    ),
                  }
                }),
              },
            ])
          )
        } else if (trade.isComplex()) {
          // complex trade
        }

        if (trade.inputAmount.currency.isNative) {
          value = toHex(trade.inputAmount)
        }
        if (trade.outputAmount.currency.isNative) {
          // unwrap
          actions.push(
            unwrapWETHAction({
              chainId,
              router: tridentRouter,
              recipient: account,
              amountMinimum: trade?.minimumAmountOut(allowedSlippage).quotient.toString(),
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

      if (call) {
        const tx =
          !value || isZero(value)
            ? { from: account, to: call.address, data: call.calldata }
            : {
                from: account,
                to: call.address,
                data: call.calldata,
                value,
              }

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

        await sendTransactionAsync({
          chainId,
          request: {
            ...tx,
            ...('gasEstimate' in estimatedCall ? { gasLimit: calculateGasMargin(estimatedCall.gasEstimate) } : {}),
          },
        })
      }
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        setError((e as ProviderRpcError).message)
      }

      console.log(e)
    }
  }, [
    trade,
    account,
    inputCurrencyRebase,
    outputCurrencyRebase,
    allowedSlippage,
    deadline,
    sushiSwapRouter.address,
    sushiSwapRouter.interface,
    provider,
    sendTransactionAsync,
    chainId,
    tridentRouter,
    signature,
  ])

  const [input0, input1] = useMemo(
    () => [trade?.inputAmount, trade?.outputAmount],
    [trade?.inputAmount, trade?.outputAmount]
  )

  return (
    <>
      {children({ isWritePending, setOpen })}
      <SwapReviewModalBase
        chainId={chainId}
        input0={input0}
        input1={input1}
        open={open}
        setOpen={setOpen}
        error={error}
      >
        <Approve
          onSuccess={createNotification}
          className="flex-grow !justify-end"
          components={
            <Approve.Components>
              {trade && trade.isV2() ? (
                <Approve.Bentobox
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  address={getTridentRouterContractConfig(chainId).addressOrName}
                  onSignature={setSignature}
                />
              ) : (
                <></>
              )}
              <Approve.Token
                size="md"
                className="whitespace-nowrap"
                fullWidth
                amount={input0}
                address={getSushiSwapRouterContractConfig(chainId).addressOrName}
              />
            </Approve.Components>
          }
          render={({ approved }) => {
            return (
              <Button size="md" disabled={!approved || isWritePending} fullWidth onClick={execute}>
                {isWritePending ? <Dots>Confirm Swap</Dots> : 'Swap'}
              </Button>
            )
          }}
        />
      </SwapReviewModalBase>
    </>
  )
}
