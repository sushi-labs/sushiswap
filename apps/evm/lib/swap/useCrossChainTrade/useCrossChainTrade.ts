import { Amount, Currency, Native, Price, tryParseAmount } from '@sushiswap/currency'
import { Fraction, ONE, Percent, ZERO } from '@sushiswap/math'
import { STARGATE_CHAIN_ID } from '@sushiswap/stargate'
import { useFeeData, readContract } from '@sushiswap/wagmi'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useTrade as useApiTrade } from '@sushiswap/react-query'
import { log } from 'next-axiom'
import { UseCrossChainSelect, UseCrossChainTradeParams, UseCrossChainTradeQuerySelect } from './types'
import { stargateAdapterAbi } from '@sushiswap/abi'
import {
  encodeSwapData,
  getBridgeParams,
  TransactionType,
  encodeStargateTeleportParams,
  estimateStargateDstGas,
  STARGATE_ADAPTER_ADDRESS,
  STARGATE_DEFAULT_SLIPPAGE,
  getStargateBridgePath,
} from '@sushiswap/sushixswap-sdk'
import { RouterLiquiditySource } from '@sushiswap/router'
import { useStargateBridgeFees } from './useStargateBridgeFees'
import { encodeAbiParameters, parseAbiParameters, stringify } from 'viem'

