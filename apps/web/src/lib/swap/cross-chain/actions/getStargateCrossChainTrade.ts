import { NativeAddress } from '@sushiswap/react-query'
import { stargateAdapterAbi } from 'sushi/abi'
import {
  STARGATE_ADAPTER_ADDRESS,
  STARGATE_CHAIN_ID,
  STARGATE_CHAIN_PATHS,
  STARGATE_ETH_ADDRESS,
  STARGATE_USDC,
  STARGATE_USDC_ADDRESS,
  STARGATE_USDT,
  STARGATE_USDT_ADDRESS,
  StargateAdapterChainId,
  isStargateAdapterChainId,
  publicClientConfig,
} from 'sushi/config'
import { Native } from 'sushi/currency'
import { Fraction, ONE, ZERO } from 'sushi/math'
import { RouterLiquiditySource } from 'sushi/router'
import {
  Address,
  createPublicClient,
  encodeAbiParameters,
  parseAbiParameters,
} from 'viem'
import {
  STARGATE_DEFAULT_SLIPPAGE,
  SushiXSwap2Adapter,
  SushiXSwapTransactionType,
  encodeRouteProcessorArgs,
  encodeStargateTeleportParams,
  estimateStargateDstGas,
} from '../lib'
import {
  CrossChainTradeSchemaType,
  GetCrossChainTradeParams,
} from './getCrossChainTrade'
import { getStargateFees } from './getStargateFees'
import { getTrade } from './getTrade'

