import { TradeType } from '@sushiswap/amm'
import { UseTradeParams, useTrade } from '@sushiswap/react-query'
import { isStargateBridgeToken, STARGATE_BRIDGE_TOKENS, StargateChainId } from '@sushiswap/stargate'
import { useBentoBoxTotal, useSushiXSwapContract } from '@sushiswap/wagmi'
import { useSwapActions, useSwapState } from 'ui/trade/TradeProvider'
import { useTrade as useClientTrade } from 'lib/useClientTrade'
import { useEffect, useMemo, useState } from 'react'
import { useSlippageTolerance } from './useSlippageTolerance'
import { JSBI, Percent } from '@sushiswap/math'
import { useBridgeFees } from './useBridgeFees'
import { Price, tryParseAmount } from '@sushiswap/currency'
import { useAccount } from 'wagmi'
import { SushiXSwap } from './SushiXSwap'
import { nanoid } from 'nanoid'
import { HexString } from '@sushiswap/types'
import { defaultAbiCoder } from '@ethersproject/abi'

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

export const useCrossChainTrade = (params: UseTradeParams) => {
  const { address } = useAccount()

  const [slippageTolerance] = useSlippageTolerance()

  const swapSlippage = useMemo(
    () => (slippageTolerance ? new Percent(Number(slippageTolerance) * 100, 10_000) : SWAP_DEFAULT_SLIPPAGE),
    [slippageTolerance]
  )

  const { network0, network1, token0, token1, amount } = useSwapState()

  const contract = useSushiXSwapContract(network0)

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

  const srcInputCurrencyRebase = useBentoBoxTotal(network0, token0)
  const srcOutputCurrencyRebase = useBentoBoxTotal(network0, srcBridgeToken)

  const dstInputCurrencyRebase = useBentoBoxTotal(network1, dstBridgeToken)
  const dstOutputCurrencyRebase = useBentoBoxTotal(network1, token1)

  const srcTrade = useClientTrade(
    network0,
    TradeType.EXACT_INPUT,
    crossChainSwap || swapTransfer ? amount : undefined,
    crossChainSwap || swapTransfer ? token0 : undefined,
    crossChainSwap || swapTransfer ? srcBridgeToken : token1
  )

  const srcMinimumAmountOut = useMemo(() => srcTrade?.minimumAmountOut(swapSlippage), [srcTrade, swapSlippage])

  const [eqFee, eqReward, lpFee, protocolFee] = useBridgeFees({
    srcChainId: network0 as StargateChainId,
    dstChainId: network1 as StargateChainId,
    srcBridgeToken,
    dstBridgeToken,
    amount: crossChainSwap || swapTransfer ? srcMinimumAmountOut : amount,
  })

  const bridgeFee = useMemo(() => {
    if (!eqFee || !eqReward || !lpFee || !protocolFee) {
      return undefined
    }
    return eqFee.subtract(eqReward).add(lpFee).add(protocolFee)
  }, [eqFee, eqReward, lpFee, protocolFee])

  const srcAmountMinusStargateFee = useMemo(
    () => ((transfer || transferSwap) && bridgeFee ? amount?.subtract(bridgeFee) : undefined),
    [bridgeFee, amount, transfer, transferSwap]
  )

  const srcMinimumAmountOutMinusStargateFee = useMemo(
    () => ((crossChainSwap || swapTransfer) && bridgeFee ? srcMinimumAmountOut?.subtract(bridgeFee) : undefined),
    [bridgeFee, crossChainSwap, srcMinimumAmountOut, swapTransfer]
  )

  const srcAmountOut = useMemo(() => {
    if (transfer) {
      return srcAmountMinusStargateFee
    } else if (transferSwap) {
      return srcAmountMinusStargateFee
    } else if (swapTransfer) {
      return srcMinimumAmountOutMinusStargateFee
    } else if (crossChainSwap) {
      return srcMinimumAmountOutMinusStargateFee
    }
  }, [
    transfer,
    transferSwap,
    swapTransfer,
    crossChainSwap,
    srcAmountMinusStargateFee,
    srcMinimumAmountOutMinusStargateFee,
  ])

  const dstAmountIn = useMemo(() => {
    if (!srcAmountOut) return
    return tryParseAmount(
      srcAmountOut.toFixed(
        srcAmountOut.currency.decimals > dstBridgeToken.decimals ? dstBridgeToken.decimals : undefined
      ),
      dstBridgeToken
    )
  }, [dstBridgeToken, srcAmountOut])

  const dstTrade = useClientTrade(
    network1,
    TradeType.EXACT_INPUT,
    crossChainSwap || transferSwap ? dstAmountIn : undefined,
    crossChainSwap || transferSwap ? dstBridgeToken : undefined,
    crossChainSwap || transferSwap ? token1 : undefined
  )

  // Output amount displayed... not including slippage for sameChainSwap, transferSwap, crossChainSwap
  const dstAmountOut = useMemo(() => {
    if (transfer) {
      return dstAmountIn
    } else if (swapTransfer) {
      return dstAmountIn
    } else if (transferSwap) {
      return dstTrade?.outputAmount
    } else if (crossChainSwap) {
      return dstTrade?.outputAmount
    }
  }, [crossChainSwap, dstAmountIn, dstTrade?.outputAmount, swapTransfer, transfer, transferSwap])

  const dstMinimumAmountOut = useMemo(() => {
    if (transfer) {
      return dstAmountIn
    } else if (swapTransfer) {
      return dstAmountIn
    } else if (transferSwap) {
      return dstTrade?.minimumAmountOut(swapSlippage)
    } else if (crossChainSwap) {
      return dstTrade?.minimumAmountOut(swapSlippage)
    }
  }, [crossChainSwap, dstAmountIn, dstTrade, swapSlippage, swapTransfer, transfer, transferSwap])

  // NO OUTPUT ACTION?
  // useEffect(() => setDstTypedAmount(dstAmountOut?.toFixed() ?? ''), [dstAmountOut])

  const price = useMemo(
    () => (amount && dstAmountOut ? new Price({ baseAmount: amount, quoteAmount: dstAmountOut }) : undefined),
    [dstAmountOut, amount]
  )

  const bridgeImpact = useMemo(() => {
    if (!bridgeFee || !amount || !srcMinimumAmountOut) {
      return new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
    }
    return new Percent(bridgeFee.quotient, srcMinimumAmountOut ? srcMinimumAmountOut.quotient : amount.quotient)
  }, [bridgeFee, srcMinimumAmountOut, amount])

  const priceImpact = useMemo(() => {
    if (transfer) {
      return bridgeImpact
    } else if (crossChainSwap && srcTrade && dstTrade) {
      return srcTrade.priceImpact.add(dstTrade.priceImpact).add(bridgeImpact)
    } else if (transferSwap && !srcTrade && dstTrade) {
      return dstTrade.priceImpact.add(bridgeImpact)
    } else if (swapTransfer && srcTrade && !dstTrade) {
      return srcTrade.priceImpact.add(bridgeImpact)
    }
    return new Percent(JSBI.BigInt(0), JSBI.BigInt(10000))
  }, [srcTrade, transfer, crossChainSwap, dstTrade, transferSwap, swapTransfer, bridgeImpact])

  const [nanoId] = useState(nanoid())

  if (
    !address ||
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
  }

  const srcShare = amount.toShare(srcInputCurrencyRebase)

  // setIsWritePending(true)

  const sushiXSwap = new SushiXSwap({
    contract,
    srcToken: token0,
    dstToken: token1,
    srcTrade,
    dstTrade,
    srcUseBentoBox: false,
    dstUseBentoBox: false,
    user: address,
    debug: true,
  })

  // if (signature) {
  //   sushiXSwap.srcCooker.setMasterContractApproval(signature)
  // }

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

  console.log({
    swapPrice: price,
    priceImpact,
    amountIn: amount.toFixed(),
    amountOut: dstAmountOut?.toFixed(),
    minAmountOut: dstMinimumAmountOut.toFixed(),
    writeArgs: defaultAbiCoder.encode(
      ['uint8[]', 'uint256[]', 'bytes[]'],
      [sushiXSwap.srcCooker.actions, sushiXSwap.srcCooker.values, sushiXSwap.srcCooker.datas]
    ) as HexString,
  })

  // need async to get fee for final value... this should be moved to exec?
  // const [fee] = await this.getFee(gasSpent)
  // console.log(`Successful Fee`, fee)
  // const value = sushiXSwap.srcCooker.values.reduce((a, b) => a.add(b), fee)

  return {
    data: {
      swapPrice: price,
      priceImpact,
      amountIn: amount,
      amountOut: dstAmountOut,
      minAmountOut: dstMinimumAmountOut,
      gasSpent: 0,
      writeArgs: [sushiXSwap.srcCooker.actions, sushiXSwap.srcCooker.values, sushiXSwap.srcCooker.datas],
      // writeArgs: defaultAbiCoder.encode(
      //   ['uint8[]', 'uint256[]', 'bytes[]'],
      //   [sushiXSwap.srcCooker.actions, sushiXSwap.srcCooker.values, sushiXSwap.srcCooker.datas]
      // ) as HexString,
      route: {},
      functionName: 'cook',
      currentRouteHumanString: '',
      overrides: { value: 0 },
    },
    isLoading: false,
    isFetching: false,
  }

  // return useTrade(params)
}