export const useCrossChainTradeQuery = (
  {
    network0,
    network1,
    token0,
    token1,
    amount,
    slippagePercentage,
    recipient,
    enabled,
    tradeId,
  }: UseCrossChainTradeParams,
  select: UseCrossChainTradeQuerySelect
) => {
  const { data: feeData0 } = useFeeData({ chainId: network0, enabled })
  const { data: feeData1 } = useFeeData({ chainId: network1, enabled })

  const bridgePath = useMemo(
    () => (!enabled || !token0 || !token1 ? undefined : getStargateBridgePath(token0, token1)),
    [enabled, token0, token1]
  )

  const isSrcSwap = Boolean(token0 && bridgePath?.srcBridgeToken && !token0.equals(bridgePath.srcBridgeToken))
  const isDstSwap = Boolean(token1 && bridgePath?.dstBridgeToken && !token1.equals(bridgePath.dstBridgeToken))

  const { data: srcTrade } = useApiTrade({
    chainId: network0,
    fromToken: token0,
    toToken: bridgePath?.srcBridgeToken,
    amount,
    slippagePercentage,
    gasPrice: feeData0?.gasPrice,
    recipient: STARGATE_ADAPTER_ADDRESS[network0],
    enabled: Boolean(isSrcSwap && enabled && amount),
    carbonOffset: false,
    source: RouterLiquiditySource.XSwap,
    onError: () => {
      log.error('xswap src swap api error')
    },
  })

  const { data: bridgeFees } = useStargateBridgeFees({
    amount: isSrcSwap ? srcTrade?.amountOut : amount,
    srcChainId: network0,
    dstChainId: network1,
    srcBridgeToken: bridgePath?.srcBridgeToken,
    dstBridgeToken: bridgePath?.dstBridgeToken,
    enabled: Boolean(bridgePath && enabled),
  })

  const { srcAmountOut, srcMinimumAmountOut, dstAmountIn, bridgeFee } = useMemo(() => {
    if (!bridgeFees || !bridgePath)
      return {
        srcAmountOut: undefined,
        srcMinimumAmountOut: undefined,
        dstAmountIn: undefined,
        bridgeFee: undefined,
      }

    const [eqFee, eqReward, lpFee, protocolFee] = bridgeFees
    const srcMinimumAmountOut = isSrcSwap ? srcTrade?.minAmountOut : amount

    let bridgeFee: Amount<Currency> | undefined = undefined
    if (eqFee && eqReward && lpFee && protocolFee) {
      bridgeFee = eqFee.subtract(eqReward).add(lpFee).add(protocolFee)
    }

    const srcAmountOut = bridgeFee ? (isSrcSwap ? srcTrade?.amountOut : amount)?.subtract(bridgeFee) : undefined

    const dstAmountIn = srcAmountOut
      ? tryParseAmount(
          srcAmountOut.toFixed(
            srcAmountOut.currency.decimals > bridgePath.dstBridgeToken.decimals
              ? bridgePath.dstBridgeToken.decimals
              : undefined
          ),
          bridgePath.dstBridgeToken
        )
      : undefined

    return { srcAmountOut, srcMinimumAmountOut, dstAmountIn, bridgeFee }
  }, [bridgeFees, bridgePath, isSrcSwap, srcTrade?.minAmountOut, srcTrade?.amountOut, amount])

  const { data: dstTrade } = useApiTrade({
    chainId: network1,
    amount: dstAmountIn,
    fromToken: bridgePath?.dstBridgeToken,
    toToken: token1,
    slippagePercentage,
    gasPrice: feeData1?.gasPrice,
    recipient,
    enabled: Boolean(isDstSwap && enabled && dstAmountIn),
    carbonOffset: false,
    source: RouterLiquiditySource.XSwap,
    onError: () => {
      log.error('xswap dst swap api error')
    },
  })

  return useQuery({
    queryKey: [
      'NoPersist',
      'crossChainTrade',
      {
        tradeId,
        token0,
        token1,
        network0,
        network1,
        amount,
        slippagePercentage,
        recipient,
        bridgePath,
        srcTrade,
        dstTrade,
      },
    ],
    queryFn: async () => {
      if (!(network0 && network1 && token0 && token1 && amount && slippagePercentage && bridgePath && bridgeFees)) {
        throw new Error('useCrossChainTrade should not be enabled')
      }

      const { srcBridgeToken, dstBridgeToken } = bridgePath

      const dstAmountOut = isDstSwap ? dstTrade?.amountOut : dstAmountIn

      const dstMinimumAmountOut = isDstSwap
        ? dstTrade?.minAmountOut
        : dstAmountIn
        ? new Fraction(ONE).add(STARGATE_DEFAULT_SLIPPAGE).invert().multiply(dstAmountIn.quotient)
        : undefined

      const bridgeImpact =
        !bridgeFee || !amount || !srcMinimumAmountOut
          ? new Percent(0n, 10000n)
          : new Percent(bridgeFee.quotient, srcMinimumAmountOut ? srcMinimumAmountOut.quotient : amount.quotient)

      let priceImpact = bridgeImpact
      if (isSrcSwap) priceImpact = priceImpact.add(srcTrade?.priceImpact ?? 0)
      if (isDstSwap) priceImpact = priceImpact.add(dstTrade?.priceImpact ?? 0)

      if (!recipient || !amount || !network0 || !network1 || !token0 || !token1 || !srcAmountOut) {
        return {
          transactionType: undefined,
          srcBridgeToken: undefined,
          dstBridgeToken: undefined,
          priceImpact: [priceImpact?.numerator.toString(), priceImpact?.denominator.toString()],
          amountIn: amount?.quotient.toString(),
          amountOut: dstAmountOut?.quotient.toString(),
          minAmountOut: dstMinimumAmountOut?.quotient.toString(),
          gasSpent: undefined,
          writeArgs: undefined,
          route: { status: '' },
          functionName: 'sendMessage',
          value: undefined,
        } as UseCrossChainSelect
      }

      let writeArgs
      let functionName
      let dstPayload = encodeAbiParameters(parseAbiParameters('address, bytes, bytes'), [recipient, '0x', '0x'])
      let dstGasEstimate = ZERO
      let transactionType

      if (!isSrcSwap && !isDstSwap) {
        const amountMin = new Fraction(ONE)
          .add(STARGATE_DEFAULT_SLIPPAGE)
          .invert()
          .multiply(srcAmountOut.quotient).quotient

        transactionType = TransactionType.Bridge
        functionName = 'bridge'
        writeArgs = [
          getBridgeParams({
            adapter: STARGATE_ADAPTER_ADDRESS[network0],
            amountIn: amount,
            to: recipient,
            adapterData: encodeStargateTeleportParams({
              srcBridgeToken,
              dstBridgeToken,
              amount: amount.quotient,
              amountMin,
              dustAmount: 0,
              receiver: recipient, // receivier is recipient because no dstPayload
              to: recipient,
              dstGas: dstGasEstimate,
            }),
          }),
          recipient, // refundAddress
          '0x', // swapPayload
          '0x', // payloadData
        ]
      } else if (isSrcSwap && !isDstSwap && srcTrade?.minAmountOut) {
        const srcSwapData = encodeSwapData(srcTrade.writeArgs as Parameters<typeof encodeSwapData>[0])
        const amountMin = new Fraction(ONE)
          .add(STARGATE_DEFAULT_SLIPPAGE)
          .invert()
          .multiply(srcTrade.minAmountOut.quotient).quotient

        transactionType = TransactionType.SwapAndBridge
        functionName = 'swapAndBridge'
        writeArgs = [
          getBridgeParams({
            adapter: STARGATE_ADAPTER_ADDRESS[network0],
            amountIn: amount,
            to: recipient,
            adapterData: encodeStargateTeleportParams({
              srcBridgeToken,
              dstBridgeToken,
              amount: 0,
              amountMin,
              dustAmount: 0,
              receiver: recipient, // receivier is recipient because no dstPayload
              to: recipient,
              dstGas: dstGasEstimate,
            }),
          }),
          recipient, // refundAddress
          srcSwapData,
          '0x',
          '0x',
        ]
      } else if (!isSrcSwap && isDstSwap && dstTrade?.writeArgs) {
        const dstSwapData = encodeSwapData(dstTrade.writeArgs as Parameters<typeof encodeSwapData>[0])
        const amountMin = new Fraction(ONE)
          .add(STARGATE_DEFAULT_SLIPPAGE)
          .invert()
          .multiply(srcAmountOut.quotient).quotient

        dstGasEstimate = estimateStargateDstGas(dstTrade.route?.gasSpent ?? 0)

        dstPayload = encodeAbiParameters(parseAbiParameters('address, bytes, bytes'), [
          recipient,
          dstSwapData,
          '0x', // payloadData
        ])

        transactionType = TransactionType.BridgeAndSwap
        functionName = 'bridge'
        writeArgs = [
          getBridgeParams({
            adapter: STARGATE_ADAPTER_ADDRESS[network0],
            amountIn: amount,
            to: recipient,
            adapterData: encodeStargateTeleportParams({
              srcBridgeToken: srcBridgeToken,
              dstBridgeToken: dstBridgeToken,
              amount: amount.quotient,
              amountMin,
              dustAmount: 0,
              receiver: STARGATE_ADAPTER_ADDRESS[network1],
              to: recipient,
              dstGas: dstGasEstimate,
            }),
          }),
          recipient, // refundAddress
          dstSwapData,
          '0x', // dstPayload
        ]
      } else if (isSrcSwap && isDstSwap && srcTrade?.minAmountOut && dstTrade) {
        const srcSwapData = encodeSwapData(srcTrade.writeArgs as Parameters<typeof encodeSwapData>[0])
        const dstSwapData = encodeSwapData(dstTrade.writeArgs as Parameters<typeof encodeSwapData>[0])
        const amountMin = new Fraction(ONE)
          .add(STARGATE_DEFAULT_SLIPPAGE)
          .invert()
          .multiply(srcTrade.minAmountOut.quotient).quotient

        dstPayload = encodeAbiParameters(parseAbiParameters('address, bytes, bytes'), [
          recipient, // to
          dstSwapData, // swapData
          '0x', // payloadData
        ])
        dstGasEstimate = estimateStargateDstGas(dstTrade.route?.gasSpent ?? 0)

        transactionType = TransactionType.CrossChainSwap
        functionName = 'swapAndBridge'
        writeArgs = [
          getBridgeParams({
            adapter: STARGATE_ADAPTER_ADDRESS[network0],
            amountIn: amount,
            to: recipient,
            adapterData: encodeStargateTeleportParams({
              srcBridgeToken,
              dstBridgeToken,
              amount: 0,
              amountMin,
              dustAmount: 0,
              receiver: STARGATE_ADAPTER_ADDRESS[network1],
              to: recipient,
              dstGas: dstGasEstimate,
            }),
          }),
          recipient, // refundAddress
          srcSwapData, //srcSwapPayload
          dstSwapData, // dstPayload
          '0x',
        ]
      } else {
        throw new Error('Crosschain swap not found.')
      }

      // need async to get fee for final value... this should be moved to exec?
      const [fee] = (await readContract({
        address: STARGATE_ADAPTER_ADDRESS[network0],
        abi: stargateAdapterAbi,
        functionName: 'getFee',
        args: [
          STARGATE_CHAIN_ID[network1], // dstChain
          1, // functionType
          isDstSwap ? STARGATE_ADAPTER_ADDRESS[network1] : recipient, // receiver
          dstGasEstimate, // gasAmount
          0, // dustAmount
          isDstSwap ? dstPayload : '0x', // payload
        ],
        chainId: network0,
      })) as [bigint]

      // Add 20% buffer to STG fee
      const value = amount.currency.isNative ? BigInt(amount.quotient.toString()) + (fee * 5n) / 4n : (fee * 5n) / 4n

      // est 500K gas for XSwapV2 call
      const gasEst = 500000n + BigInt(srcTrade?.route?.gasSpent ?? 0)

      const gasSpent = Amount.fromRawAmount(Native.onChain(network0), fee + gasEst * BigInt(feeData0?.gasPrice ?? 0))

      // Needs to be parsed to string because react-query entities are serialized to cache
      return {
        transactionType,
        srcBridgeToken,
        dstBridgeToken,
        priceImpact: [priceImpact?.numerator.toString(), priceImpact?.denominator.toString()],
        amountIn: amount.quotient.toString(),
        amountOut: dstAmountOut?.quotient.toString(),
        minAmountOut: dstMinimumAmountOut?.quotient.toString(),
        gasSpent: gasSpent.toSignificant(4),
        writeArgs,
        route: {
          status: '',
        },
        functionName,
        value,
      } as UseCrossChainSelect
    },
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
    keepPreviousData: false,
    cacheTime: 0,
    select,
    enabled:
      enabled &&
      Boolean(network0 && network1 && token0 && token1 && amount && bridgeFees && bridgePath) &&
      (isSrcSwap ? Boolean(srcTrade) : true) &&
      (isDstSwap ? Boolean(dstTrade) : true),
    queryKeyHashFn: stringify,
  })
}

