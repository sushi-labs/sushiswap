import Common, { Hardfork } from '@ethereumjs/common'
import { TransactionFactory } from '@ethereumjs/tx'
import { defaultAbiCoder } from '@ethersproject/abi'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { arrayify, DataOptions, hexlify, Signature, SignatureLike, splitSignature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import {
  ChainId,
  Currency,
  CurrencyAmount,
  Percent,
  Router as LegacyRouter,
  SwapParameters,
  toHex,
  Trade as LegacyTrade,
  TradeType,
} from '@sushiswap/core-sdk'
import {
  ComplexPathParams,
  ExactInputParams,
  ExactInputSingleParams,
  getBigNumber,
  InitialPath,
  MultiRoute,
  Output,
  Path,
  PercentagePath,
  RouteType,
  Trade as TridentTrade,
} from '@sushiswap/trident-sdk'
import { EIP_1559_ACTIVATION_BLOCK } from 'app/constants'
import { Feature } from 'app/enums'
import { approveMasterContractAction, batchAction, unwrapWETHAction } from 'app/features/trident/actions'
import { featureEnabled } from 'app/functions'
import approveAmountCalldata from 'app/functions/approveAmountCalldata'
import { shortenAddress } from 'app/functions/format'
import { calculateGasMargin } from 'app/functions/trade'
import { isAddress, isZero } from 'app/functions/validate'
import { useBentoRebase } from 'app/hooks/useBentoRebases'
import useBlockNumber from 'app/lib/hooks/useBlockNumber'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { useAppDispatch } from 'app/state/hooks'
import { setSushiRelayChallenge } from 'app/state/swap/actions'
import { useSwapState } from 'app/state/swap/hooks'
import { TransactionResponseLight, useTransactionAdder } from 'app/state/transactions/hooks'
import { useExpertModeManager } from 'app/state/user/hooks'
import { fetchJsonRpc } from 'lib/jsonrpc'
import { useMemo } from 'react'

import { SUSHIGUARD_RELAY } from '../config/sushiguard'
import { useArgentWalletContract } from './useArgentWalletContract'
import { useRouterContract, useTridentRouterContract } from './useContract'
import useENS from './useENS'
import { SignatureData } from './useERC20Permit'
import useTransactionDeadline from './useTransactionDeadline'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
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

interface TridentTradeContext {
  fromWallet: boolean
  receiveToWallet: boolean
  bentoPermit?: Signature
  resetBentoPermit?: () => void
  parsedAmounts?: (CurrencyAmount<Currency> | undefined)[]
}

export type EstimatedSwapCall = SuccessfulCall | FailedCall

export function getTridentRouterParams(
  multiRoute: MultiRoute,
  senderAddress: string,
  tridentRouterAddress: string = '',
  slippagePercentage: number = 0.5,
  inputAmount: CurrencyAmount<Currency>,
  fromWallet: boolean = true,
  receiveToWallet: boolean = true
): ExactInputParams | ExactInputSingleParams | ComplexPathParams {
  const routeType = getRouteType(multiRoute)
  let routerParams

  const slippage = 1 - slippagePercentage / 100

  switch (routeType) {
    case RouteType.SinglePool:
      routerParams = getExactInputSingleParams(
        multiRoute,
        senderAddress,
        slippage,
        inputAmount,
        fromWallet,
        receiveToWallet
      )
      break

    case RouteType.SinglePath:
      routerParams = getExactInputParams(multiRoute, senderAddress, slippage, inputAmount, fromWallet, receiveToWallet)
      break

    case RouteType.ComplexPath:
    default:
      routerParams = getComplexPathParams(
        multiRoute,
        senderAddress,
        tridentRouterAddress,
        slippage,
        inputAmount,
        fromWallet,
        receiveToWallet
      )
      break
  }

  return routerParams
}

function getExactInputSingleParams(
  multiRoute: MultiRoute,
  senderAddress: string,
  slippage: number,
  inputAmount: CurrencyAmount<Currency>,
  fromWallet: boolean = true,
  receiveToWallet: boolean = true
): ExactInputSingleParams {
  return {
    amountIn: fromWallet
      ? inputAmount.quotient.toString().toBigNumber(0)
      : getBigNumber(multiRoute.amountIn * multiRoute.legs[0].absolutePortion),
    amountOutMinimum: getBigNumber(multiRoute.amountOut * slippage),
    tokenIn: inputAmount.currency.isNative && fromWallet ? AddressZero : multiRoute.legs[0].tokenFrom.address,
    pool: multiRoute.legs[0].poolAddress,
    data: defaultAbiCoder.encode(
      ['address', 'address', 'bool'],
      [multiRoute.legs[0].tokenFrom.address, senderAddress, receiveToWallet]
    ),
    routeType: RouteType.SinglePool,
  }
}

function getExactInputParams(
  multiRoute: MultiRoute,
  senderAddress: string,
  slippage: number,
  inputAmount: CurrencyAmount<Currency>,
  fromWallet: boolean = true,
  receiveToWallet: boolean = true
): ExactInputParams {
  const routeLegs = multiRoute.legs.length

  let paths: Path[] = []

  for (let legIndex = 0; legIndex < routeLegs; ++legIndex) {
    const lastLeg = isLastLeg(legIndex, multiRoute)
    const recipentAddress = lastLeg ? senderAddress : multiRoute.legs[legIndex + 1].poolAddress
    const path: Path = {
      pool: multiRoute.legs[legIndex].poolAddress,
      data: defaultAbiCoder.encode(
        ['address', 'address', 'bool'],
        [multiRoute.legs[legIndex].tokenFrom.address, recipentAddress, lastLeg && receiveToWallet]
      ),
    }
    paths.push(path)
  }

  // console.log('slippage?', { amountOut: multiRoute.amountOut, slippage })

  let inputParams: ExactInputParams = {
    tokenIn: inputAmount.currency.isNative && fromWallet ? AddressZero : multiRoute.legs[0].tokenFrom.address,
    amountIn: fromWallet ? inputAmount.quotient.toString().toBigNumber(0) : getBigNumber(multiRoute.amountIn),
    amountOutMinimum: getBigNumber(multiRoute.amountOut * slippage),
    path: paths,
    routeType: RouteType.SinglePath,
  }

  return inputParams
}

function getComplexPathParams(
  multiRoute: MultiRoute,
  senderAddress: string,
  tridentRouterAddress: string,
  slippage: number,
  inputAmount: CurrencyAmount<Currency>,
  fromWallet: boolean = true,
  receiveToWallet: boolean = true
): ComplexPathParams {
  let initialPaths: InitialPath[] = []
  let percentagePaths: PercentagePath[] = []
  let outputs: Output[] = []

  const routeLegs = multiRoute.legs.length
  const initialPathCount = multiRoute.legs.filter(
    (leg) => leg.tokenFrom.address === multiRoute.fromToken.address
  ).length

  const output: Output = {
    token: (multiRoute.toToken as Currency).wrapped.address,
    to: senderAddress,
    unwrapBento: receiveToWallet,
    minAmount: getBigNumber(multiRoute.amountOut * slippage),
  }
  outputs.push(output)

  const fromTokenAddress = (multiRoute.fromToken as Currency).wrapped.address
  for (let legIndex = 0; legIndex < routeLegs; ++legIndex) {
    if (multiRoute.legs[legIndex].tokenFrom.address === fromTokenAddress) {
      const initialPath: InitialPath = {
        tokenIn:
          inputAmount.currency.isNative && fromWallet ? AddressZero : multiRoute.legs[legIndex].tokenFrom.address,
        pool: multiRoute.legs[legIndex].poolAddress,
        amount: getInitialPathAmount(legIndex, multiRoute, initialPaths, initialPathCount, inputAmount, fromWallet),
        native: inputAmount.currency.isNative || fromWallet,
        data: defaultAbiCoder.encode(
          ['address', 'address', 'bool'],
          [multiRoute.legs[legIndex].tokenFrom.address, tridentRouterAddress, false]
        ),
      }
      initialPaths.push(initialPath)
    } else {
      const percentagePath: PercentagePath = {
        tokenIn: multiRoute.legs[legIndex].tokenFrom.address,
        pool: multiRoute.legs[legIndex].poolAddress,
        balancePercentage: getBigNumber(multiRoute.legs[legIndex].swapPortion * 10 ** 8),
        data: defaultAbiCoder.encode(
          ['address', 'address', 'bool'],
          [multiRoute.legs[legIndex].tokenFrom.address, tridentRouterAddress, false]
        ),
      }
      percentagePaths.push(percentagePath)
    }
  }

  const complexParams: ComplexPathParams = {
    initialPath: initialPaths,
    percentagePath: percentagePaths,
    output: outputs,
    routeType: RouteType.ComplexPath,
  }

  return complexParams
}

function isLastLeg(legIndex: number, multiRoute: MultiRoute): boolean {
  return legIndex === multiRoute.legs.length - 1
}

function getRouteType(multiRoute: MultiRoute): RouteType {
  if (multiRoute.legs.length === 1) {
    return RouteType.SinglePool
  }

  const routeInputTokens = multiRoute.legs.map((leg) => leg.tokenFrom.address)

  if (new Set(routeInputTokens).size === routeInputTokens.length) {
    return RouteType.SinglePath
  }

  if (new Set(routeInputTokens).size !== routeInputTokens.length) {
    return RouteType.ComplexPath
  }

  return RouteType.Unknown
}

function multFraction(bn: BigNumber, fr: number, precision = 1e6) {
  return bn.mulDiv(Math.round(fr * precision), precision)
}

function getInitialPathAmount(
  legIndex: number,
  multiRoute: MultiRoute,
  initialPaths: InitialPath[],
  initialPathCount: number,
  inputAmount: CurrencyAmount<Currency>,
  fromWallet: boolean = true
): BigNumber {
  if (initialPathCount > 1 && legIndex === initialPathCount - 1) {
    const sumIntialPathAmounts = initialPaths.map((p) => p.amount).reduce((a, b) => a.add(b))
    return fromWallet
      ? inputAmount.quotient.toString().toBigNumber(0).sub(sumIntialPathAmounts)
      : getBigNumber(multiRoute.amountIn).sub(sumIntialPathAmounts)
  } else {
    return fromWallet
      ? multFraction(inputAmount.quotient.toString().toBigNumber(0), multiRoute.legs[legIndex].absolutePortion)
      : getBigNumber(multiRoute.amountIn * multiRoute.legs[legIndex].absolutePortion)
  }
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName the ENS name or address of the recipient of the swap output
 * @param signatureData the signature data of the permit of the input token amount, if available
 * @param tridentTradeContext context for a trident trade that contains boolean flags on whether to spend from wallet and/or receive to wallet
 */
export function useSwapCallArguments(
  trade: LegacyTrade<Currency, Currency, TradeType> | TridentTrade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | undefined, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | null | undefined,
  tridentTradeContext?: TridentTradeContext
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()

  const legacyRouterContract = useRouterContract()

  const tridentRouterContract = useTridentRouterContract()

  const argentWalletContract = useArgentWalletContract()

  const { rebase } = useBentoRebase(trade?.inputAmount.currency)

  return useMemo<SwapCall[]>(() => {
    let result: SwapCall[] = []
    if (
      // @ts-ignore TYPE NEEDS FIXING
      (featureEnabled(Feature.BENTOBOX, chainId) && !rebase) ||
      !trade ||
      !recipient ||
      !library ||
      !account ||
      !chainId
    )
      return result

    if (trade instanceof LegacyTrade) {
      if (!legacyRouterContract || !deadline) return result

      const swapMethods: SwapParameters[] = []
      swapMethods.push(
        LegacyRouter.swapCallParameters(trade, {
          feeOnTransfer: false,
          allowedSlippage,
          recipient,
          deadline: deadline.toNumber(),
        })
      )

      if (trade.tradeType === TradeType.EXACT_INPUT) {
        swapMethods.push(
          LegacyRouter.swapCallParameters(trade, {
            feeOnTransfer: true,
            allowedSlippage,
            recipient,
            deadline: deadline.toNumber(),
          })
        )
      }

      result = swapMethods.map(({ methodName, args, value }) => {
        if (argentWalletContract && trade.inputAmount.currency.isToken) {
          return {
            address: argentWalletContract.address,
            calldata: argentWalletContract.interface.encodeFunctionData('wc_multiCall', [
              [
                approveAmountCalldata(trade.maximumAmountIn(allowedSlippage), legacyRouterContract.address),
                {
                  to: legacyRouterContract.address,
                  value: value,
                  data: legacyRouterContract.interface.encodeFunctionData(methodName, args),
                },
              ],
            ]),
            value: '0x0',
          }
        } else {
          return {
            address: legacyRouterContract.address,
            calldata: legacyRouterContract.interface.encodeFunctionData(methodName, args),
            value,
          }
        }
      })

      return result
    } else if (trade instanceof TridentTrade) {
      if (!tridentTradeContext) return result

      const { parsedAmounts, receiveToWallet, fromWallet, bentoPermit } = tridentTradeContext
      if (!tridentRouterContract || !trade.route || !parsedAmounts?.[0]) return result

      const { routeType, ...rest } = getTridentRouterParams(
        trade.route,
        trade?.outputAmount?.currency.isNative && receiveToWallet ? tridentRouterContract?.address : recipient,
        tridentRouterContract?.address,
        Number(allowedSlippage.asFraction.multiply(100).toSignificant(2)),
        parsedAmounts[0],
        fromWallet,
        receiveToWallet
      )

      const method = {
        [RouteType.SinglePool]: fromWallet ? 'exactInputSingleWithNativeToken' : 'exactInputSingle',
        [RouteType.SinglePath]: fromWallet ? 'exactInputWithNativeToken' : 'exactInput',
        [RouteType.ComplexPath]: 'complexPath',
      }

      // if you spend from wallet send as amount instead of share
      let value = '0x0'
      if (parsedAmounts[0] && fromWallet && trade?.inputAmount.currency?.isNative) {
        value = toHex(parsedAmounts[0])
      }

      const actions = [
        approveMasterContractAction({ router: tridentRouterContract, signature: bentoPermit }),
        // @ts-ignore TYPE NEEDS FIXING
        tridentRouterContract.interface.encodeFunctionData(method[routeType], [rest]),
      ]

      if (trade?.outputAmount?.currency.isNative && receiveToWallet)
        actions.push(
          unwrapWETHAction({
            chainId,
            router: tridentRouterContract,
            recipient,
            amountMinimum: trade?.minimumAmountOut(allowedSlippage).quotient.toString(),
          })
        )

      result.push({
        address: tridentRouterContract.address,
        calldata: batchAction({
          contract: tridentRouterContract,
          actions,
        }),
        value,
      } as SwapCall)

      return result
    }

    return result
  }, [
    account,
    allowedSlippage,
    argentWalletContract,
    chainId,
    deadline,
    legacyRouterContract,
    library,
    rebase,
    recipient,
    trade,
    tridentRouterContract,
    tridentTradeContext,
  ])
}

/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 */
export function swapErrorToUserReadableMessage(error: any): string {
  let reason: string | undefined

  while (Boolean(error)) {
    reason = error.reason ?? error.message ?? reason
    error = error.error ?? error.data?.originalError
  }

  if (reason?.indexOf('execution reverted: ') === 0) reason = reason.substr('execution reverted: '.length)

  switch (reason) {
    case 'UniswapV2Router: EXPIRED':
      return t`The transaction could not be sent because the deadline has passed. Please check that your transaction deadline is not too low.`
    case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
    case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
      return t`This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.`
    case 'TransferHelper: TRANSFER_FROM_FAILED':
      return t`The input token cannot be transferred. There may be an issue with the input token.`
    case 'UniswapV2: TRANSFER_FAILED':
      return t`The output token cannot be transferred. There may be an issue with the output token.`
    case 'UniswapV2: K':
      return t`The Uniswap invariant x*y=k was not satisfied by the swap. This usually means one of the tokens you are swapping incorporates custom behavior on transfer.`
    case 'Too little received':
    case 'Too much requested':
    case 'STF':
      return t`This transaction will not succeed due to price movement. Try increasing your slippage tolerance.`
    case 'TF':
      return t`The output token cannot be transferred. There may be an issue with the output token.`
    case 'SushiGuard: FAILED_GAS_PRICE_ESTIMATION':
      return t`Your wallet provider has failed to obtain an accurate gas price estimation. Try again as it may be a transient error, or disable the SushiGuard feature.`
    case 'SushiGuard: FAILED_EIP1559_FEE_GAS_ESTIMATION':
      return t`Your wallet provider has failed to obtain an accurate gas fee estimation. Try again as it may be a transient error, or disable the SushiGuard feature.`
    case 'SushiGuard: FAILED_NONCE_RETRIEVAL':
      return t`Your wallet provider has failed to obtain a valid nonce from your wallet. Try again as it may be a transient error, or disable the SushiGuard feature.`
    case 'SushiGuard: UNSUPPORTED_PROVIDER_REQUEST':
      return t`Swap failed: Your wallet provider doesn't support the custom signature features necessary to sign your TX. Disable the SushiGuard feature or try with another wallet provider.`
    case 'SushiGuard: RELAY_URL_NOT_AVAILABLE':
      return t`SushiGuard is not available for the selected network. Disable the SushiGuard feature or switch to a supported network.`
    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        console.error(error, reason)
        return t`An error occurred when trying to execute this swap. You may need to increase your slippage tolerance. If that does not work, there may be an incompatibility with the token you are trading. Note fee on transfer and rebase tokens are incompatible with Uniswap V3.`
      }
      return t`Unknown error${reason ? `: "${reason}"` : ''}. Try increasing your slippage tolerance.`
  }
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: LegacyTrade<Currency, Currency, TradeType> | TridentTrade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | undefined, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | undefined | null,
  tridentTradeContext?: TridentTradeContext,
  useSushiGuard: boolean = false
): {
  state: SwapCallbackState
  callback: null | (() => Promise<string>)
  error: string | null
} {
  const { account, chainId, library } = useActiveWeb3React()
  const blockNumber = useBlockNumber()
  const dispatch = useAppDispatch()
  const { maxFee, maxPriorityFee } = useSwapState()
  const [expertMode] = useExpertModeManager()

  const eip1559 =
    // @ts-ignore TYPE NEEDS FIXING
    EIP_1559_ACTIVATION_BLOCK[chainId] == undefined ? false : blockNumber >= EIP_1559_ACTIVATION_BLOCK[chainId]

  const { address: recipientAddress } = useENS(recipientAddressOrName)

  const recipient = recipientAddressOrName ? recipientAddress ?? undefined : account ?? undefined

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipient, signatureData, tridentTradeContext)

  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return {
        state: SwapCallbackState.INVALID,
        callback: null,
        error: 'Missing dependencies',
      }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return {
          state: SwapCallbackState.INVALID,
          callback: null,
          error: 'Invalid recipient',
        }
      } else {
        return {
          state: SwapCallbackState.LOADING,
          callback: null,
          error: null,
        }
      }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        console.log('onSwap callback')
        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const { address, calldata, value } = call

            const tx =
              !value || isZero(value)
                ? { from: account, to: address, data: calldata }
                : {
                    from: account,
                    to: address,
                    data: calldata,
                    value,
                  }

            console.log('SWAP TRANSACTION', { tx, value })

            return library
              .estimateGas(tx)
              .then((gasEstimate) => {
                console.log('returning gas estimate')
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call)

                return library
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
                      error: new Error(swapErrorToUserReadableMessage(callError)),
                    }
                  })
              })
          })
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        // check if any calls errored with a recognizable error
        if (!bestCallOption) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          const firstNoErrorCall = estimatedCalls.find<SwapCallEstimate>(
            (call): call is SwapCallEstimate => !('error' in call)
          )
          if (!firstNoErrorCall) throw new Error('Unexpected error. Could not estimate gas for the swap.')
          bestCallOption = firstNoErrorCall
        }

        const {
          call: { address, calldata, value },
        } = bestCallOption

        console.log('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {})

        const txParams: TransactionRequest = {
          from: account,
          to: address,
          data: calldata,
          // let the wallet try if we can't estimate the gas
          ...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
          // gasPrice: !eip1559 && chainId === ChainId.HARMONY ? BigNumber.from('2000000000') : undefined,
          ...(value && !isZero(value) ? { value } : {}),
        }

        let privateTx = false
        let txResponse: Promise<TransactionResponseLight>
        if (!useSushiGuard) {
          txResponse = library.getSigner().sendTransaction(txParams)
        } else {
          // Set flag for transaction adder
          privateTx = true

          // @ts-ignore TYPE NEEDS FIXING
          txResponse = library
            .getSigner()
            .populateTransaction({
              type: eip1559 ? 2 : 0, // EIP1559, otherwise Legacy
              ...txParams,
            })
            .then((fullTx: TransactionRequest) => {
              const { type, chainId, nonce, gasPrice, gasLimit, maxFeePerGas, maxPriorityFeePerGas, to, value, data } =
                fullTx

              const hOpts: DataOptions = { hexPad: 'left' }

              const _maxFeePerGas = expertMode && maxFee ? BigNumber.from(maxFee) : maxFeePerGas
              const _maxPriorityFee =
                expertMode && maxPriorityFee ? BigNumber.from(maxPriorityFee) : maxPriorityFeePerGas

              // protect ourselves from not obtaining the gas price for legacy tx
              if (!eip1559 && !isBigNumberish(gasPrice)) throw new Error('SushiGuard: FAILED_GAS_PRICE_ESTIMATION')

              // protect ourselves from not obtaining correctly the necessary maxFeePerGas and maxPriorityFeePerGas for EIP1559
              if (eip1559 && !isBigNumberish(_maxFeePerGas) && !isBigNumberish(_maxPriorityFee))
                throw new Error('SushiGuard: FAILED_EIP1559_FEE_GAS_ESTIMATION')

              const txData = TransactionFactory.fromTxData(
                {
                  type: type ? hexlify(type) : undefined,
                  chainId: chainId ? hexlify(chainId) : undefined,
                  nonce: nonce ? hexlify(nonce, hOpts) : undefined,
                  gasPrice: gasPrice ? hexlify(gasPrice, hOpts) : undefined,
                  gasLimit: gasLimit ? hexlify(gasLimit, hOpts) : undefined,
                  maxFeePerGas: _maxFeePerGas ? hexlify(_maxFeePerGas, hOpts) : undefined,
                  maxPriorityFeePerGas: _maxPriorityFee ? hexlify(_maxPriorityFee, hOpts) : undefined,
                  to,
                  value: value ? hexlify(value, hOpts) : undefined,
                  data: data?.toString(),
                },
                { common: new Common({ chain: chainId ?? ChainId.ETHEREUM, hardfork: Hardfork.London }) }
              )
              const txToSign = hexlify(txData.getMessageToSign())

              dispatch(setSushiRelayChallenge(txToSign))

              if (!library.provider.request) throw new Error('SushiGuard: UNSUPPORTED_PROVIDER_REQUEST')
              return library.provider
                .request({ method: 'eth_sign', params: [account, txToSign] })
                .then((signature: SignatureLike) => {
                  const { v, r, s } = splitSignature(signature)
                  // eslint-disable-next-line
                  // @ts-ignore
                  const txWithSignature: TypedTransaction = txData._processSignature(v, arrayify(r), arrayify(s))

                  // verification step:
                  // if recovered sender address doesn't match with the one the user is using,
                  // then the wallet doesn't support custom signing txs with `eth_sign`
                  // so, better to fail here until a more robust solution is provided
                  const signedSenderAddress = TransactionFactory.fromSerializedData(
                    Buffer.from(txWithSignature.serialize(), 'utf8')
                  )
                    .getSenderAddress()
                    .toString()
                  if (account.toLowerCase() !== signedSenderAddress.toLowerCase())
                    throw new Error('SushiGuard: UNSUPPORTED_PROVIDER_REQUEST')

                  return hexlify(txWithSignature.serialize())
                })
            })
            .then((signedTx: string) => {
              if (!SUSHIGUARD_RELAY[chainId as ChainId]) throw new Error('SushiGuard: RELAY_URL_NOT_AVAILABLE')
              return fetchJsonRpc(SUSHIGUARD_RELAY[chainId as ChainId] ?? '', {
                method: 'eth_sendRawTransaction',
                params: [signedTx],
              }).then((res) => {
                if (res.error) throw res.error
                return { hash: res.result } as TransactionResponseLight
              })
            })
            .finally(() => {
              dispatch(setSushiRelayChallenge(undefined))
            })
        }

        return txResponse
          .then((response: TransactionResponseLight) => {
            let base = `Swap ${trade?.inputAmount?.toSignificant(4)} ${
              trade?.inputAmount.currency?.symbol
            } for ${trade?.outputAmount?.toSignificant(4)} ${trade?.outputAmount.currency?.symbol}`
            if (tridentTradeContext?.parsedAmounts) {
              base = `Swap ${tridentTradeContext?.parsedAmounts[0]?.toSignificant(4)} ${
                // @ts-ignore TYPE NEEDS FIXING
                tridentTradeContext?.parsedAmounts[0].currency?.symbol
              } for ${tridentTradeContext?.parsedAmounts[1]?.toSignificant(4)} ${
                // @ts-ignore TYPE NEEDS FIXING
                tridentTradeContext?.parsedAmounts[1].currency?.symbol
              }`
            }

            if (tridentTradeContext?.bentoPermit && tridentTradeContext?.resetBentoPermit) {
              tridentTradeContext.resetBentoPermit()
            }

            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? shortenAddress(recipientAddressOrName)
                      : recipientAddressOrName
                  }`

            addTransaction(response, {
              summary: withRecipient,
              privateTx,
            })

            return response.hash
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === USER_REJECTED_TX) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, address, calldata, value)

              throw new Error(`Swap failed: ${swapErrorToUserReadableMessage(error)}`)
            }
          })
      },
      error: null,
    }
  }, [
    trade,
    library,
    account,
    chainId,
    recipient,
    recipientAddressOrName,
    swapCalls,
    useSushiGuard,
    eip1559,
    expertMode,
    maxFee,
    maxPriorityFee,
    dispatch,
    tridentTradeContext,
    addTransaction,
  ])
}
