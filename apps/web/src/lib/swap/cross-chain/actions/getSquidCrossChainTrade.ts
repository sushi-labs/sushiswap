import {
  ChainType,
  DexName,
  Hook,
  RouteRequest,
  SquidCallType,
} from '@0xsquid/squid-types'
import { NativeAddress, tradeValidator02 } from '@sushiswap/react-query'
import { routeProcessor4Abi, squidRouterAbi } from 'sushi/abi'
import {
  ROUTE_PROCESSOR_4_ADDRESS,
  SQUID_ADAPTER_ADDRESS,
  SQUID_ROUTER_ADDRESS,
  isSquidAdapterChainId,
} from 'sushi/config'
import { axlUSDC } from 'sushi/currency'
import { RouterLiquiditySource } from 'sushi/router'
import { PoolType, RouteStatus } from 'sushi/tines'
import {
  Address,
  Hex,
  WriteContractParameters,
  encodeFunctionData,
  erc20Abi,
  zeroAddress,
} from 'viem'
import { z } from 'zod'
import {
  SushiXSwap2Adapter,
  SushiXSwapFunctionName,
  SushiXSwapTransactionType,
  decodeSquidRouterCallData,
  encodeRouteProcessorArgs,
  encodeSquidBridgeParams,
  isSquidRouteProcessorEnabled,
} from '../lib'
import {
  CrossChainTradeSchemaType,
  GetCrossChainTradeParams,
} from './getCrossChainTrade'
import { getSquidRoute } from './getSquidRoute'
import { getTrade } from './getTrade'

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

    const srcRPTrade = useRPOnSrc
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

    if (useRPOnSrc && srcRPTrade?.status !== RouteStatus.Success) {
      throw new Error('getSquidCrossChainTrade: srcRPTrade failed')
    }

    const srcRPTradeAmountOutMin =
      srcRPTrade?.status === RouteStatus.Success
        ? (BigInt(srcRPTrade.assumedAmountOut) *
            BigInt((1 - +slippagePercentage) * 10_000)) /
          10_000n
        : undefined

    const dstAmountIn = useRPOnSrc ? (srcRPTradeAmountOutMin as bigint) : amount

    const dstRPTrade =
      useRPOnDst && dstAmountIn
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

    if (useRPOnDst && dstRPTrade?.status !== RouteStatus.Success) {
      throw new Error('getSquidCrossChainTrade: dstRPTrade failed')
    }

    console.log(dstRPTrade)

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

    if (
      useRPOnDst &&
      dstRPTrade?.status === RouteStatus.Success &&
      dstRPTrade?.routeProcessorArgs
    ) {
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
              abi: routeProcessor4Abi,
              functionName: 'processRoute',
              args: [
                dstRPTrade.routeProcessorArgs.tokenIn as Address,
                BigInt(dstRPTrade.routeProcessorArgs.amountIn),
                dstRPTrade.routeProcessorArgs.tokenOut as Address,
                BigInt(dstRPTrade.routeProcessorArgs.amountOutMin),
                dstRPTrade.routeProcessorArgs.to,
                dstRPTrade.routeProcessorArgs.routeCode as Hex,
              ] as WriteContractParameters<
                typeof routeProcessor4Abi,
                'processRoute'
              >['args'],
            }),
            value: '0',
            payload: {
              tokenAddress: zeroAddress,
              inputPos: 0,
            },
            estimatedGas: (1.2 * dstRPTrade.gasSpent + 20_000).toString(),
          },
        ],
        description: `Swap ${tokenIn} -> ${tokenOut} on RouteProcessor`,
      } as Hook
    }

    const { route: squidRoute } = await getSquidRoute(routeRequest)

    const srcSquidTrade: z.infer<typeof tradeValidator02> | undefined =
      isSrcSwap && !useRPOnSrc
        ? {
            status: RouteStatus.Success,
            tokens: [
              { ...squidRoute.estimate.fromToken },
              {
                ...srcBridgeToken.serialize(),
                name: srcBridgeToken.name ?? '',
                symbol: srcBridgeToken.symbol ?? '',
              },
            ],
            tokenFrom: 0,
            tokenTo: 1,
            primaryPrice: +squidRoute.estimate.actions[0].exchangeRate,
            swapPrice: +squidRoute.estimate.actions[0].exchangeRate,
            priceImpact: +squidRoute.estimate.actions[0].priceImpact,
            amountIn: squidRoute.estimate.actions[0].fromAmount,
            assumedAmountOut: squidRoute.estimate.actions[0].toAmount,
            gasSpent: +squidRoute.estimate.gasCosts.reduce((accum, cur) => {
              accum = accum + Number(cur.amount)
              return accum
            }, 0),
            route: [
              {
                poolAddress: SQUID_ROUTER_ADDRESS[srcChainId],
                poolType: PoolType.Unknown,
                poolName: 'Squid',
                poolFee: 0,
                tokenFrom: 0,
                tokenTo: 1,
                share: 0,
                assumedAmountIn: squidRoute.estimate.actions[0].fromAmount,
                assumedAmountOut: squidRoute.estimate.actions[0].toAmount,
              },
            ],
          }
        : undefined

    const _dstSwapSquidActionIndex = srcSquidTrade ? 1 : 0
    const dstSquidTrade: z.infer<typeof tradeValidator02> | undefined =
      isDstSwap && !useRPOnDst
        ? {
            status: RouteStatus.Success,
            tokens: [
              { ...squidRoute.estimate.fromToken },
              {
                ...srcBridgeToken.serialize(),
                name: srcBridgeToken.name ?? '',
                symbol: srcBridgeToken.symbol ?? '',
              },
            ],
            tokenFrom: 0,
            tokenTo: 1,
            primaryPrice:
              +squidRoute.estimate.actions[_dstSwapSquidActionIndex]
                .exchangeRate,
            swapPrice:
              +squidRoute.estimate.actions[_dstSwapSquidActionIndex]
                .exchangeRate,
            priceImpact:
              +squidRoute.estimate.actions[_dstSwapSquidActionIndex]
                .priceImpact,
            amountIn:
              squidRoute.estimate.actions[_dstSwapSquidActionIndex].fromAmount,
            assumedAmountOut:
              squidRoute.estimate.actions[_dstSwapSquidActionIndex].toAmount,
            gasSpent: +squidRoute.estimate.gasCosts.reduce((accum, cur) => {
              accum = accum + Number(cur.amount)
              return accum
            }, 0),
            route: [
              {
                poolAddress: SQUID_ROUTER_ADDRESS[srcChainId],
                poolType: PoolType.Unknown,
                poolName: 'Squid',
                poolFee: 0,
                tokenFrom: 0,
                tokenTo: 1,
                share: 0,
                assumedAmountIn:
                  squidRoute.estimate.actions[_dstSwapSquidActionIndex]
                    .fromAmount,
                assumedAmountOut:
                  squidRoute.estimate.actions[_dstSwapSquidActionIndex]
                    .toAmount,
              },
            ],
          }
        : undefined

    console.log('squidRoute', squidRoute)

    const dstAmountOut =
      useRPOnDst && dstRPTrade?.status === RouteStatus.Success
        ? dstRPTrade.assumedAmountOut
        : squidRoute.estimate.toAmount

    const dstAmountOutMin =
      useRPOnDst && dstRPTrade?.status === RouteStatus.Success
        ? (BigInt(dstRPTrade.assumedAmountOut) *
            BigInt((1 - +slippagePercentage) * 10_000)) /
          10_000n
        : BigInt(squidRoute.estimate.toAmountMin)

    let priceImpact = 0
    if (useRPOnSrc && srcRPTrade?.status === RouteStatus.Success) {
      priceImpact += srcRPTrade.priceImpact
    }
    if (useRPOnDst && dstRPTrade?.status === RouteStatus.Success) {
      priceImpact += dstRPTrade.priceImpact
    }

    priceImpact += +squidRoute.estimate.aggregatePriceImpact

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

    const serializedSrcBridgeToken = {
      ...srcBridgeToken.serialize(),
      address: srcBridgeToken.isNative ? NativeAddress : srcBridgeToken.address,
      name: srcBridgeToken.name ?? '',
      symbol: srcBridgeToken.symbol ?? '',
    }

    const serializedDstBridgeToken = {
      ...dstBridgeToken.serialize(),
      address: dstBridgeToken.isNative ? NativeAddress : dstBridgeToken.address,
      name: dstBridgeToken.name ?? '',
      symbol: dstBridgeToken.symbol ?? '',
    }

    if (!recipient || !from) {
      return {
        status: RouteStatus.Success,
        adapter: SushiXSwap2Adapter.Squid,
        priceImpact,
        amountIn: amount.toString(),
        amountOut: dstAmountOut,
        amountOutMin: dstAmountOutMin.toString(),
        tokenIn,
        tokenOut,
        srcBridgeToken: serializedSrcBridgeToken,
        dstBridgeToken: serializedDstBridgeToken,
        srcTrade,
        dstTrade,
        transactionType,
      }
    }

    if (
      useRPOnSrc &&
      srcTrade?.status === RouteStatus.Success &&
      srcTrade.routeProcessorArgs
    ) {
      const srcSwapData = encodeRouteProcessorArgs(srcTrade.routeProcessorArgs)

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

    console.log(squidRoute.estimate.feeCosts)

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
      (useRPOnSrc && srcTrade?.status === RouteStatus.Success
        ? BigInt(srcTrade.gasSpent)
        : 0n)

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
      srcBridgeToken: serializedSrcBridgeToken,
      dstBridgeToken: serializedDstBridgeToken,
      amountIn: amount.toString(),
      amountOut: dstAmountOut,
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
