import { usePrice } from '@sushiswap/react-query'
import {
  STARGATE_BRIDGE_TOKENS,
  StargateChainId,
  isStargateBridgeToken,
} from '@sushiswap/stargate'
import {
  useBentoBoxTotals,
  useFeeData,
  usePools,
  useSushiXSwapContract,
} from '@sushiswap/wagmi'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import {
  Amount,
  Native,
  Price,
  Token,
  Type,
  WNATIVE_ADDRESS,
  tryParseAmount,
} from 'sushi/currency'
import { TradeType } from 'sushi/dex'
import { Fraction, ONE, Percent, ZERO } from 'sushi/math'
import { stringify } from 'viem'
import { getClientTrade } from './getClientTrade'

import { Action, SushiXSwap } from './SushiXSwap'
import { getBridgeFees } from './getBridgeFees'
import {
  UseCrossChainSelect,
  UseCrossChainTradeParams,
  UseCrossChainTradeQuerySelect,
} from './types'

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

const STARGATE_DEFAULT_SLIPPAGE = new Percent(100, 10_000) // 1%

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
    bentoboxSignature,
    tradeId,
  }: UseCrossChainTradeParams,
  select: UseCrossChainTradeQuerySelect,
) => {
  // First we'll check if bridge tokens for srcChainId includes srcToken, if so use srcToken as srcBridgeToken,
  // else take first stargate bridge token as srcBridgeToken
  const srcBridgeToken =
    token0?.isToken && isStargateBridgeToken(token0)
      ? token0
      : STARGATE_BRIDGE_TOKENS[network0]?.[0]

  // First we'll check if bridge tokens for dstChainId includes dstToken, if so use dstToken as dstBridgeToken,
  // else take first stargate bridge token as dstBridgeToken
  const dstBridgeToken =
    token1?.isToken && isStargateBridgeToken(token1)
      ? token1
      : STARGATE_BRIDGE_TOKENS[network1]?.[0]

  // A cross chain swap, a swap on the source and a swap on the destination
  const crossChainSwap =
    !isStargateBridgeToken(token0) && !isStargateBridgeToken(token1)

  // A regular bridge transfer, no swaps on either end
  const transfer =
    isStargateBridgeToken(token0) && isStargateBridgeToken(token1)

  // A swap transfer, a swap on the source, but not swap on the destination
  const swapTransfer =
    !isStargateBridgeToken(token0) && isStargateBridgeToken(token1)

  // A transfer swap, no swap on the source, but a swap on the destination
  const transferSwap =
    isStargateBridgeToken(token0) && !isStargateBridgeToken(token1)

  const srcCurrencyA = crossChainSwap || swapTransfer ? token0 : undefined
  const srcCurrencyB = crossChainSwap || swapTransfer ? srcBridgeToken : token1
  const dstCurrencyA =
    crossChainSwap || transferSwap ? dstBridgeToken : undefined
  const dstCurrencyB = crossChainSwap || transferSwap ? token1 : undefined

  const { data: srcPools } = usePools({
    chainId: network0,
    currencyA: srcCurrencyA,
    currencyB: srcCurrencyB,
    enabled,
  })
  const { data: dstPools } = usePools({
    chainId: network1,
    currencyA: dstCurrencyA,
    currencyB: dstCurrencyB,
    enabled,
  })

  const { data: srcFeeData } = useFeeData({ chainId: network0, enabled })
  const { data: dstFeeData } = useFeeData({ chainId: network1, enabled })
  const { data: srcRebases } = useBentoBoxTotals({
    chainId: network0,
    currencies: [token0, srcBridgeToken],
    enabled,
  })
  const { data: dstRebases } = useBentoBoxTotals({
    chainId: network1,
    currencies: [dstBridgeToken, token1],
    enabled,
  })

  const contract = useSushiXSwapContract(network0)

  const { data: feeData } = useFeeData({ chainId: network0, enabled: enabled })

  return useQuery({
    queryKey: [
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
        srcPools,
        dstPools,
        bentoboxSignature,
      },
    ],
    queryFn: async () => {
      const swapSlippage = slippagePercentage
        ? new Percent(
            Number(slippagePercentage === 'AUTO' ? 0.5 : slippagePercentage) *
              100,
            10_000,
          )
        : SWAP_DEFAULT_SLIPPAGE

      const srcTrade = await getClientTrade({
        chainId: network0,
        amount: crossChainSwap || swapTransfer ? amount : undefined,
        fromToken: srcCurrencyA,
        toToken: srcCurrencyB,
        pools: srcPools,
        feeData: srcFeeData,
        rebases: srcRebases,
      })

      const srcMinimumAmountOut = srcTrade?.minimumAmountOut(swapSlippage)

      const [eqFee, eqReward, lpFee, protocolFee] = await getBridgeFees({
        srcChainId: network0 as StargateChainId,
        dstChainId: network1 as StargateChainId,
        srcBridgeToken,
        dstBridgeToken,
        amount: crossChainSwap || swapTransfer ? srcMinimumAmountOut : amount,
      })

      let bridgeFee: Amount<Token> | undefined = undefined
      if (eqFee && eqReward && lpFee && protocolFee) {
        bridgeFee = eqFee.subtract(eqReward).add(lpFee).add(protocolFee)
      }

      const srcAmountMinusStargateFee =
        (transfer || transferSwap) && bridgeFee
          ? amount?.subtract(bridgeFee)
          : undefined
      const srcMinimumAmountOutMinusStargateFee =
        (crossChainSwap || swapTransfer) && bridgeFee
          ? srcMinimumAmountOut?.subtract(bridgeFee)
          : undefined

      let srcAmountOut: Amount<Type> | undefined
      if (transfer) {
        srcAmountOut = srcAmountMinusStargateFee
      } else if (transferSwap) {
        srcAmountOut = srcAmountMinusStargateFee
      } else if (swapTransfer) {
        srcAmountOut = srcMinimumAmountOutMinusStargateFee
      } else if (crossChainSwap) {
        srcAmountOut = srcMinimumAmountOutMinusStargateFee
      }

      const dstAmountIn = srcAmountOut
        ? tryParseAmount(
            srcAmountOut.toFixed(
              srcAmountOut.currency.decimals > dstBridgeToken.decimals
                ? dstBridgeToken.decimals
                : undefined,
            ),
            dstBridgeToken,
          )
        : undefined

      const dstTrade = await getClientTrade({
        chainId: network1,
        tradeType: TradeType.EXACT_INPUT,
        amount: crossChainSwap || transferSwap ? dstAmountIn : undefined,
        fromToken: dstCurrencyA,
        toToken: dstCurrencyB,
        pools: dstPools,
        feeData: dstFeeData,
        rebases: dstRebases,
      })

      // Output amount displayed... not including slippage for sameChainSwap, transferSwap, crossChainSwap
      let dstAmountOut: Amount<Type> | undefined
      if (transfer) {
        dstAmountOut = dstAmountIn
      } else if (swapTransfer) {
        dstAmountOut = dstAmountIn
      } else if (transferSwap) {
        dstAmountOut = dstTrade?.outputAmount
      } else if (crossChainSwap) {
        dstAmountOut = dstTrade?.outputAmount
      }

      let dstMinimumAmountOut: Amount<Type> | undefined
      if (transfer) {
        dstMinimumAmountOut = dstAmountIn
      } else if (swapTransfer) {
        dstMinimumAmountOut = dstAmountIn
      } else if (transferSwap) {
        dstMinimumAmountOut = dstTrade?.minimumAmountOut(swapSlippage)
      } else if (crossChainSwap) {
        dstMinimumAmountOut = dstTrade?.minimumAmountOut(swapSlippage)
      }

      const bridgeImpact =
        !bridgeFee || !amount || !srcMinimumAmountOut
          ? new Percent(0n, 10000n)
          : new Percent(
              bridgeFee.quotient,
              srcMinimumAmountOut
                ? srcMinimumAmountOut.quotient
                : amount.quotient,
            )

      let priceImpact: Percent
      if (transfer) {
        priceImpact = bridgeImpact
      } else if (crossChainSwap && srcTrade && dstTrade) {
        priceImpact = srcTrade.priceImpact
          .add(dstTrade.priceImpact)
          .add(bridgeImpact)
      } else if (transferSwap && !srcTrade && dstTrade) {
        priceImpact = dstTrade.priceImpact.add(bridgeImpact)
      } else if (swapTransfer && srcTrade && !dstTrade) {
        priceImpact = srcTrade.priceImpact.add(bridgeImpact)
      } else {
        priceImpact = new Percent(0n, 10000n)
      }

      // console.log({ recipient, amount, network0, network1, dstMinimumAmountOut, srcRebases, dstRebases, contract })
      const [srcInputCurrencyRebase, srcOutputCurrencyRebase] = srcRebases
        ? Object.values(srcRebases)
        : [undefined, undefined]
      const [, dstOutputCurrencyRebase] = dstRebases
        ? Object.values(dstRebases)
        : [undefined, undefined]

      if (
        !recipient ||
        !amount ||
        !network0 ||
        !network1 ||
        !dstMinimumAmountOut ||
        !srcInputCurrencyRebase ||
        !srcOutputCurrencyRebase ||
        !dstOutputCurrencyRebase ||
        !contract ||
        !token0 ||
        !token1 ||
        !feeData?.gasPrice
      ) {
        return {
          priceImpact: [
            priceImpact.numerator.toString(),
            priceImpact.denominator.toString(),
          ],
          amountIn: amount?.quotient.toString(),
          amountOut: dstAmountOut?.quotient.toString(),
          minAmountOut: dstMinimumAmountOut?.quotient.toString(),
          gasSpent: undefined,
          writeArgs: undefined,
          route: { status: '' },
          functionName: 'cook',
        } as UseCrossChainSelect
      }

      const srcShare = amount.toShare(srcInputCurrencyRebase)

      const sushiXSwap = new SushiXSwap({
        contract,
        srcToken: token0,
        dstToken: token1,
        srcTrade,
        dstTrade,
        srcUseBentoBox: false,
        dstUseBentoBox: false,
        user: recipient,
        debug: true,
      })

      if (bentoboxSignature) {
        sushiXSwap.srcCooker.setMasterContractApproval(bentoboxSignature)
      }

      if (transfer) {
        sushiXSwap.transfer(amount, srcShare)
      } else if (
        (srcTrade?.route.legs.length && srcMinimumAmountOut) ||
        (dstTrade?.route.legs.length && dstMinimumAmountOut)
      ) {
        sushiXSwap.crossChainSwap({
          srcAmount: amount,
          srcShare,
          srcMinimumAmountOut,
          srcMinimumShareOut: srcMinimumAmountOut?.toShare(
            srcOutputCurrencyRebase,
          ),
          dstMinimumAmountOut,
          dstMinimumShareOut: dstMinimumAmountOut?.toShare(
            dstOutputCurrencyRebase,
          ),
        })
      }

      if (srcAmountOut && dstAmountIn) {
        const slippageAdjustedAmountOut = new Fraction(ONE)
          .add(STARGATE_DEFAULT_SLIPPAGE)
          .invert()
          .multiply(srcAmountOut.quotient).quotient

        const amountMin = Amount.fromRawAmount(
          srcAmountOut.currency,
          slippageAdjustedAmountOut,
        )

        sushiXSwap.teleport(
          srcBridgeToken,
          dstBridgeToken,
          dstTrade ? dstTrade.route.gasSpent + 1000000 : undefined,
          tradeId,
          amountMin,
        )
      }

      if (!sushiXSwap.srcCooker.actions.includes(Action.STARGATE_TELEPORT))
        throw new Error('Stargate teleport action not included')

      const gasBuffer = 1_000_000

      const [fee] = await sushiXSwap.getFee(
        dstTrade ? dstTrade.route.gasSpent + gasBuffer : undefined,
      )

      const value = sushiXSwap.srcCooker.values.reduce((a, b) => a + b, fee)

      const srcTypicalGasCost = 600_000
      const srcTradeGasSpent = srcTrade?.route?.gasSpent || 0

      // Needs to be parsed to string because react-query entities are serialized to cache
      return {
        priceImpact: [
          priceImpact.numerator.toString(),
          priceImpact.denominator.toString(),
        ],
        amountIn: amount.quotient.toString(),
        amountOut: dstAmountOut?.quotient.toString(),
        minAmountOut: dstMinimumAmountOut?.quotient.toString(),
        // gasSpent: gasSpent.toString(),
        gasSpent: Amount.fromRawAmount(
          Native.onChain(network0),
          feeData.gasPrice * BigInt(srcTypicalGasCost + srcTradeGasSpent) + fee,
        ).toSignificant(4),
        writeArgs: [
          sushiXSwap.srcCooker.actions,
          sushiXSwap.srcCooker.values,
          sushiXSwap.srcCooker.datas,
        ],
        route: {
          status: '',
        },
        functionName: 'cook',
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
      Boolean(
        network0 &&
          network1 &&
          token0 &&
          token1 &&
          amount &&
          srcFeeData &&
          dstFeeData &&
          srcPools &&
          dstPools &&
          srcRebases &&
          dstRebases,
      ),
    queryKeyHashFn: stringify,
  })
}

export const useCrossChainTrade = (variables: UseCrossChainTradeParams) => {
  const { token0, token1 } = variables
  const { data: price } = usePrice({
    chainId: variables.network0,
    address: WNATIVE_ADDRESS[variables.network0],
  })
  const { data: feeData } = useFeeData({
    chainId: variables.network0,
    enabled: variables.enabled,
  })
  const select: UseCrossChainTradeQuerySelect = useCallback(
    (data) => {
      const amountIn =
        data.amountIn && token0
          ? Amount.fromRawAmount(token0, data.amountIn)
          : undefined
      const amountOut =
        data.amountOut && token1
          ? Amount.fromRawAmount(token1, data.amountOut)
          : undefined
      const minAmountOut =
        data.minAmountOut && token1
          ? Amount.fromRawAmount(token1, data.minAmountOut)
          : undefined
      const swapPrice =
        amountIn && amountOut
          ? new Price({ baseAmount: amountIn, quoteAmount: amountOut })
          : undefined
      const priceImpact = data.priceImpact
        ? new Percent(BigInt(data.priceImpact[0]), BigInt(data.priceImpact[1]))
        : undefined

      if (
        data?.gasSpent &&
        feeData?.gasPrice &&
        amountIn &&
        amountOut &&
        data.priceImpact &&
        data.minAmountOut
      ) {
        return {
          ...data,
          route: {
            status: amountIn?.greaterThan(ZERO) && !amountOut ? 'NoWay' : '',
          },
          gasSpent: data.gasSpent,
          // gasSpent: Amount.fromRawAmount(
          //   Native.onChain(variables?.network0),
          //   JSBI.multiply(JSBI.BigInt(feeData.gasPrice), JSBI.BigInt(data.gasSpent))
          // ).toSignificant(4),
          // gasSpentUsd:
          //   data.gasSpent && price
          //     ? Amount.fromRawAmount(Native.onChain(variables.network0), data.gasSpent)
          //         .multiply(price.asFraction)
          //         .toSignificant(4)
          //     : undefined,
          swapPrice,
          priceImpact,
          amountIn,
          amountOut,
          minAmountOut,
        }
      }

      return {
        swapPrice,
        priceImpact,
        amountIn,
        amountOut,
        minAmountOut,
        gasSpent: undefined,
        gasSpentUsd: undefined,
        writeArgs: undefined,
        route: {
          status: amountIn?.greaterThan(ZERO) && !amountOut ? 'NoWay' : '',
        },
        functionName: 'cook',
        overrides: undefined,
      }
    },
    [feeData?.gasPrice, token0, token1],
  )

  return useCrossChainTradeQuery(variables, select)
}
