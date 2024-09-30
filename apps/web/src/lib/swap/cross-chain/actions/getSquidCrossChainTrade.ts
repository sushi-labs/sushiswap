import {
  ChainType,
  DexName,
  Hook,
  RouteRequest,
  SquidCallType,
} from '@0xsquid/squid-types'
import { NativeAddress } from 'src/lib/constants'
import { routeProcessor4Abi_processRoute, squidRouterAbi } from 'sushi/abi'
import {
  ROUTE_PROCESSOR_4_ADDRESS,
  SQUID_ADAPTER_ADDRESS,
  SQUID_ROUTER_ADDRESS,
  isSquidAdapterChainId,
} from 'sushi/config'
import { axlUSDC } from 'sushi/currency'
import { RouteStatus, RouterLiquiditySource } from 'sushi/router'
import { Address, Hex, encodeFunctionData, erc20Abi, zeroAddress } from 'viem'
import {
  SushiXSwap2Adapter,
  SushiXSwapFunctionName,
  SushiXSwapTransactionType,
  applySlippage,
  decodeSquidRouterCallData,
  encodeRouteProcessorArgs,
  encodeSquidBridgeParams,
  getSquidTrade,
  isSquidRouteProcessorEnabled,
} from '../lib'
import {
  CrossChainTradeSchemaType,
  GetCrossChainTradeParams,
} from './getCrossChainTrade'
import { getSquidRoute } from './getSquidRoute'
import {
  SuccessfulTradeReturn,
  getTrade,
  isSuccessfulTradeReturn,
} from './getTrade'