export const useCrossChainTrade = (variables: UseCrossChainTradeParams) => {
  const { token0, token1 } = variables

  const select = useCallback(
    (data) => {
      const amountIn = data.amountIn && token0 ? Amount.fromRawAmount(token0, data.amountIn) : undefined
      const amountOut = data.amountOut && token1 ? Amount.fromRawAmount(token1, data.amountOut) : undefined
      const minAmountOut = data.minAmountOut && token1 ? Amount.fromRawAmount(token1, data.minAmountOut) : undefined
      const swapPrice = amountIn && amountOut ? new Price({ baseAmount: amountIn, quoteAmount: amountOut }) : undefined
      const priceImpact = data.priceImpact ? new Percent(data.priceImpact[0], data.priceImpact[1]) : undefined

      if (data && amountIn && amountOut && data.priceImpact && data.minAmountOut) {
        return {
          ...data,
          route: {
            status: amountIn?.greaterThan(ZERO) && !amountOut ? 'NoWay' : '',
          },
          gasSpent: data.gasSpent,
          swapPrice,
          priceImpact,
          amountIn,
          amountOut,
          minAmountOut,
        }
      } else {
        return {
          swapPrice,
          priceImpact,
          amountIn,
          amountOut,
          minAmountOut,
          gasSpent: undefined,
          writeArgs: undefined,
          route: {
            status: amountIn?.greaterThan(ZERO) && !amountOut ? 'NoWay' : '',
          },
          functionName: 'sendMessage',
          value: undefined,
        }
      }
    },
    [token0, token1, variables.network0, variables.network1]
  ) as UseCrossChainTradeQuerySelect

  return useCrossChainTradeQuery(variables, select)
}
