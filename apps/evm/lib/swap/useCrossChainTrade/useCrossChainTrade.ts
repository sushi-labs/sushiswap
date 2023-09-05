import { Amount, Currency, Native, Price, tryParseAmount } from '@sushiswap/currency'
import { Percent, ZERO } from '@sushiswap/math'
import { STARGATE_CHAIN_ID } from '@sushiswap/stargate'
import { useFeeData, watchNetwork, readContract } from '@sushiswap/wagmi'
import { useClientTrade } from '@sushiswap/wagmi/future/hooks'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTrade as useApiTrade } from '@sushiswap/react-query'
import { log } from 'next-axiom'
import { UseCrossChainSelect, UseCrossChainTradeParams, UseCrossChainTradeQuerySelect } from './types'
import { stargateAdapterAbi } from '@sushiswap/abi'
import { encodeSwapData, getBridgeParams, ProcessRouteInput, TransactionType } from './SushiXSwapV2'
import { RouterLiquiditySource } from '@sushiswap/router'
import { useBridgeFees } from './useBridgeFees'
import { isSwapApiEnabledChainId } from 'config'
import { encodeStargateTeleportParams, estimateStargateDstGas, stargateAdapterAddress } from './StargateAdapter'
import { encodeAbiParameters, parseAbiParameters, stringify } from 'viem'
import { useStargatePath } from './useStargatePath'