export const getStargateCrossChainTrade = async ({
  srcChainId,
  dstChainId,
  tokenIn,
  tokenOut,
  amount,
  slippagePercentage,
  srcGasPrice,
  dstGasPrice,
  recipient,
}: GetCrossChainTradeParams): Promise<CrossChainTradeSchemaType> => {
  try {
    const bridgePath =
      isStargateAdapterChainId(srcChainId) &&
      isStargateAdapterChainId(dstChainId)
        ? getStargateBridgePath({ srcChainId, dstChainId, tokenIn, tokenOut })
        : undefined

    if (!bridgePath) {
      throw new Error('getStaragetCrossChainTrade: no bridge route found')
    }

    const { srcBridgeToken, dstBridgeToken } = bridgePath

    // has swap on source chain
    const isSrcSwap = Boolean(
      srcBridgeToken.isNative
        ? tokenIn.toLowerCase() !== NativeAddress.toLowerCase()
        : tokenIn.toLowerCase() !== srcBridgeToken.address.toLowerCase(),
    )

    // has swap on destination chain
    const isDstSwap = Boolean(
      dstBridgeToken.isNative
        ? tokenOut.toLowerCase() !== NativeAddress.toLowerCase()
        : tokenOut.toLowerCase() !== dstBridgeToken.address.toLowerCase(),
    )

    const srcTrade = isSrcSwap
      ? await getTrade({
          chainId: srcChainId,
          amount,
          fromToken: tokenIn,
          toToken: srcBridgeToken.isNative
            ? NativeAddress
            : srcBridgeToken.address,
          slippagePercentage,
          gasPrice: srcGasPrice,
          recipient:
            STARGATE_ADAPTER_ADDRESS[srcChainId as StargateAdapterChainId],
          source: RouterLiquiditySource.XSwap,
        })
      : undefined

    if (isSrcSwap && srcTrade?.status !== 'Success') {
      throw new Error('getStaragetCrossChainTrade: srcTrade failed')
    }

    const srcTradeAmountOut =
      isSrcSwap && srcTrade?.status === 'Success'
        ? BigInt(srcTrade.assumedAmountOut)
        : undefined

    const bridgeFees = await getStargateFees({
      amount: isSrcSwap ? (srcTradeAmountOut as bigint) : amount,
      srcBridgeToken,
      dstBridgeToken,
    })

    if (!bridgeFees) {
      throw new Error('getStaragetCrossChainTrade: getStargateFees failed')
    }

    const [eqFee, eqReward, lpFee, protocolFee] = bridgeFees

    const bridgeFeeAmount = eqFee - eqReward + lpFee + protocolFee

    const bridgeImpact =
      Number(bridgeFeeAmount) /
      Number(
        isSrcSwap &&
          srcTrade?.status === 'Success' &&
          srcTrade.routeProcessorArgs
          ? BigInt(srcTrade.routeProcessorArgs.amountOutMin)
          : amount,
      )

    const srcAmountOut =
      isSrcSwap && srcTrade?.status === 'Success' && srcTrade.routeProcessorArgs
        ? BigInt(srcTrade.routeProcessorArgs.amountOutMin)
        : amount - bridgeFeeAmount

    const srcAmountOutMin = new Fraction(ONE)
      .add(STARGATE_DEFAULT_SLIPPAGE)
      .invert()
      .multiply(srcAmountOut).quotient

    // adapted from amountSDtoLD in https://www.npmjs.com/package/@layerzerolabs/sg-sdk
    // TODO: test thoroughly to/from BSC where srcBridgeToken.decimals !== dstBridgeToken.decimals
    const dstAmountIn =
      (srcAmountOut * 10n ** BigInt(dstBridgeToken.decimals)) /
      10n ** BigInt(srcBridgeToken.decimals)
    const dstAmountInMin =
      (srcAmountOutMin * 10n ** BigInt(dstBridgeToken.decimals)) /
      10n ** BigInt(srcBridgeToken.decimals)

    const dstTrade = isDstSwap
      ? await getTrade({
          chainId: dstChainId,
          amount: dstAmountIn,
          fromToken: dstBridgeToken.isNative
            ? NativeAddress
            : dstBridgeToken.address,
          toToken: tokenOut,
          slippagePercentage,
          gasPrice: dstGasPrice,
          recipient,
          source: RouterLiquiditySource.XSwap,
        })
      : undefined

    if (isDstSwap && dstTrade?.status !== 'Success') {
      throw new Error('getStaragetCrossChainTrade: dstTrade failed')
    }

    const dstAmountOut =
      isDstSwap && dstTrade?.status === 'Success'
        ? BigInt(dstTrade.assumedAmountOut)
        : dstAmountIn

    const dstAmountOutMin =
      isDstSwap && dstTrade?.status === 'Success'
        ? (BigInt(dstTrade.assumedAmountOut) *
            BigInt((1 - +slippagePercentage) * 10_000)) /
          10_000n
        : dstAmountInMin

    let priceImpact = bridgeImpact
    if (isSrcSwap && srcTrade?.status === 'Success')
      priceImpact += srcTrade.priceImpact
    if (isDstSwap && dstTrade?.status === 'Success')
      priceImpact += dstTrade.priceImpact

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

    if (!recipient) {
      return {
        adapter: SushiXSwap2Adapter.Stargate,
        status: 'Success',
        priceImpact,
        amountIn: amount.toString(),
        amountOut: dstAmountOut.toString(),
        minAmountOut: dstAmountOutMin.toString(),
        tokenIn,
        tokenOut,
        srcBridgeToken: serializedSrcBridgeToken,
        dstBridgeToken: serializedDstBridgeToken,
        srcTrade,
        dstTrade,
      }
    }

    let writeArgs
    let functionName
    let dstPayload
    let dstGasEst = ZERO
    let transactionType

    if (!isSrcSwap && !isDstSwap) {
      transactionType = SushiXSwapTransactionType.Bridge
      functionName = 'bridge'
      writeArgs = [
        {
          refId: '0x0000',
          adapter:
            STARGATE_ADAPTER_ADDRESS[srcChainId as StargateAdapterChainId],
          tokenIn,
          amountIn: amount.toString(),
          to: recipient,
          adapterData: encodeStargateTeleportParams({
            srcBridgeToken,
            dstBridgeToken,
            amount: amount,
            amountMin: srcAmountOutMin,
            dustAmount: 0,
            receiver: recipient, // receivier is recipient because no dstPayload
            to: recipient,
            dstGas: dstGasEst,
          }),
        },
        recipient, // refundAddress
        '0x', // swapPayload
        '0x', // payloadData
      ]
    } else if (
      isSrcSwap &&
      !isDstSwap &&
      srcTrade?.status === 'Success' &&
      srcTrade?.routeProcessorArgs
    ) {
      const srcSwapData = encodeRouteProcessorArgs(srcTrade.routeProcessorArgs)

      transactionType = SushiXSwapTransactionType.SwapAndBridge
      functionName = 'swapAndBridge'
      writeArgs = [
        {
          refId: '0x0000',
          adapter:
            STARGATE_ADAPTER_ADDRESS[srcChainId as StargateAdapterChainId],
          tokenIn,
          amountIn: amount.toString(),
          to: recipient,
          adapterData: encodeStargateTeleportParams({
            srcBridgeToken,
            dstBridgeToken,
            amount: 0, // StargateAdapter sends srcBridgeToken to StargateComposer
            amountMin: srcAmountOutMin,
            dustAmount: 0,
            receiver: recipient, // receivier is recipient because no dstPayload
            to: recipient,
            dstGas: dstGasEst,
          }),
        },
        recipient, // refundAddress
        srcSwapData,
        '0x',
        '0x',
      ]
    } else if (
      !isSrcSwap &&
      dstTrade?.status === 'Success' &&
      dstTrade?.routeProcessorArgs
    ) {
      const dstSwapData = encodeRouteProcessorArgs(dstTrade.routeProcessorArgs)

      dstGasEst = estimateStargateDstGas(dstTrade.gasSpent)

      dstPayload = encodeAbiParameters(
        parseAbiParameters('address, bytes, bytes'),
        [
          recipient,
          dstSwapData,
          '0x', // payloadData
        ],
      )

      transactionType = SushiXSwapTransactionType.BridgeAndSwap
      functionName = 'bridge'
      writeArgs = [
        {
          refId: '0x0000',
          adapter:
            STARGATE_ADAPTER_ADDRESS[srcChainId as StargateAdapterChainId],
          tokenIn,
          amountIn: amount.toString(),
          to: recipient,
          adapterData: encodeStargateTeleportParams({
            srcBridgeToken,
            dstBridgeToken,
            amount: amount,
            amountMin: srcAmountOutMin,
            dustAmount: 0,
            receiver:
              STARGATE_ADAPTER_ADDRESS[dstChainId as StargateAdapterChainId],
            to: recipient,
            dstGas: dstGasEst,
          }),
        },
        recipient, // refundAddress
        dstSwapData,
        '0x', // dstPayload
      ]
    } else if (
      isSrcSwap &&
      isDstSwap &&
      srcTrade?.status === 'Success' &&
      dstTrade?.status === 'Success' &&
      srcTrade?.routeProcessorArgs &&
      dstTrade?.routeProcessorArgs
    ) {
      const srcSwapData = encodeRouteProcessorArgs(srcTrade.routeProcessorArgs)
      const dstSwapData = encodeRouteProcessorArgs(dstTrade.routeProcessorArgs)

      dstPayload = encodeAbiParameters(
        parseAbiParameters('address, bytes, bytes'),
        [
          recipient, // to
          dstSwapData, // swapData
          '0x', // payloadData
        ],
      )
      dstGasEst = estimateStargateDstGas(dstTrade.gasSpent)

      transactionType = SushiXSwapTransactionType.CrossChainSwap
      functionName = 'swapAndBridge'
      writeArgs = [
        {
          refId: '0x0000',
          adapter:
            STARGATE_ADAPTER_ADDRESS[srcChainId as StargateAdapterChainId],
          tokenIn,
          amountIn: amount.toString(),
          to: recipient,
          adapterData: encodeStargateTeleportParams({
            srcBridgeToken,
            dstBridgeToken,
            amount: 0, // StargateAdapter sends srcBridgeToken to StargateComposer
            amountMin: srcAmountOutMin,
            dustAmount: 0,
            receiver:
              STARGATE_ADAPTER_ADDRESS[dstChainId as StargateAdapterChainId],
            to: recipient,
            dstGas: dstGasEst,
          }),
        },
        recipient, // refundAddress
        srcSwapData, //srcSwapPayload
        dstSwapData, // dstPayload
        '0x',
      ]
    } else {
      throw new Error('Crosschain swap not found.')
    }

    const client = createPublicClient(publicClientConfig[srcChainId])

    let [bridgeFee] = await client.readContract({
      address: STARGATE_ADAPTER_ADDRESS[srcChainId as StargateAdapterChainId],
      abi: stargateAdapterAbi,
      functionName: 'getFee',
      args: [
        STARGATE_CHAIN_ID[dstChainId as StargateAdapterChainId], // dstChain
        1, // functionType
        isDstSwap
          ? STARGATE_ADAPTER_ADDRESS[dstChainId as StargateAdapterChainId]
          : recipient, // receiver
        dstGasEst, // gasAmount
        0n, // dustAmount
        isDstSwap ? dstPayload! : '0x', // payload
      ],
    })

    // Add 20% buffer to STG fee
    bridgeFee = (bridgeFee * 5n) / 4n

    const value =
      tokenIn.toLowerCase() === NativeAddress.toLowerCase()
        ? BigInt(amount) + bridgeFee
        : bridgeFee

    // est 500K gas for XSwapV2 call
    const srcGasEst =
      500000n + BigInt(srcTrade?.status === 'Success' ? srcTrade?.gasSpent : 0)

    const srcGasFee = srcGasPrice ? srcGasPrice * srcGasEst : srcGasEst

    const gasSpent = srcGasFee + bridgeFee

    return {
      adapter: SushiXSwap2Adapter.Stargate,
      status: 'Success',
      transactionType,
      tokenIn,
      tokenOut,
      srcBridgeToken: serializedSrcBridgeToken,
      dstBridgeToken: serializedDstBridgeToken,
      amountIn: amount.toString(),
      amountOut: dstAmountOut.toString(),
      minAmountOut: dstAmountOutMin.toString(),
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
      adapter: SushiXSwap2Adapter.Stargate,
      status: 'NoWay',
    }
  }
}

