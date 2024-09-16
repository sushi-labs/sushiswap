import { NativeAddress } from '@sushiswap/react-query'
import { stargateAdapterAbi_getFee } from 'sushi/abi'
import {
  STARGATE_ADAPTER_ADDRESS,
  STARGATE_CHAIN_ID,
  StargateAdapterChainId,
  isStargateAdapterChainId,
  publicClientConfig,
} from 'sushi/config'
import { RouteStatus, RouterLiquiditySource } from 'sushi/router'
import {
  createPublicClient,
  encodeAbiParameters,
  parseAbiParameters,
} from 'viem'
import {
  STARGATE_SLIPPAGE_PERCENTAGE,
  SushiXSwap2Adapter,
  SushiXSwapFunctionName,
  SushiXSwapTransactionType,
  applySlippage,
  encodeRouteProcessorArgs,
  encodeStargateTeleportParams,
  estimateStargateDstGas,
  getStargateBridgePath,
} from '../lib'
import {
  CrossChainTradeSchemaType,
  GetCrossChainTradeParams,
} from './getCrossChainTrade'
import { getStargateFees } from './getStargateFees'
import {
  SuccessfulTradeReturn,
  getTrade,
  isSuccessfulTradeReturn,
} from './getTrade'

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

    const _srcTrade = isSrcSwap
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

    if (isSrcSwap && !isSuccessfulTradeReturn(_srcTrade!)) {
      throw new Error('getStaragetCrossChainTrade: srcTrade failed')
    }

    const srcTrade = isSrcSwap
      ? (_srcTrade as SuccessfulTradeReturn)
      : undefined

    const bridgeFees = await getStargateFees({
      amount: isSrcSwap ? BigInt(srcTrade!.assumedAmountOut) : amount,
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
      Number(isSrcSwap ? srcTrade!.assumedAmountOut : amount)

    const srcAmountOut =
      (isSrcSwap ? BigInt(srcTrade!.assumedAmountOut) : amount) -
      bridgeFeeAmount

    const srcAmountOutMin = applySlippage(
      isSrcSwap
        ? applySlippage(srcTrade!.assumedAmountOut, slippagePercentage) -
            bridgeFeeAmount
        : srcAmountOut,
      STARGATE_SLIPPAGE_PERCENTAGE,
    )

    // adapted from amountSDtoLD in https://www.npmjs.com/package/@layerzerolabs/sg-sdk
    const dstAmountIn =
      (srcAmountOut * 10n ** BigInt(dstBridgeToken.decimals)) /
      10n ** BigInt(srcBridgeToken.decimals)
    const dstAmountInMin =
      (srcAmountOutMin * 10n ** BigInt(dstBridgeToken.decimals)) /
      10n ** BigInt(srcBridgeToken.decimals)

    const _dstTrade = isDstSwap
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

    if (isDstSwap && !isSuccessfulTradeReturn(_dstTrade!)) {
      throw new Error('getStaragetCrossChainTrade: dstTrade failed')
    }

    const dstTrade = isDstSwap
      ? (_dstTrade as SuccessfulTradeReturn)
      : undefined

    const dstAmountOut = isDstSwap
      ? BigInt(dstTrade!.assumedAmountOut)
      : dstAmountIn

    const dstAmountOutMin = isDstSwap
      ? applySlippage(dstTrade!.assumedAmountOut, slippagePercentage)
      : dstAmountInMin

    let priceImpact = bridgeImpact
    if (isSrcSwap) priceImpact += srcTrade!.priceImpact
    if (isDstSwap) priceImpact += dstTrade!.priceImpact

    if (!recipient) {
      return {
        adapter: SushiXSwap2Adapter.Stargate,
        status: RouteStatus.Success,
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
      }
    }

    let writeArgs
    let functionName
    let dstPayload
    let dstGasEst = 0n
    let transactionType

    if (!isSrcSwap && !isDstSwap) {
      transactionType = SushiXSwapTransactionType.Bridge
      functionName = SushiXSwapFunctionName.Bridge
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
    } else if (isSrcSwap && !isDstSwap) {
      const srcSwapData = encodeRouteProcessorArgs(
        srcTrade!.routeProcessorArgs!,
      )

      transactionType = SushiXSwapTransactionType.SwapAndBridge
      functionName = SushiXSwapFunctionName.SwapAndBridge
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
    } else if (!isSrcSwap) {
      const dstSwapData = encodeRouteProcessorArgs(
        dstTrade!.routeProcessorArgs!,
      )

      dstGasEst = estimateStargateDstGas(dstTrade!.gasSpent)

      dstPayload = encodeAbiParameters(
        parseAbiParameters('address, bytes, bytes'),
        [
          recipient,
          dstSwapData,
          '0x', // payloadData
        ],
      )

      transactionType = SushiXSwapTransactionType.BridgeAndSwap
      functionName = SushiXSwapFunctionName.Bridge
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
    } else if (isSrcSwap && isDstSwap) {
      const srcSwapData = encodeRouteProcessorArgs(
        srcTrade!.routeProcessorArgs!,
      )
      const dstSwapData = encodeRouteProcessorArgs(
        dstTrade!.routeProcessorArgs!,
      )

      dstPayload = encodeAbiParameters(
        parseAbiParameters('address, bytes, bytes'),
        [
          recipient, // to
          dstSwapData, // swapData
          '0x', // payloadData
        ],
      )
      dstGasEst = estimateStargateDstGas(dstTrade!.gasSpent)

      transactionType = SushiXSwapTransactionType.CrossChainSwap
      functionName = SushiXSwapFunctionName.SwapAndBridge
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

    let [lzFee] = await client.readContract({
      address: STARGATE_ADAPTER_ADDRESS[srcChainId as StargateAdapterChainId],
      abi: stargateAdapterAbi_getFee,
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

    // Add 20% buffer to LZ fee
    lzFee = (lzFee * 5n) / 4n

    const value =
      tokenIn.toLowerCase() === NativeAddress.toLowerCase()
        ? BigInt(amount) + lzFee
        : lzFee

    // est 500K gas for XSwapV2 call
    const srcGasEst = 500000n + BigInt(srcTrade?.gasSpent ?? 0)

    const srcGasFee = srcGasPrice ? srcGasPrice * srcGasEst : srcGasEst

    const gasSpent = srcGasFee + lzFee

    return {
      adapter: SushiXSwap2Adapter.Stargate,
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
      bridgeFee: lzFee.toString(),
      srcGasFee: srcGasFee.toString(),
      writeArgs,
      functionName,
      value: value ? value.toString() : '0',
    }
  } catch (e) {
    console.error(e)
    return {
      adapter: SushiXSwap2Adapter.Stargate,
      status: RouteStatus.NoWay,
    }
  }
}