export const getSquidCrossChainTrade = async ({
  srcChainId,
  dstChainId,
  tokenIn,
  tokenOut,
  amount,
  slippagePercentage,
  srcGasPrice,
  dstGasPrice,
  from,
  recipient,
}: GetCrossChainTradeParams): Promise<CrossChainTradeSchemaType> => {
  try {
    const bridgePath =
      isSquidAdapterChainId(srcChainId) && isSquidAdapterChainId(dstChainId)
        ? {
            srcBridgeToken: axlUSDC[srcChainId],
            dstBridgeToken: axlUSDC[dstChainId],
          }
        : undefined

    if (!bridgePath) {
      throw new Error('getSquidCrossChainTrade: no bridge route found')
    }
    const { srcBridgeToken, dstBridgeToken } = bridgePath

    // has swap on source chain
    const isSrcSwap = Boolean(
      tokenIn.toLowerCase() !== srcBridgeToken.address.toLowerCase(),
    )

    // has swap on destination chain
    const isDstSwap = Boolean(
      tokenOut.toLowerCase() !== dstBridgeToken.address.toLowerCase(),
    )

    // whether to use RP for routing, uses to Squid when
    // no liquidity through RP-compatible pools
    const useRPOnSrc = Boolean(
      isSrcSwap && isSquidRouteProcessorEnabled[srcChainId],
    )
    const useRPOnDst = Boolean(
      isDstSwap &&
        isSquidRouteProcessorEnabled[dstChainId] &&
        Boolean(isSrcSwap ? useRPOnSrc : true),
    )

    const _srcRPTrade = useRPOnSrc
      ? await getTrade({
          chainId: srcChainId,
          amount,
          fromToken: tokenIn,
          toToken: srcBridgeToken.address,
          slippagePercentage,
          gasPrice: srcGasPrice,
          recipient: SQUID_ROUTER_ADDRESS[srcChainId],
          source: RouterLiquiditySource.XSwap,
        })
      : undefined

    if (useRPOnSrc && !isSuccessfulTradeReturn(_srcRPTrade!)) {
      throw new Error('getSquidCrossChainTrade: srcRPTrade failed')
    }

    const srcRPTrade = useRPOnSrc
      ? (_srcRPTrade as SuccessfulTradeReturn)
      : undefined

    const dstAmountIn = useRPOnSrc
      ? BigInt(srcRPTrade!.assumedAmountOut)
      : amount

    const _dstRPTrade = useRPOnDst
      ? await getTrade({
          chainId: dstChainId,
          amount: dstAmountIn,
          fromToken: dstBridgeToken.address,
          toToken: tokenOut,
          slippagePercentage,
          gasPrice: dstGasPrice,
          recipient,
          source: RouterLiquiditySource.XSwap,
        })
      : undefined

    if (useRPOnDst && !isSuccessfulTradeReturn(_dstRPTrade!)) {
      throw new Error('getSquidCrossChainTrade: dstRPTrade failed')
    }

    const dstRPTrade = useRPOnDst
      ? (_dstRPTrade as SuccessfulTradeReturn)
      : undefined

    const routeRequest: RouteRequest = {
      fromAddress: from ?? zeroAddress,
      toAddress: recipient ?? zeroAddress,
      fromChain: srcChainId.toString(),
      toChain: dstChainId.toString(),
      fromToken: useRPOnSrc ? srcBridgeToken.address : tokenIn,
      toToken: useRPOnDst ? dstBridgeToken.address : tokenOut,
      fromAmount: dstAmountIn.toString(),
      slippage: +slippagePercentage,
      prefer: [DexName.SUSHISWAP_V3, DexName.SUSHISWAP_V2],
      quoteOnly: !from || !recipient,
    }

    if (useRPOnDst && dstRPTrade?.routeProcessorArgs) {
      const rpAddress = ROUTE_PROCESSOR_4_ADDRESS[dstChainId]

      // Transfer dstBridgeToken to RouteProcessor & call ProcessRoute()
      routeRequest.postHook = {
        chainType: ChainType.EVM,
        calls: [
          // Transfer full balance of dstBridgeToken to RouteProcessor
          {
            chainType: ChainType.EVM,
            callType: SquidCallType.FULL_TOKEN_BALANCE,
            target: dstBridgeToken.address,
            callData: encodeFunctionData({
              abi: erc20Abi,
              functionName: 'transfer',
              args: [rpAddress, 0n],
            }),
            value: '0',
            payload: {
              tokenAddress: dstBridgeToken.address,
              inputPos: 1,
            },
            estimatedGas: '30000',
          },
          // Invoke RouteProcessor.processRoute()
          {
            chainType: ChainType.EVM,
            callType: SquidCallType.DEFAULT,
            target: rpAddress,
            callData: encodeFunctionData({
              abi: routeProcessor4Abi_processRoute,
              functionName: 'processRoute',
              args: [
                dstRPTrade.routeProcessorArgs.tokenIn as Address,
                BigInt(dstRPTrade.routeProcessorArgs.amountIn),
                dstRPTrade.routeProcessorArgs.tokenOut as Address,
                BigInt(dstRPTrade.routeProcessorArgs.amountOutMin),
                dstRPTrade.routeProcessorArgs.to as Address,
                dstRPTrade.routeProcessorArgs.routeCode as Hex,
              ],
            }),
            value: '0',
            payload: {
              tokenAddress: zeroAddress,
              inputPos: 0,
            },
            estimatedGas: (1.2 * dstRPTrade!.gasSpent + 20_000).toString(),
          },
        ],
        description: `Swap ${tokenIn} -> ${tokenOut} on RouteProcessor`,
      } as Hook
    }

    const { route: squidRoute } = await getSquidRoute(routeRequest)

    const srcSquidTrade =
      isSrcSwap && !useRPOnSrc
        ? getSquidTrade(squidRoute.estimate.fromToken, srcBridgeToken)
        : undefined

    const dstSquidTrade =
      isDstSwap && !useRPOnDst
        ? getSquidTrade(dstBridgeToken, squidRoute.estimate.toToken)
        : undefined

    const dstAmountOut = useRPOnDst
      ? BigInt(dstRPTrade!.assumedAmountOut)
      : BigInt(squidRoute.estimate.toAmount)

    const dstAmountOutMin =
      useRPOnSrc && !isDstSwap
        ? applySlippage(srcRPTrade!.assumedAmountOut, slippagePercentage)
        : useRPOnDst
          ? applySlippage(dstRPTrade!.assumedAmountOut, slippagePercentage)
          : BigInt(squidRoute.estimate.toAmountMin)

    let priceImpact = 0
    if (useRPOnSrc) {
      priceImpact += srcRPTrade!.priceImpact
    }
    if (useRPOnDst) {
      priceImpact += dstRPTrade!.priceImpact
    }

    priceImpact += +squidRoute.estimate.aggregatePriceImpact / 100

    let writeArgs
    let functionName
    const transactionType =
      !isSrcSwap && !isDstSwap
        ? SushiXSwapTransactionType.Bridge
        : isSrcSwap && !isDstSwap
          ? SushiXSwapTransactionType.SwapAndBridge
          : !isSrcSwap && isDstSwap
            ? SushiXSwapTransactionType.BridgeAndSwap
            : SushiXSwapTransactionType.CrossChainSwap

    const srcTrade = useRPOnSrc ? srcRPTrade : srcSquidTrade
    const dstTrade = useRPOnDst ? dstRPTrade : dstSquidTrade

    if (!recipient || !from) {
      return {
        status: RouteStatus.Success,
        adapter: SushiXSwap2Adapter.Squid,
        priceImpact,
        amountIn: amount.toString(),
        amountOut: dstAmountOut.toString(),
        amountOutMin: dstAmountOutMin.toString(),
        tokenIn,
        tokenOut,
        srcBridgeToken: srcBridgeToken.serialize(),
        dstBridgeToken: dstBridgeToken.serialize(),
        srcTrade,
        dstTrade,
        transactionType,
      }
    }

    if (useRPOnSrc) {
      const srcSwapData = encodeRouteProcessorArgs(
        (srcTrade as SuccessfulTradeReturn).routeProcessorArgs!,
      )

      const squidCallData = decodeSquidRouterCallData(
        squidRoute.transactionRequest?.data as `0x${string}`,
      )

      const squidCallArgs =
        squidCallData.args && squidCallData.args.length > 1
          ? [squidCallData.args[0], 0, ...squidCallData.args.slice(2)]
          : undefined

      functionName = SushiXSwapFunctionName.SwapAndBridge
      writeArgs = [
        {
          refId: '0x0000',
          adapter: SQUID_ADAPTER_ADDRESS[srcChainId],
          tokenIn,
          amountIn: amount.toString(),
          to: recipient,
          adapterData: encodeSquidBridgeParams({
            srcBridgeToken,
            callData: encodeFunctionData({
              abi: squidRouterAbi,
              functionName: squidCallData.functionName,
              args: squidCallArgs,
            }),
          }),
        },
        recipient, // refundAddress
        srcSwapData, // srcSwapData
        '0x', // dstSwapData
        '0x', // dstPayloadData
      ]
    } else {
      functionName = SushiXSwapFunctionName.Bridge
      writeArgs = [
        {
          refId: '0x0000',
          adapter: SQUID_ADAPTER_ADDRESS[srcChainId],
          tokenIn,
          amountIn: amount.toString(),
          to: recipient,
          adapterData: encodeSquidBridgeParams({
            srcBridgeToken,
            callData: squidRoute.transactionRequest?.data as Hex,
          }),
        },
        recipient, // refundAddress
        '0x', // dstSwapData
        '0x', // dstPayloadData
      ]
    }

    // Add 10 % buffer
    const bridgeFee =
      (squidRoute.estimate.feeCosts.reduce(
        (accumulator, current) => accumulator + BigInt(current.amount),
        0n,
      ) *
        11n) /
      10n

    const value =
      tokenIn.toLowerCase() === NativeAddress.toLowerCase()
        ? BigInt(amount) + BigInt(bridgeFee)
        : BigInt(bridgeFee)

    const srcGasEstimate =
      BigInt(squidRoute.transactionRequest?.gasLimit ?? 0) +
      (useRPOnSrc ? BigInt((srcTrade as SuccessfulTradeReturn).gasSpent) : 0n)

    const srcGasFee = srcGasPrice
      ? srcGasPrice * srcGasEstimate
      : srcGasEstimate

    const gasSpent = srcGasFee + bridgeFee

    return {
      adapter: SushiXSwap2Adapter.Squid,
      status: RouteStatus.Success,
      transactionType,
      tokenIn,
      tokenOut,
      srcBridgeToken: srcBridgeToken.serialize(),
      dstBridgeToken: dstBridgeToken.serialize(),
      amountIn: amount.toString(),
      amountOut: dstAmountOut.toString(),
      amountOutMin: dstAmountOutMin.toString(),
      srcTrade,
      dstTrade,
      priceImpact,
      gasSpent: gasSpent.toString(),
      bridgeFee: bridgeFee.toString(),
      srcGasFee: srcGasFee.toString(),
      writeArgs,
      functionName,
      value: value ? value.toString() : '0',
    }
  } catch (e) {
    console.error(e)
    return {
      adapter: SushiXSwap2Adapter.Squid,
      status: RouteStatus.NoWay,
    }
  }
}