const SWAP_API_BASE_URL = process.env.SWAP_API_V0_BASE_URL || process.env.NEXT_PUBLIC_SWAP_API_V0_BASE_URL

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
  const [isFallback, setIsFallback] = useState(
    !isSwapApiEnabledChainId(network0) ||
      !isSwapApiEnabledChainId(network1) ||
      (isSwapApiEnabledChainId(network0) &&
        isSwapApiEnabledChainId(network1) &&
        typeof SWAP_API_BASE_URL === 'undefined')
  )

  // Reset the fallback on network switch
  useEffect(() => {
    const unwatch = watchNetwork(({ chain }) => {
      if (chain) {
        const shouldFallback =
          !isSwapApiEnabledChainId(chain.id) ||
          !isSwapApiEnabledChainId(network1) ||
          (isSwapApiEnabledChainId(chain.id) &&
            isSwapApiEnabledChainId(network1) &&
            typeof SWAP_API_BASE_URL === 'undefined')

        setIsFallback(shouldFallback)
      }
    })

    return () => unwatch()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data: feeData0 } = useFeeData({ chainId: network0 })
  const { data: feeData1 } = useFeeData({ chainId: network1 })

  const { data: stargatePath } = useStargatePath({ srcCurrency: token0, dstCurrency: token1, enabled })

  const isSrcSwap = Boolean(token0 && stargatePath?.srcBridgeToken && !token0.equals(stargatePath.srcBridgeToken))
  const isDstSwap = Boolean(token1 && stargatePath?.dstBridgeToken && !token1.equals(stargatePath.dstBridgeToken))

  const srcApiTrade = useApiTrade({
    chainId: network0,
    fromToken: token0,
    toToken: stargatePath?.srcBridgeToken,
    amount,
    slippagePercentage,
    gasPrice: feeData0?.gasPrice,
    recipient: stargateAdapterAddress[network0],
    enabled: Boolean(isSrcSwap && enabled && !isFallback && amount),
    carbonOffset: false,
    source: RouterLiquiditySource.Self,
    onError: () => {
      log.error('xswap src swap api error')
      setIsFallback(true)
    },
  })

  const srcClientTrade = useClientTrade({
    chainId: network0,
    fromToken: token0,
    toToken: stargatePath?.srcBridgeToken,
    amount,
    slippagePercentage,
    gasPrice: feeData0?.gasPrice,
    recipient: stargateAdapterAddress[network0],
    enabled: Boolean(isSrcSwap && enabled && isFallback && amount),
    carbonOffset: false,
    source: RouterLiquiditySource.Self,
  }) as ReturnType<typeof useApiTrade>

  const { data: srcTrade } = isFallback ? srcClientTrade : srcApiTrade

  const { data: bridgeFees } = useBridgeFees({
    amount: isSrcSwap ? srcTrade?.amountOut : amount,
    srcChainId: network0,
    dstChainId: network1,
    srcBridgeToken: stargatePath?.srcBridgeToken,
    dstBridgeToken: stargatePath?.dstBridgeToken,
    enabled: Boolean(stargatePath && enabled),
  })

  const { srcAmountOut, srcMinimumAmountOut, dstAmountIn, bridgeFee } = useMemo(() => {
    if (!bridgeFees || !stargatePath)
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

    const srcAmountOut = bridgeFee
      ? isSrcSwap
        ? srcMinimumAmountOut?.subtract(bridgeFee)
        : amount?.subtract(bridgeFee)
      : undefined

    const dstAmountIn = srcAmountOut
      ? tryParseAmount(
          srcAmountOut.toFixed(
            srcAmountOut.currency.decimals > stargatePath.dstBridgeToken.decimals
              ? stargatePath.dstBridgeToken.decimals
              : undefined
          ),
          stargatePath.dstBridgeToken
        )
      : undefined

    return { srcAmountOut, srcMinimumAmountOut, dstAmountIn, bridgeFee }
  }, [bridgeFees, stargatePath, isSrcSwap, srcTrade?.minAmountOut, amount])

  const dstApiTrade = useApiTrade({
    chainId: network1,
    amount: dstAmountIn,
    fromToken: stargatePath?.dstBridgeToken,
    toToken: token1,
    slippagePercentage,
    gasPrice: feeData1?.gasPrice,
    recipient,
    enabled: Boolean(isDstSwap && enabled && !isFallback && dstAmountIn),
    carbonOffset: false,
    source: RouterLiquiditySource.Self,
    onError: () => {
      log.error('xswap dst swap api error')
      setIsFallback(true)
    },
  })

  const dstClientTrade = useClientTrade({
    chainId: network1,
    amount: dstAmountIn,
    fromToken: stargatePath?.dstBridgeToken,
    toToken: token1,
    slippagePercentage,
    gasPrice: feeData1?.gasPrice,
    recipient,
    enabled: Boolean(isDstSwap && enabled && isFallback && dstAmountIn),
    carbonOffset: false,
    source: RouterLiquiditySource.Self,
  }) as ReturnType<typeof useApiTrade>

  const { data: dstTrade } = isFallback ? dstClientTrade : dstApiTrade

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
        stargatePath,
        srcTrade,
        dstTrade,
      },
    ],
    queryFn: async () => {
      if (!(network0 && network1 && token0 && token1 && amount && slippagePercentage && stargatePath && bridgeFees)) {
        throw new Error('useCrossChainTrade should not be enabled')
      }

      const { srcBridgeToken, dstBridgeToken } = stargatePath

      const dstAmountOut = isDstSwap ? dstTrade?.amountOut : dstAmountIn

      const dstMinimumAmountOut = isDstSwap ? dstTrade?.minAmountOut : dstAmountIn

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
        transactionType = TransactionType.Bridge
        functionName = 'bridge'
        writeArgs = [
          getBridgeParams({
            adapter: stargateAdapterAddress[network0],
            amountIn: amount,
            to: recipient,
            adapterData: encodeStargateTeleportParams({
              srcBridgeToken,
              dstBridgeToken,
              amount: amount.quotient.toString(),
              amountMin: srcAmountOut.quotient.toString(),
              dustAmount: 0,
              receiver: recipient, // receivier is recipient because no dstPayload
              to: recipient,
              gas: dstGasEstimate,
            }),
          }),
          recipient, // refundAddress
          '0x', // swapPayload
          '0x', // payloadData
        ]
      } else if (isSrcSwap && !isDstSwap && srcTrade?.minAmountOut) {
        const srcSwapData = encodeSwapData(srcTrade.writeArgs as ProcessRouteInput)

        transactionType = TransactionType.SwapAndBridge
        functionName = 'swapAndBridge'
        writeArgs = [
          getBridgeParams({
            adapter: stargateAdapterAddress[network0],
            amountIn: amount,
            to: recipient,
            adapterData: encodeStargateTeleportParams({
              srcBridgeToken,
              dstBridgeToken,
              amount: 0, // set to 0, so RP will transfer all
              amountMin: srcTrade.minAmountOut.quotient.toString(),
              dustAmount: 0,
              receiver: recipient, // receivier is recipient because no dstPayload
              to: recipient,
              gas: dstGasEstimate,
            }),
          }),
          recipient, // refundAddress
          srcSwapData,
          '0x',
          '0x',
        ]
      } else if (!isSrcSwap && isDstSwap && dstTrade?.writeArgs) {
        const dstSwapData = encodeSwapData(dstTrade.writeArgs as ProcessRouteInput)
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
            adapter: stargateAdapterAddress[network0],
            amountIn: amount,
            to: recipient,
            adapterData: encodeStargateTeleportParams({
              srcBridgeToken: srcBridgeToken,
              dstBridgeToken: dstBridgeToken,
              amount: amount.quotient.toString(),
              amountMin: srcAmountOut.quotient.toString(),
              dustAmount: 0,
              receiver: stargateAdapterAddress[network1],
              to: recipient,
              gas: dstGasEstimate,
            }),
          }),
          recipient, // refundAddress
          dstSwapData,
          '0x', // dstPayload
        ]
      } else if (isSrcSwap && isDstSwap && srcTrade?.minAmountOut && dstTrade) {
        const srcSwapData = encodeSwapData(srcTrade.writeArgs as ProcessRouteInput)
        const dstSwapData = encodeSwapData(dstTrade.writeArgs as ProcessRouteInput)

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
            adapter: stargateAdapterAddress[network0],
            amountIn: amount,
            to: recipient,
            adapterData: encodeStargateTeleportParams({
              srcBridgeToken,
              dstBridgeToken,
              amount: 0, // set to 0 so RP will transfer all
              amountMin: srcTrade.minAmountOut.quotient.toString(),
              dustAmount: 0,
              receiver: stargateAdapterAddress[network1],
              to: recipient,
              gas: dstGasEstimate,
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
        address: stargateAdapterAddress[network0],
        abi: stargateAdapterAbi,
        functionName: 'getFee',
        args: [
          STARGATE_CHAIN_ID[network1], // dstChain
          1, // functionType
          isDstSwap ? stargateAdapterAddress[network1] : recipient, // receiver
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
      Boolean(network0 && network1 && token0 && token1 && amount && bridgeFees && stargatePath) &&
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