export const getStargateBridgePath = ({
  srcChainId,
  dstChainId,
  tokenIn,
}: {
  srcChainId: StargateAdapterChainId
  dstChainId: StargateAdapterChainId
  tokenIn: Address
  tokenOut: Address
}) => {
  const srcChainPaths = STARGATE_CHAIN_PATHS[srcChainId]

  // If srcCurrency is ETH, check for ETH path
  if (
    tokenIn.toLowerCase() === NativeAddress.toLowerCase() &&
    srcChainId in STARGATE_ETH_ADDRESS
  ) {
    const ethPaths =
      srcChainPaths[
        STARGATE_ETH_ADDRESS[srcChainId as keyof typeof STARGATE_ETH_ADDRESS]
      ]

    if (
      ethPaths.find((dstBridgeToken) => dstBridgeToken.chainId === dstChainId)
    ) {
      return {
        srcBridgeToken: Native.onChain(srcChainId),
        dstBridgeToken: Native.onChain(dstChainId),
      }
    }
  }

  // Else fallback to USDC/USDT
  if (
    srcChainId in STARGATE_USDC_ADDRESS ||
    srcChainId in STARGATE_USDT_ADDRESS
  ) {
    const srcBridgeToken =
      srcChainId in STARGATE_USDC
        ? STARGATE_USDC[srcChainId as keyof typeof STARGATE_USDC]
        : STARGATE_USDT[srcChainId as keyof typeof STARGATE_USDT]

    const usdPaths = srcChainPaths[srcBridgeToken.address as Address]

    const dstBridgeToken = usdPaths.find(
      (dstBridgeToken) => dstBridgeToken.chainId === dstChainId,
    )

    if (dstBridgeToken) {
      return {
        srcBridgeToken,
        dstBridgeToken,
      }
    }
  }

  return undefined
}
