import { TradeType } from '@sushiswap/amm'
import { isStargateBridgeToken, STARGATE_BRIDGE_TOKENS, StargateChainId } from '@sushiswap/stargate'
import { useSushiXSwapContract } from '@sushiswap/wagmi'
import { JSBI, Percent } from '@sushiswap/math'
import { Amount, Price, Token, tryParseAmount, Type } from '@sushiswap/currency'
import { nanoid } from 'nanoid'
import { useQuery } from '@tanstack/react-query'
import { getTrade } from './getTrade'
import { getBridgeFees } from './getBridgeFees'
import { SushiXSwap } from '../SushiXSwap'
import { useCallback } from 'react'
import { UseCrossChainSelect, UseCrossChainTradeParams, UseCrossChainTradeQuerySelect } from './types'
import { usePools } from './usePools'
import { useFeeData } from 'wagmi'
import { useBentoboxTotals } from './useRebases'

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

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
  }: UseCrossChainTradeParams,
  select: UseCrossChainTradeQuerySelect
) => {
  // First we'll check if bridge tokens for srcChainId includes srcToken, if so use srcToken as srcBridgeToken,
  // else take first stargate bridge token as srcBridgeToken
  const srcBridgeToken = token0.isToken && isStargateBridgeToken(token0) ? token0 : STARGATE_BRIDGE_TOKENS[network0][0]

  // First we'll check if bridge tokens for dstChainId includes dstToken, if so use dstToken as dstBridgeToken,
  // else take first stargate bridge token as dstBridgeToken
  const dstBridgeToken = token1.isToken && isStargateBridgeToken(token1) ? token1 : STARGATE_BRIDGE_TOKENS[network1][0]

  // A cross chain swap, a swap on the source and a swap on the destination
  const crossChainSwap = !isStargateBridgeToken(token0) && !isStargateBridgeToken(token1)

  // A regular bridge transfer, no swaps on either end
  const transfer = isStargateBridgeToken(token0) && isStargateBridgeToken(token1)

  // A swap transfer, a swap on the source, but not swap on the destination
  const swapTransfer = !isStargateBridgeToken(token0) && isStargateBridgeToken(token1)

  // A transfer swap, no swap on the source, but a swap on the destination
  const transferSwap = isStargateBridgeToken(token0) && !isStargateBridgeToken(token1)

  const srcCurrencyA = crossChainSwap || swapTransfer ? token0 : undefined
  const srcCurrencyB = crossChainSwap || swapTransfer ? srcBridgeToken : token1
  const dstCurrencyA = crossChainSwap || transferSwap ? dstBridgeToken : undefined
  const dstCurrencyB = crossChainSwap || transferSwap ? token1 : undefined

  const { data: srcPools } = usePools({ chainId: network0, currencyA: srcCurrencyA, currencyB: srcCurrencyB })
  const { data: dstPools } = usePools({ chainId: network1, currencyA: dstCurrencyA, currencyB: dstCurrencyB })
  const { data: srcFeeData } = useFeeData({ chainId: network0 })
  const { data: dstFeeData } = useFeeData({ chainId: network1 })
  const { data: srcRebases } = useBentoboxTotals({ chainId: network0, currencies: [srcCurrencyA, srcCurrencyB] })
  const { data: dstRebases } = useBentoboxTotals({ chainId: network1, currencies: [dstCurrencyA, dstCurrencyB] })

  const contract = useSushiXSwapContract(network0)

  return useQuery({
    queryKey: ['crossChainTrade', { network0, network1, token0, token1, amount, slippagePercentage, recipient }],
    queryFn: async () => {
      const swapSlippage = slippagePercentage
        ? new Percent(Number(slippagePercentage === 'AUTO' ? 0.5 : slippagePercentage) * 100, 10_000)
        : SWAP_DEFAULT_SLIPPAGE

      const srcTrade = await getTrade({
        chainId: network0,
        amountSpecified: crossChainSwap || swapTransfer ? amount : undefined,
        currencyA: srcCurrencyA,
        currencyB: srcCurrencyB,
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
        (transfer || transferSwap) && bridgeFee ? amount?.subtract(bridgeFee) : undefined
      const srcMinimumAmountOutMinusStargateFee =
        (crossChainSwap || swapTransfer) && bridgeFee ? srcMinimumAmountOut?.subtract(bridgeFee) : undefined

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
              srcAmountOut.currency.decimals > dstBridgeToken.decimals ? dstBridgeToken.decimals : undefined
            ),
            dstBridgeToken
          )
        : undefined

      const dstTrade = await getTrade({
        chainId: network1,
        tradeType: TradeType.EXACT_INPUT,
        amountSpecified: crossChainSwap || transferSwap ? dstAmountIn : undefined,
        currencyA: dstCurrencyA,
        currencyB: dstCurrencyB,
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
          ? new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
          : new Percent(bridgeFee.quotient, srcMinimumAmountOut ? srcMinimumAmountOut.quotient : amount.quotient)

      let priceImpact: Percent
      if (transfer) {
        priceImpact = bridgeImpact
      } else if (crossChainSwap && srcTrade && dstTrade) {
        priceImpact = srcTrade.priceImpact.add(dstTrade.priceImpact).add(bridgeImpact)
      } else if (transferSwap && !srcTrade && dstTrade) {
        priceImpact = dstTrade.priceImpact.add(bridgeImpact)
      } else if (swapTransfer && srcTrade && !dstTrade) {
        priceImpact = srcTrade.priceImpact.add(bridgeImpact)
      } else {
        priceImpact = new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
      }

      const nanoId = nanoid()

      // console.log({ recipient, amount, network0, network1, dstMinimumAmountOut, srcRebases, dstRebases, contract })
      const [srcInputCurrencyRebase, srcOutputCurrencyRebase] = srcRebases || [undefined, undefined]
      const [, dstOutputCurrencyRebase] = dstRebases || [undefined, undefined]

      if (
        !recipient ||
        !amount ||
        !network0 ||
        !network1 ||
        !dstMinimumAmountOut ||
        !srcInputCurrencyRebase ||
        !srcOutputCurrencyRebase ||
        !dstOutputCurrencyRebase ||
        !contract
      ) {
        return {
          priceImpact: undefined,
          amountIn: undefined,
          amountOut: undefined,
          minAmountOut: undefined,
          gasSpent: undefined,
          writeArgs: undefined,
          route: undefined,
          functionName: 'cook',
          currentRouteHumanString: '',
          overrides: undefined,
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
        (srcTrade && srcTrade.route.legs.length && srcMinimumAmountOut) ||
        (dstTrade && dstTrade.route.legs.length && dstMinimumAmountOut)
      ) {
        sushiXSwap.crossChainSwap({
          srcAmount: amount,
          srcShare,
          srcMinimumAmountOut,
          srcMinimumShareOut: srcMinimumAmountOut?.toShare(srcOutputCurrencyRebase),
          dstMinimumAmountOut,
          dstMinimumShareOut: dstMinimumAmountOut?.toShare(dstOutputCurrencyRebase),
        })
      }

      if (srcAmountOut && dstAmountIn) {
        sushiXSwap.teleport(
          srcBridgeToken,
          dstBridgeToken,
          dstTrade ? dstTrade.route.gasSpent + 1000000 : undefined,
          nanoId
        )
      }
      //
      // console.log({
      //   swapPrice: price,
      //   priceImpact,
      //   amountIn: amount.toFixed(),
      //   amountOut: dstAmountOut?.toFixed(),
      //   minAmountOut: dstMinimumAmountOut.toFixed(),
      //   writeArgs: defaultAbiCoder.encode(
      //     ['uint8[]', 'uint256[]', 'bytes[]'],
      //     [sushiXSwap.srcCooker.actions, sushiXSwap.srcCooker.values, sushiXSwap.srcCooker.datas]
      //   ) as HexString,
      // })

      // need async to get fee for final value... this should be moved to exec?
      const [fee] = await sushiXSwap.getFee(dstTrade ? dstTrade.route.gasSpent + 1000000 : undefined)
      // console.log(`Successful Fee`, fee)
      const value = sushiXSwap.srcCooker.values.reduce((a, b) => a.add(b), fee)
      // console.log(`Total Value`, value)
      // Needs to be parsed to string because react-query entities are serialized to cache
      return {
        priceImpact: priceImpact.quotient.toString(),
        amountIn: amount.quotient.toString(),
        amountOut: dstAmountOut?.quotient.toString(),
        minAmountOut: dstMinimumAmountOut?.quotient.toString(),
        gasSpent: '0',
        writeArgs: [sushiXSwap.srcCooker.actions, sushiXSwap.srcCooker.values, sushiXSwap.srcCooker.datas],
        // writeArgs: defaultAbiCoder.encode(
        //   ['uint8[]', 'uint256[]', 'bytes[]'],
        //   [sushiXSwap.srcCooker.actions, sushiXSwap.srcCooker.values, sushiXSwap.srcCooker.datas]
        // ) as HexString,
        route: {},
        functionName: 'cook',
        currentRouteHumanString: '',
        overrides: { value },
      } as UseCrossChainSelect
    },
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
    keepPreviousData: !!amount,
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
          srcPools &&
          dstPools &&
          srcFeeData &&
          dstFeeData &&
          srcRebases &&
          dstRebases
      ),
  })
}

export const useCrossChainTrade = (variables: UseCrossChainTradeParams) => {
  const { token0, token1 } = variables
  const select: UseCrossChainTradeQuerySelect = useCallback(
    (data) => {
      if (data && data.amountIn && data.amountOut && data.priceImpact && data.minAmountOut) {
        const amountIn = Amount.fromRawAmount(token0, data.amountIn)
        const amountOut = Amount.fromRawAmount(token1, data.amountOut)

        return {
          ...data,
          swapPrice:
            data.amountIn && data.amountOut ? new Price({ baseAmount: amountIn, quoteAmount: amountOut }) : undefined,
          priceImpact: new Percent(data.priceImpact),
          amountIn,
          amountOut,
          minAmountOut: Amount.fromRawAmount(token1, data.minAmountOut),
        }
      }

      return {
        swapPrice: undefined,
        priceImpact: undefined,
        amountIn: undefined,
        amountOut: undefined,
        minAmountOut: undefined,
        gasSpent: undefined,
        writeArgs: undefined,
        route: undefined,
        functionName: 'cook',
        currentRouteHumanString: '',
        overrides: undefined,
      }
    },
    [token0, token1]
  )

  return useCrossChainTradeQuery(variables, select)
}
